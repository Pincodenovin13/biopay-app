if (typeof window !== 'undefined') {
  throw new Error('Server cleanup runner cannot be imported on client.');
}

import cron from 'node-cron';
import { accountCleanupService } from './accountCleanup.service';

let cronJob: any = null;

export function initServerCleanupCron(): void {
  if (cronJob) return;

  try {
    cronJob = cron.schedule('0 0 * * *', async () => {
      console.log('[AccountCleanupCron] Running daily inactive account scan...');
      await accountCleanupService.triggerAccountCleanup();
    });
    console.log('[AccountCleanupCron] Daily cron scheduled at 00:00.');
  } catch (err) {
    console.warn('[AccountCleanupCron] Node-cron schedule error:', err);
  }
}
