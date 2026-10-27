import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { botRouter } from './src/lib/botApi';
import { recordPageView } from './src/lib/analytics.service';
import { getStoreAnalytics, recordStoreVisit } from './src/lib/store-analytics.service';
import { BIOPAY_CONFIG } from './src/lib/config';
import { initServerCleanupCron } from './src/lib/accountCleanup.server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize background tasks
  initServerCleanupCron();

  // JSON Body parsing
  app.use(express.json());

  // Analytics Middleware: Log page views asynchronously (non-blocking)
  app.use((req: Request, _res: Response, next: NextFunction) => {
    recordPageView(req).catch((err) => {
      console.warn('[Analytics Middleware Warning]', err?.message);
    });
    next();
  });

  // Mount Telegram Bot API router under /api/bot
  app.use('/api/bot', botRouter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString(), status: 'operational' });
  });

  // Store Analytics API
  app.get('/api/analytics/store/:storeId', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId || 'default_store';
      const days = Number(req.query.days) || 30;
      const data = await getStoreAnalytics(storeId, days);
      res.json({ ok: true, data });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Record store visit or product click
  app.post('/api/analytics/store/:storeId/visit', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId;
      const { productId } = req.body || {};
      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';
      await recordStoreVisit(storeId, ip, productId);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Product Creation Endpoint with Plan Limit Enforcement (PART D1)
  app.post('/api/products', (req: Request, res: Response) => {
    const { plan = 'starter', currentCount = 0, title, images = [] } = req.body || {};

    const planKey = (String(plan).toUpperCase() as 'STARTER' | 'PRO' | 'BUSINESS');
    const planConfig = BIOPAY_CONFIG.PLANS[planKey] || BIOPAY_CONFIG.PLANS.STARTER;

    // Check product quantity limit
    if (currentCount >= planConfig.maxProducts) {
      return res.status(403).json({
        ok: false,
        error: 'PLAN_LIMIT_REACHED',
        message: 'به محدودیت محصولات پلن خود رسیده‌اید.',
        currentCount,
        maxProducts: planConfig.maxProducts,
        planSlug: planConfig.slug,
      });
    }

    // Check images per product limit
    if (images.length > planConfig.maxImagesPerProduct) {
      return res.status(400).json({
        ok: false,
        error: 'IMAGE_LIMIT_EXCEEDED',
        message: `حداکثر ${planConfig.maxImagesPerProduct} تصویر برای هر محصول در پلن شما مجاز است.`,
        maxImages: planConfig.maxImagesPerProduct,
      });
    }

    // Return created product
    const newProduct = {
      id: `prod_${Date.now()}`,
      title: title || 'محصول جدید',
      images,
      plan: planConfig.slug,
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({
      ok: true,
      product: newProduct,
      remainingSlots: planConfig.maxProducts - (currentCount + 1),
    });
  });

  // Development: Mount Vite in middleware mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BioPay Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[BioPay Server] Fatal startup error:', err);
  process.exit(1);
});
