import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { botRouter } from './src/lib/botApi';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body parsing
  app.use(express.json());

  // Mount Telegram Bot API router under /api/bot
  app.use('/api/bot', botRouter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString(), status: 'operational' });
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
