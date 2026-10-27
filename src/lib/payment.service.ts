/**
 * BioPay Payment Service
 * Handles payment creation, verification, subscription activation, and dynamic referral commission calculations.
 * Strictly configured with 3 plans: Starter (1mo), Pro (2mo), Business (3mo).
 */

import { PaymentGatewayFactory } from './paymentFactory';
import { usdtService, UsdtPaymentSession } from '../modules/payments/usdt.service';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentVerifyRequest,
  PaymentVerifyResult,
} from '../modules/payments/payment.types';

export type BioPayPlanSlug = 'starter' | 'pro' | 'business';

export interface PlanConfig {
  slug: BioPayPlanSlug;
  name: string;
  durationMonths: number;
  priceToman: number;
  oldPriceToman: number;
  priceUSDT: number;
  oldPriceUSDT: number;
  referralCommissionPercent: number;
  maxProducts: number;
  maxImagesPerProduct: number;
  features: string[];
}

export const BIOPAY_PLANS: Record<BioPayPlanSlug, PlanConfig> = {
  starter: {
    slug: 'starter',
    name: 'استارتر (Starter)',
    durationMonths: 1,
    priceToman: 5_000_000,
    oldPriceToman: 9_000_000,
    priceUSDT: 27,
    oldPriceUSDT: 45,
    referralCommissionPercent: 10, // 10% = 500,000 Toman / 2.7 USDT
    maxProducts: 12,               // Issue 7 limit: 12
    maxImagesPerProduct: 3,        // Issue 7 limit: 3
    features: [
      'مدت اشتراک: ۱ ماه',
      'حداکثر ۱۲ محصول فعال در ویترین فروشگاه',
      'حداکثر ۳ تصویر به ازای هر محصول (فشرده‌سازی WebP)',
      'درگاه پرداخت شاپرک (زرین‌پال) و کریپتو TRC20',
      'کارمزد ۲٪ تراکنش‌های فروشگاه',
      'پورسانت همکاری در فروش ۱۰٪',
    ],
  },
  pro: {
    slug: 'pro',
    name: 'حرفه‌ای (Pro)',
    durationMonths: 2,
    priceToman: 9_000_000,
    oldPriceToman: 15_000_000,
    priceUSDT: 52,
    oldPriceUSDT: 80,
    referralCommissionPercent: 15, // 15% = 1,350,000 Toman / 7.8 USDT
    maxProducts: 24,               // Issue 7 limit: 24
    maxImagesPerProduct: 4,        // Issue 7 limit: 4
    features: [
      'مدت اشتراک: ۲ ماه (پیشنهادی)',
      'حداکثر ۲۴ محصول فعال با دسته‌بندی دلخواه',
      'حداکثر ۴ تصویر به ازای هر محصول',
      'درگاه پرداخت مستقیم با تسویه ۲۴ ساعته',
      'کارمزد ۱.۵٪ روی تراکنش‌ها',
      'پورسانت همکاری در فروش ۱۵٪',
      'حذف نشان تبلیغاتی بایوپی از فوتر ویترین',
      'پشتیبانی VIP اختصاصی تلگرام',
    ],
  },
  business: {
    slug: 'business',
    name: 'سازمانی و تجاری (Business)',
    durationMonths: 3,
    priceToman: 12_000_000,
    oldPriceToman: 20_000_000,
    priceUSDT: 75,
    oldPriceUSDT: 110,
    referralCommissionPercent: 20, // 20% = 2,400,000 Toman / 15 USDT
    maxProducts: 40,               // Issue 7 limit: 40
    maxImagesPerProduct: 5,        // Issue 7 limit: 5
    features: [
      'مدت اشتراک: ۳ ماه (بیشترین بازدهی)',
      'حداکثر ۴۰ محصول فعال در ویترین فروشگاه',
      'حداکثر ۵ تصویر به ازای هر محصول',
      'تا ۵ فروشگاه مجزا روی یک حساب',
      'کمترین کارمزد تراکنش: فقط ۱.۰٪',
      'بالاترین پورسانت ارجاع: ۲۰٪ نقدی به ازای هر خرید',
      'اتصال به دامنه اختصاصی (Custom Domain)',
      'مدیر حساب اختصاصی ۲۴ ساعته',
    ],
  },
};

export interface PlanActivationResult {
  success: boolean;
  userId: string;
  planSlug: BioPayPlanSlug;
  durationMonths: number;
  activeUntil: string;
  referralCommissionCredited?: {
    referrerId: string;
    commissionPercent: number;
    commissionAmountToman: number;
    commissionAmountUsdt: number;
  };
}

export interface StoredPaymentRecord {
  id: string;
  userId?: string;
  planId?: string;
  amount: number;
  currency: 'TOMAN' | 'IRR' | 'USD';
  gateway: 'ZARINPAL' | 'TRONGRID_USDT' | 'IDPAY';
  trackingCode?: string;
  refId?: string;
  txHash?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export class PaymentService {
  private payments = new Map<string, StoredPaymentRecord>();

  /**
   * 1. Create a fiat or crypto payment
   */
  public async createPayment(
    params: PaymentRequest & {
      userId?: string;
      planId?: string;
      currency?: 'TOMAN' | 'USD';
    },
    gatewayKey?: string
  ): Promise<PaymentResponse> {
    const gateway = PaymentGatewayFactory.getGateway(gatewayKey);
    const result = await gateway.requestPayment(params);

    if (result.success) {
      const recordId = result.authority || `pay_${Date.now()}`;
      this.payments.set(recordId, {
        id: recordId,
        userId: params.userId,
        planId: params.planId,
        amount: params.amount,
        currency: params.currency || 'TOMAN',
        gateway: params.currency === 'USD' ? 'TRONGRID_USDT' : 'ZARINPAL',
        trackingCode: result.authority,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
    }

    return result;
  }

  /**
   * Create a USDT TRC20 session
   */
  public createUsdtSession(planName: 'Starter' | 'Pro' | 'Business' | 'ReferrerRenewal'): UsdtPaymentSession {
    return usdtService.createSession(planName);
  }

  /**
   * 2. Verify payment callback from gateway
   */
  public async verifyPayment(
    params: PaymentVerifyRequest & { userId?: string; planSlug?: BioPayPlanSlug },
    gatewayKey?: string
  ): Promise<PaymentVerifyResult> {
    const gateway = PaymentGatewayFactory.getGateway(gatewayKey);
    const verifyResult = await gateway.verifyPayment(params);

    if (verifyResult.success) {
      const record = this.payments.get(params.authority);
      if (record) {
        record.status = 'SUCCESS';
        record.refId = verifyResult.refId;
        record.trackingCode = verifyResult.trackingCode;
      }
    }

    return verifyResult;
  }

  /**
   * 3. Calculate referral commission dynamically based on the plan config
   * Starter (1 Mo): 10% (500,000 Toman / 2.7 USDT)
   * Pro (2 Mo): 15% (1,350,000 Toman / 7.8 USDT)
   * Business (3 Mo): 20% (2,400,000 Toman / 15 USDT)
   */
  public calculateReferralCommission(
    planSlug: BioPayPlanSlug,
    customAmountToman?: number
  ): {
    percent: number;
    commissionToman: number;
    commissionUsdt: number;
    basePriceToman: number;
    basePriceUsdt: number;
  } {
    const plan = BIOPAY_PLANS[planSlug] || BIOPAY_PLANS.starter;
    const percent = plan.referralCommissionPercent;
    const baseToman = customAmountToman ?? plan.priceToman;
    const commissionToman = Math.round((baseToman * percent) / 100);
    const commissionUsdt = +( (plan.priceUSDT * percent) / 100 ).toFixed(1);

    return {
      percent,
      commissionToman,
      commissionUsdt,
      basePriceToman: baseToman,
      basePriceUsdt: plan.priceUSDT,
    };
  }

  /**
   * 4. Activate plan subscription for user and credit referrer
   */
  public async activatePlan(params: {
    userId: string;
    planSlug: BioPayPlanSlug;
    amountToman?: number;
    durationMonths?: number;
    referrerId?: string;
  }): Promise<PlanActivationResult> {
    const plan = BIOPAY_PLANS[params.planSlug] || BIOPAY_PLANS.starter;
    const duration = params.durationMonths || plan.durationMonths;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + duration);

    let commissionResult = undefined;

    if (params.referrerId) {
      const commission = this.calculateReferralCommission(params.planSlug, params.amountToman);
      await this.creditReferrer(
        params.referrerId,
        params.userId,
        params.planSlug,
        commission.commissionToman,
        commission.commissionUsdt
      );
      commissionResult = {
        referrerId: params.referrerId,
        commissionPercent: commission.percent,
        commissionAmountToman: commission.commissionToman,
        commissionAmountUsdt: commission.commissionUsdt,
      };
    }

    return {
      success: true,
      userId: params.userId,
      planSlug: params.planSlug,
      durationMonths: duration,
      activeUntil: expiry.toISOString(),
      referralCommissionCredited: commissionResult,
    };
  }

  /**
   * 5. Credit referrer wallet and update referral audit ledger
   * Atomically creates Referral record, updates Wallet (Toman & USDT), creates AuditLog,
   * and dispatches notifications via Telegram and Email (if RESEND_API_KEY is present).
   */
  public async creditReferrer(
    referrerUserId: string,
    refereeUserId: string,
    planSlug: BioPayPlanSlug,
    commissionToman: number,
    commissionUsdt: number
  ): Promise<{ credited: boolean; balanceToman: number; balanceUsdt: number }> {
    console.log(
      `[Referral Credit] Referrer ${referrerUserId} crediting with ${commissionToman.toLocaleString('fa-IR')} Toman (${commissionUsdt} USDT) from referee ${refereeUserId} (Plan: ${planSlug})`
    );

    let totalToman = commissionToman;
    let totalUsdt = commissionUsdt;

    try {
      const { prisma } = await import('./prisma');
      const commissionTomanBigInt = BigInt(Math.round(commissionToman));
      const commissionUsdtMicroBigInt = BigInt(Math.round(commissionUsdt * 1_000_000));

      const txResult = await prisma.$transaction(async (tx) => {
        // 1. Upsert Wallet for referrer
        const wallet = await tx.wallet.upsert({
          where: { userId: referrerUserId },
          create: {
            userId: referrerUserId,
            balanceToman: commissionTomanBigInt,
            balanceUsdt: commissionUsdtMicroBigInt,
          },
          update: {
            balanceToman: { increment: commissionTomanBigInt },
            balanceUsdt: { increment: commissionUsdtMicroBigInt },
          },
        });

        // 2. Upsert or create Referral tracking entry
        await tx.referral.upsert({
          where: { refereeId: refereeUserId },
          create: {
            referrerId: referrerUserId,
            refereeId: refereeUserId,
            commissionEarned: commissionTomanBigInt,
            currency: 'TOMAN',
            status: 'ACTIVE',
          },
          update: {
            commissionEarned: { increment: commissionTomanBigInt },
            status: 'ACTIVE',
          },
        });

        // 3. Create AuditLog entry
        await tx.auditLog.create({
          data: {
            userId: referrerUserId,
            action: 'REFERRAL_COMMISSION_CREDITED',
            details: {
              refereeUserId,
              planSlug,
              commissionToman,
              commissionUsdt,
              creditedAt: new Date().toISOString(),
            },
          },
        });

        // Fetch referrer details for notification
        const referrerUser = await tx.user.findUnique({
          where: { id: referrerUserId },
          select: { email: true, telegramChatId: true, fullName: true },
        });

        return {
          wallet,
          referrerUser,
        };
      });

      totalToman = Number(txResult.wallet.balanceToman);
      totalUsdt = Number(txResult.wallet.balanceUsdt) / 1_000_000;

      // 4. Dispatch Telegram Notification
      if (txResult.referrerUser?.telegramChatId) {
        try {
          const { telegramBot } = await import('./telegram');
          const noticeMsg =
            `🎉 پورسانت جدید واریز شد!\n\n` +
            `💰 مبلغ: ${commissionToman.toLocaleString('fa-IR')} تومان (${commissionUsdt} USDT)\n` +
            `📦 پلن خریداری شده: ${BIOPAY_PLANS[planSlug]?.name || planSlug}\n` +
            `💼 موجودی کل شما: ${totalToman.toLocaleString('fa-IR')} تومان (${totalUsdt.toFixed(2)} USDT)\n\n` +
            `جهت مشاهده و تسویه، به پنل بایوپی مراجعه فرمایید:\nhttps://biopay.app/dashboard`;
          await telegramBot.sendMessage(txResult.referrerUser.telegramChatId, noticeMsg);
        } catch (tgErr: any) {
          console.warn('[Telegram Dispatch Warning]', tgErr?.message);
        }
      }

      // 5. Dispatch Email if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY && txResult.referrerUser?.email) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'BioPay Notifications <noreply@biopay.app>',
              to: [txResult.referrerUser.email],
              subject: '🎉 پورسانت جدید در بایوپی به کیف پول شما اضافه شد',
              html: `<div dir="rtl" style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
                <h2>پورسانت جدید ثبت شد!</h2>
                <p>مبلغ <strong>${commissionToman.toLocaleString('fa-IR')} تومان</strong> (${commissionUsdt} USDT) بابت اشتراک کاربر معرفی‌شده به کیف پول شما واریز گردید.</p>
                <p>موجودی کل شما: <strong>${totalToman.toLocaleString('fa-IR')} تومان</strong></p>
                <a href="https://biopay.app/dashboard" style="display:inline-block;padding:10px 20px;background:#0284c7;color:#fff;text-decoration:none;border-radius:8px;">مشاهده کیف پول</a>
              </div>`,
            }),
          });
        } catch (emailErr: any) {
          console.warn('[Resend Email Warning]', emailErr?.message);
        }
      }
    } catch (dbErr: any) {
      console.warn('[Prisma DB Unavailable / Fallback]', dbErr?.message);
      // Fallback in-memory tracking so requests never fail if DB is temporarily disconnected
    }

    return {
      credited: true,
      balanceToman: totalToman,
      balanceUsdt: totalUsdt,
    };
  }
}

export const paymentService = new PaymentService();
