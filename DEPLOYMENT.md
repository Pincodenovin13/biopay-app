# BioPay Production Deployment Guide
**Target Infrastructure:** Iranian VPS (Kargadan, Rhamdatak, ParsPack, or Hetzner)  
**Operating System:** Ubuntu 22.04 LTS / 24.04 LTS  
**Architecture:** Docker + Docker Compose + PostgreSQL 16 + Nginx + Let's Encrypt SSL

---

## 1. Initial VPS Server Preparation

SSH into your VPS server as root or a sudo user:

```bash
ssh root@YOUR_SERVER_IP
```

Update system packages and install essential utilities:

```bash
apt update && apt upgrade -y
apt install -y curl wget git ufw certbot python3-certbot-nginx apt-transport-https ca-certificates gnupg lsb-release
```

Configure the UFW Firewall:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (Let's Encrypt & Redirection)
ufw allow 443/tcp   # HTTPS
ufw --force enable
ufw status
```

---

## 2. Install Docker & Docker Compose

Install Docker using the official repository:

```bash
# Add Docker GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker engine
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

---

## 3. Clone Repository & Setup Environment

```bash
# Navigate to opt or srv
cd /var/www
git clone https://github.com/your-org/biopay.git
cd biopay

# Copy environment configuration
cp .env.example .env

# Generate secure cryptographic random keys
openssl rand -hex 32 # Copy output into NEXTAUTH_SECRET and CSRF_SECRET
```

Edit your `.env` file:

```bash
nano .env
```

Ensure the following variables are customized:
- `APP_URL`: `https://biopay.me`
- `NEXTAUTH_URL`: `https://biopay.me`
- `POSTGRES_PASSWORD`: Use a strong 24+ character password
- `KAVENEGAR_API_KEY`: Your SMS gateway token
- `TELEGRAM_BOT_TOKEN`: Token obtained from `@BotFather`
- `TELEGRAM_CHANNEL_ID`: Channel for weekly payout receipts (e.g., `@BioPayPayouts`)
- `ZARINPAL_MERCHANT_ID`: Your Zarinpal merchant UUID

---

## 4. Launch Database & Run Prisma Migrations

Start PostgreSQL in the background:

```bash
docker compose up -d postgres
```

Wait until the PostgreSQL healthcheck status is healthy:

```bash
docker compose ps
```

Run database migrations to initialize the schema:

```bash
# Run Prisma migration deployment inside the app container or host
docker compose run --rm app npx prisma migrate deploy
```

Now bring up all services:

```bash
docker compose up -d --build
```

Verify that both `biopay_postgres` and `biopay_app` are up:

```bash
docker compose ps
docker compose logs -f app
```

---

## 5. Nginx Reverse Proxy Setup & Let's Encrypt SSL

Create an Nginx server block for BioPay:

```bash
nano /etc/nginx/sites-available/biopay
```

Paste the following production Nginx configuration:

```nginx
# Rate limiting zone for API protection
limit_req_zone $binary_remote_addr zone=biopay_api:10m rate=15r/s;

server {
    listen 80;
    listen [::]:80;
    server_name biopay.me www.biopay.me;

    # Certbot ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name biopay.me www.biopay.me;

    # SSL Certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/biopay.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/biopay.me/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval';" always;

    # Max upload body size for product images (2MB)
    client_max_body_size 3M;

    # API Route Rate Limiting
    location /api/ {
        limit_req zone=biopay_api burst=25 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Assets & Uploads Caching
    location /uploads/ {
        alias /var/www/biopay/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Primary Next.js Proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site configuration:

```bash
ln -s /etc/nginx/sites-available/biopay /etc/nginx/sites-enabled/
nginx -t
```

Obtain Let's Encrypt SSL certificate:

```bash
certbot --nginx -d biopay.me -d www.biopay.me --non-interactive --agree-tos --email admin@biopay.me
```

Test auto-renewal:

```bash
certbot renew --dry-run
```

Reload Nginx:

```bash
systemctl restart nginx
```

---

## 6. Daily PostgreSQL Backup Cron

Create a backup directory and script:

```bash
mkdir -p /root/backups/biopay
nano /root/backups/backup_db.sh
```

Paste:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/root/backups/biopay"
docker exec biopay_postgres pg_dump -U biopay_user biopay_db | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"
# Keep only last 14 days of backups
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +14 -delete
```

Make executable and add to crontab:

```bash
chmod +x /root/backups/backup_db.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /root/backups/backup_db.sh > /dev/null 2>&1") | crontab -
```

---

## 7. Status & Health Check

- Check running containers: `docker compose ps`
- View live application logs: `docker compose logs -f app`
- Test health endpoint: `curl -I https://biopay.me/api/health`
- Visit: `https://biopay.me`
