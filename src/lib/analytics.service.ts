import crypto from 'crypto';
import { Request } from 'express';

export interface PageViewRecord {
  path: string;
  ipHash: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}

// In-memory buffer fallback for development & disconnected environments
const inMemoryPageViews: PageViewRecord[] = [];

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'biopay_salt_2026';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export function isBot(userAgent?: string): boolean {
  if (!userAgent) return false;
  return /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduckbot/i.test(userAgent);
}

export function shouldTrackPath(path: string): boolean {
  // Exclude API, static assets, Vite internals, icons
  if (path.startsWith('/api/') || path.startsWith('/@') || path.startsWith('/node_modules')) {
    return false;
  }
  if (/\.(js|css|png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|map|json)$/i.test(path)) {
    return false;
  }
  return true;
}

export async function recordPageView(req: Request): Promise<void> {
  const path = req.path || '/';
  const userAgent = req.headers['user-agent'] || '';
  const referrer = (req.headers['referer'] || req.headers['referrer'] || '') as string;
  const rawIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  if (!shouldTrackPath(path) || isBot(userAgent)) {
    return;
  }

  const ipHash = hashIp(rawIp);
  const now = new Date();

  // Try persisting to Prisma PageView model
  try {
    const { prisma } = await import('./prisma');
    await prisma.pageView.create({
      data: {
        path,
        ipHash,
        userAgent: userAgent.slice(0, 255),
        referrer: referrer ? referrer.slice(0, 255) : null,
        createdAt: now,
      },
    });
  } catch (err: any) {
    // Graceful fallback in-memory buffer
    inMemoryPageViews.push({
      path,
      ipHash,
      userAgent: userAgent.slice(0, 255),
      referrer,
      createdAt: now.toISOString(),
    });

    // Keep memory bounded to last 10,000 entries
    if (inMemoryPageViews.length > 10000) {
      inMemoryPageViews.shift();
    }
  }
}

export async function getSiteAnalytics(days: number = 7) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const { prisma } = await import('./prisma');
    const views = await prisma.pageView.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { path: true, ipHash: true, createdAt: true },
    });

    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.ipHash)).size;

    // Aggregate by day
    const dayMap = new Map<string, number>();
    views.forEach((v) => {
      const dateKey = v.createdAt.toISOString().slice(0, 10);
      dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + 1);
    });

    return {
      totalViews,
      uniqueVisitors,
      daysData: Array.from(dayMap.entries()).map(([date, count]) => ({ date, count })),
    };
  } catch {
    // Return from in-memory fallback
    const filtered = inMemoryPageViews.filter((p) => new Date(p.createdAt) >= cutoff);
    const uniqueVisitors = new Set(filtered.map((v) => v.ipHash)).size;

    return {
      totalViews: filtered.length,
      uniqueVisitors,
      daysData: [],
    };
  }
}
