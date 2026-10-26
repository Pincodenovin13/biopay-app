/**
 * BioPay Inactive Account Cleanup Service
 *
 * Rules:
 * 1. 7 Days of Inactivity:
 *    - Dispatch warning SMS/Email: "Your account will be deleted in 23 days if you don't log in."
 *    - Flags user warning timestamp.
 * 2. 30 Days of Inactivity:
 *    - Permanently cascades and deletes user account, stores, products, orders, and sessions.
 * 3. Daily automation via node-cron or scheduled execution.
 * 4. Admin manual trigger support with instant result statistics.
 */

type CronScheduledTask = { stop: () => void; start: () => void };

export interface InactiveAccountRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
  lastLoginAt: string;
  daysInactive: number;
  storesCount: number;
  productsCount: number;
  warningSentAt?: string;
  status: 'ACTIVE' | 'WARNING_SENT' | 'PENDING_DELETION' | 'DELETED';
}

export interface CleanupExecutionReport {
  timestamp: string;
  totalUsersChecked: number;
  warningDispatchedCount: number;
  deletedAccountsCount: number;
  affectedStoresCount: number;
  affectedProductsCount: number;
  warnings: Array<{ userId: string; emailOrPhone: string; daysInactive: number }>;
  deleted: Array<{ userId: string; emailOrPhone: string; daysInactive: number }>;
}

// In-memory mock storage for development / simulated runtime when DB connection is local/disconnected
const mockInactiveUsers: InactiveAccountRecord[] = [
  {
    id: 'user_inact_01',
    name: 'علی صابری (فروشگاه چرم صابر)',
    phone: '09121112233',
    email: 'ali.saberi@example.com',
    role: 'USER',
    lastLoginAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    daysInactive: 8,
    storesCount: 1,
    productsCount: 14,
    status: 'ACTIVE',
  },
  {
    id: 'user_inact_02',
    name: 'سارا معتمدی (گالری ترنج)',
    phone: '09359876543',
    email: 'sara.gallery@example.com',
    role: 'USER',
    lastLoginAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 days ago
    daysInactive: 32,
    storesCount: 1,
    productsCount: 42,
    status: 'PENDING_DELETION',
  },
  {
    id: 'user_inact_03',
    name: 'امیررضا کریمی (کافه کتاب سایه)',
    phone: '09194445566',
    email: 'amir.karimi@example.com',
    role: 'USER',
    lastLoginAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    daysInactive: 15,
    storesCount: 2,
    productsCount: 19,
    warningSentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'WARNING_SENT',
  },
];

export class AccountCleanupService {
  private cronJob: CronScheduledTask | null = null;
  private memoryRecords: InactiveAccountRecord[] = [...mockInactiveUsers];

  constructor() {
    this.initCronJob();
  }

  /**
   * Initialize daily scheduled cron (Runs daily at midnight 00:00)
   */
  public async initCronJob(): Promise<void> {
    if (typeof window === 'undefined') {
      try {
        const cron = await import('node-cron');
        // Daily at midnight
        this.cronJob = cron.default.schedule('0 0 * * *', async () => {
          console.log('[AccountCleanupCron] Running daily inactive account scan...');
          await this.triggerAccountCleanup();
        });
        console.log('[AccountCleanupCron] Daily cron scheduled at 00:00.');
      } catch (err) {
        console.warn('[AccountCleanupCron] Node-cron not initialized:', err);
      }
    }
  }

  /**
   * Retrieve list of currently inactive accounts (inactivity >= 7 days)
   */
  public async getInactiveAccounts(): Promise<InactiveAccountRecord[]> {
    return this.memoryRecords.filter((u) => u.status !== 'DELETED');
  }

  /**
   * Main cleanup execution:
   * - 7 to 29 days: send warning if not sent
   * - 30+ days: permanently delete
   */
  public async triggerAccountCleanup(): Promise<CleanupExecutionReport> {
    const now = Date.now();
    const warnings: Array<{ userId: string; emailOrPhone: string; daysInactive: number }> = [];
    const deleted: Array<{ userId: string; emailOrPhone: string; daysInactive: number }> = [];

    let totalStoresDeleted = 0;
    let totalProductsDeleted = 0;

    for (const record of this.memoryRecords) {
      if (record.status === 'DELETED') continue;

      const lastLoginTime = new Date(record.lastLoginAt).getTime();
      const daysInactive = Math.floor((now - lastLoginTime) / (1000 * 60 * 60 * 24));
      record.daysInactive = daysInactive;

      // 1. Condition for Permanent Deletion: >= 30 days
      if (daysInactive >= 30) {
        record.status = 'DELETED';
        totalStoresDeleted += record.storesCount;
        totalProductsDeleted += record.productsCount;
        deleted.push({
          userId: record.id,
          emailOrPhone: record.phone || record.email || record.id,
          daysInactive,
        });

        console.log(
          `[Account Cleanup] Permanently deleted inactive user ${record.id} (${record.name}) - Inactive for ${daysInactive} days.`
        );
      }
      // 2. Condition for Warning: >= 7 days and < 30 days
      else if (daysInactive >= 7 && !record.warningSentAt) {
        record.warningSentAt = new Date().toISOString();
        record.status = 'WARNING_SENT';
        warnings.push({
          userId: record.id,
          emailOrPhone: record.phone || record.email || record.id,
          daysInactive,
        });

        // Send simulated SMS/Email warning
        this.sendInactivityWarning(record);
      }
    }

    return {
      timestamp: new Date().toISOString(),
      totalUsersChecked: this.memoryRecords.length,
      warningDispatchedCount: warnings.length,
      deletedAccountsCount: deleted.length,
      affectedStoresCount: totalStoresDeleted,
      affectedProductsCount: totalProductsDeleted,
      warnings,
      deleted,
    };
  }

  /**
   * Sends the 7-day inactivity notification via SMS & Email
   */
  private sendInactivityWarning(record: InactiveAccountRecord): void {
    const warningMessageFa = `کاربر گرامی بایوپی؛ با توجه به عدم ورود شما طی ۷ روز گذشته، حساب کاربری شما و فروشگاه‌های متصل پس از ۲۳ روز دیگر به صورت دائمی حذف خواهند شد. جهت حفظ اطلاعات، لطفاً وارد پنل کاربری شوید.`;
    const warningMessageEn = `Your account will be deleted in 23 days if you don't log in.`;

    console.log(
      `[SMS/Email Warning] Sent to ${record.phone || record.email}: "${warningMessageFa}" / "${warningMessageEn}"`
    );
  }

  /**
   * Manual restore for demo/preview purposes
   */
  public resetMockData(): void {
    this.memoryRecords = [...mockInactiveUsers];
  }
}

export const accountCleanupService = new AccountCleanupService();

export const runInactiveAccountCleanup = async (): Promise<CleanupExecutionReport> => {
  return accountCleanupService.triggerAccountCleanup();
};
