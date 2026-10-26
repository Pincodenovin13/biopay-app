/**
 * BioPay Telegram Bot API Service
 * Handles endpoints:
 * - POST /api/bot/register
 * - GET  /api/bot/user/:telegramId
 * - GET  /api/bot/payouts
 * - POST /api/bot/notify
 * 
 * Validates 'x-bot-secret' against BOT_SECRET env variable.
 * Logs all operations into the audit log.
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
  verifyUserToken,
  saveUserDocuments,
  approveUserVerification,
  rejectUserVerification,
} from './userStore';

export interface AuditLogItem {
  id: string;
  action: string;
  telegramId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: any;
  createdAt: string;
}

export interface BotRegisteredUser {
  telegramId: string;
  instagramId: string;
  role: 'seller' | 'referrer';
  country?: string;
  city?: string;
  paymentMethod: 'sheba' | 'tether';
  paymentValue: string;
  language?: string;
  referralCode: string;
  referralLink: string;
  status: 'verified' | 'pending' | 'rejected';
  commission: number;
  createdAt: string;
}

export interface ApprovedPayoutItem {
  userId: string;
  amount: number;
  method: 'sheba' | 'tether';
  destination: string;
}

// Global In-Memory Stores (can be synced to Prisma / PostgreSQL)
export const botAuditLogs: AuditLogItem[] = [];

export const botUsersStore = new Map<string, BotRegisteredUser>([
  [
    '123456',
    {
      telegramId: '123456',
      instagramId: 'user_insta',
      role: 'referrer',
      country: 'Iran',
      city: 'Tehran',
      paymentMethod: 'tether',
      paymentValue: 'TXYZ1234567890abcdef',
      language: 'fa',
      referralCode: 'BIO_ABC123',
      referralLink: 'https://biopay.app/ref/BIO_ABC123',
      status: 'verified',
      commission: 2.7,
      createdAt: new Date().toISOString(),
    },
  ],
]);

export const approvedPayoutsStore: ApprovedPayoutItem[] = [
  {
    userId: 'usr_seller_01',
    amount: 5,
    method: 'tether',
    destination: 'TXYZ8899aabbccddeeff',
  },
  {
    userId: 'usr_ref_02',
    amount: 15,
    method: 'tether',
    destination: 'TTRON9988776655443322',
  },
];

export const botNotificationsQueue: Array<{
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
}> = [];

/**
 * Audit log helper
 */
export function logAudit(req: Request, action: string, details: any, userId?: string, telegramId?: string) {
  const logItem: AuditLogItem = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    action,
    userId,
    telegramId,
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'TelegramBot',
    details,
    createdAt: new Date().toISOString(),
  };
  botAuditLogs.push(logItem);
  return logItem;
}

/**
 * Authentication middleware for x-bot-secret
 */
export function botSecretAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const secretHeader = req.headers['x-bot-secret'];
  const expectedSecret = process.env.BOT_SECRET || 'biopay_bot_secret_2026';

  if (!secretHeader || secretHeader !== expectedSecret) {
    logAudit(req, 'BOT_AUTH_FAILED', {
      receivedHeader: secretHeader ? 'present_invalid' : 'missing',
    });
    res.status(401).json({
      ok: false,
      error: 'Unauthorized: Invalid or missing x-bot-secret header',
    });
    return;
  }

  next();
}

/**
 * Bot Express Router
 */
export const botRouter = Router();

// Apply auth middleware to all /api/bot endpoints
botRouter.use(botSecretAuthMiddleware);

/**
 * 8.1 POST /api/bot/register
 * Called by the bot when admin approves a user.
 */
botRouter.post('/register', (req: Request, res: Response): void => {
  try {
    const { telegramId, instagramId, role, country, city, paymentMethod, paymentValue, language } = req.body;

    if (!telegramId || !instagramId || !role || !paymentMethod || !paymentValue) {
      logAudit(req, 'BOT_REGISTER_FAILED_VALIDATION', { body: req.body });
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing required fields (telegramId, instagramId, role, paymentMethod, paymentValue)',
      });
      return;
    }

    if (role !== 'seller' && role !== 'referrer') {
      res.status(400).json({
        ok: false,
        error: "Bad Request: role must be either 'seller' or 'referrer'",
      });
      return;
    }

    if (paymentMethod !== 'sheba' && paymentMethod !== 'tether') {
      res.status(400).json({
        ok: false,
        error: "Bad Request: paymentMethod must be either 'sheba' or 'tether'",
      });
      return;
    }

    // Generate unique referral code and link
    const cleanId = String(telegramId).replace(/\D/g, '').slice(-6) || Math.random().toString(36).substring(2, 8).toUpperCase();
    const referralCode = `BIO_${cleanId}`;
    const referralLink = `https://biopay.app/ref/${referralCode}`;

    const newUser: BotRegisteredUser = {
      telegramId: String(telegramId),
      instagramId: String(instagramId),
      role,
      country: country || 'Iran',
      city: city || 'Tehran',
      paymentMethod,
      paymentValue: String(paymentValue),
      language: language || 'fa',
      referralCode,
      referralLink,
      status: 'verified',
      commission: role === 'referrer' ? 2.7 : 0,
      createdAt: new Date().toISOString(),
    };

    botUsersStore.set(String(telegramId), newUser);

    logAudit(req, 'BOT_USER_REGISTERED', {
      telegramId,
      instagramId,
      role,
      referralCode,
    }, undefined, String(telegramId));

    res.status(200).json({
      ok: true,
      referralLink,
    });
  } catch (error: any) {
    logAudit(req, 'BOT_REGISTER_INTERNAL_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 8.2 GET /api/bot/user/:telegramId
 * Returns user status, commission, referral link.
 */
botRouter.get('/user/:telegramId', (req: Request, res: Response): void => {
  try {
    const { telegramId } = req.params;

    if (!telegramId) {
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing telegramId parameter',
      });
      return;
    }

    const user = botUsersStore.get(telegramId);

    if (!user) {
      logAudit(req, 'BOT_USER_NOT_FOUND', { telegramId });
      res.status(404).json({
        ok: false,
        error: `User with telegramId ${telegramId} not found`,
      });
      return;
    }

    logAudit(req, 'BOT_GET_USER', { telegramId }, undefined, telegramId);

    res.status(200).json({
      ok: true,
      data: {
        status: user.status,
        commission: user.commission,
        referralLink: user.referralLink,
      },
    });
  } catch (error: any) {
    logAudit(req, 'BOT_USER_INTERNAL_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 8.3 GET /api/bot/payouts
 * Returns this week's approved payouts (for future cron job).
 */
botRouter.get('/payouts', (req: Request, res: Response): void => {
  try {
    logAudit(req, 'BOT_GET_PAYOUTS', { count: approvedPayoutsStore.length });

    res.status(200).json({
      ok: true,
      data: approvedPayoutsStore,
    });
  } catch (error: any) {
    logAudit(req, 'BOT_PAYOUTS_INTERNAL_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 8.4 POST /api/bot/notify
 * Called by the bot to send a notification (for future use).
 */
botRouter.post('/notify', (req: Request, res: Response): void => {
  try {
    const { userId, message, type } = req.body;

    if (!userId || !message || !type) {
      logAudit(req, 'BOT_NOTIFY_FAILED_VALIDATION', { body: req.body });
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing required fields (userId, message, type)',
      });
      return;
    }

    if (type !== 'info' && type !== 'warning' && type !== 'success') {
      res.status(400).json({
        ok: false,
        error: "Bad Request: type must be 'info', 'warning', or 'success'",
      });
      return;
    }

    botNotificationsQueue.push({
      userId: String(userId),
      message: String(message),
      type,
      timestamp: new Date().toISOString(),
    });

    logAudit(req, 'BOT_NOTIFICATION_QUEUED', { userId, type, message }, String(userId));

    res.status(200).json({
      ok: true,
      message: 'Notification queued successfully',
    });
  } catch (error: any) {
    logAudit(req, 'BOT_NOTIFY_INTERNAL_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 7.1 POST /api/bot/verify-token
 * Request: { "token": "uuid", "telegramId": "123456" }
 * Response: { "ok": true, "userId": "..." }
 */
botRouter.post('/verify-token', (req: Request, res: Response): void => {
  try {
    const { token, telegramId } = req.body;

    if (!token) {
      logAudit(req, 'BOT_VERIFY_TOKEN_MISSING_TOKEN', { body: req.body });
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing token parameter',
      });
      return;
    }

    const result = verifyUserToken(String(token), telegramId ? String(telegramId) : undefined);

    if (!result.ok || !result.user) {
      logAudit(req, 'BOT_VERIFY_TOKEN_INVALID', { token, telegramId });
      res.status(404).json({
        ok: false,
        error: result.error || 'Token not found or expired (tokens expire after 24 hours)',
      });
      return;
    }

    logAudit(req, 'BOT_VERIFY_TOKEN_SUCCESS', {
      userId: result.user.id,
      email: result.user.email,
      telegramId,
    }, result.user.id, telegramId ? String(telegramId) : undefined);

    res.status(200).json({
      ok: true,
      userId: result.user.id,
      status: result.user.status,
      email: result.user.email,
    });
  } catch (error: any) {
    logAudit(req, 'BOT_VERIFY_TOKEN_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 7.2 POST /api/bot/save-documents
 * Request: { "userId": "...", "instagramId": "...", "fullName": "...", "country": "...", "city": "..." }
 * Response: { "ok": true }
 */
botRouter.post('/save-documents', (req: Request, res: Response): void => {
  try {
    const { userId, instagramId, fullName, country, city } = req.body;

    if (!userId || !instagramId || !fullName || !country || !city) {
      logAudit(req, 'BOT_SAVE_DOCS_MISSING_FIELDS', { body: req.body });
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing required text fields (userId, instagramId, fullName, country, city)',
      });
      return;
    }

    const result = saveUserDocuments({
      userId: String(userId),
      instagramId: String(instagramId),
      fullName: String(fullName),
      country: String(country),
      city: String(city),
    });

    if (!result.ok || !result.user) {
      logAudit(req, 'BOT_SAVE_DOCS_FAILED', { userId });
      res.status(404).json({
        ok: false,
        error: result.error || 'User not found',
      });
      return;
    }

    logAudit(req, 'BOT_SAVE_DOCS_SUCCESS', {
      userId,
      instagramId,
      fullName,
      country,
      city,
    }, userId);

    res.status(200).json({
      ok: true,
    });
  } catch (error: any) {
    logAudit(req, 'BOT_SAVE_DOCS_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 7.3 POST /api/bot/approve
 * Request: { "userId": "..." }
 * Response: { "ok": true, "referralLink": "...", "storeLink": "..." }
 */
botRouter.post('/approve', (req: Request, res: Response): void => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing userId parameter',
      });
      return;
    }

    const result = approveUserVerification(String(userId));

    if (!result.ok || !result.user) {
      logAudit(req, 'BOT_APPROVE_FAILED', { userId });
      res.status(404).json({
        ok: false,
        error: result.error || 'User not found',
      });
      return;
    }

    logAudit(req, 'BOT_APPROVE_SUCCESS', {
      userId,
      status: result.user.status,
      referralLink: result.referralLink,
      storeLink: result.storeLink,
    }, userId);

    res.status(200).json({
      ok: true,
      referralLink: result.referralLink,
      storeLink: result.storeLink,
    });
  } catch (error: any) {
    logAudit(req, 'BOT_APPROVE_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * 7.4 POST /api/bot/reject
 * Request: { "userId": "...", "reason": "..." }
 * Response: { "ok": true }
 */
botRouter.post('/reject', (req: Request, res: Response): void => {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      res.status(400).json({
        ok: false,
        error: 'Bad Request: Missing userId parameter',
      });
      return;
    }

    const result = rejectUserVerification(String(userId), reason ? String(reason) : undefined);

    if (!result.ok || !result.user) {
      logAudit(req, 'BOT_REJECT_FAILED', { userId });
      res.status(404).json({
        ok: false,
        error: result.error || 'User not found',
      });
      return;
    }

    logAudit(req, 'BOT_REJECT_SUCCESS', {
      userId,
      reason,
      status: result.user.status,
    }, userId);

    res.status(200).json({
      ok: true,
    });
  } catch (error: any) {
    logAudit(req, 'BOT_REJECT_ERROR', { error: error.message });
    res.status(500).json({
      ok: false,
      error: 'Internal Server Error',
    });
  }
});
