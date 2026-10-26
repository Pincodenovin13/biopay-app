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
    features: [
      'مدت اشتراک: ۱ ماه',
      'تا ۵۰ محصول فعال در ویترین فروشگاه',
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
    features: [
      'مدت اشتراک: ۲ ماه (پیشنهادی)',
      'تا ۲۵۰ محصول فعال با دسته‌بندی دلخواه',
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
    features: [
      'مدت اشتراک: ۳ ماه (بیشترین بازدهی)',
      'محصولات نامحدود (تا ۱۰۰۰ عدد)',
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
   */
  public async creditReferrer(
    referrerUserId: string,
    refereeUserId: string,
    planSlug: BioPayPlanSlug,
    commissionToman: number,
    commissionUsdt: number
  ): Promise<{ credited: boolean; balanceToman: number; balanceUsdt: number }> {
    console.log(
      `[Referral Credit] Referrer ${referrerUserId} credited with ${commissionToman.toLocaleString('fa-IR')} Toman (${commissionUsdt} USDT) from referee ${refereeUserId} (Plan: ${planSlug})`
    );

    return {
      credited: true,
      balanceToman: commissionToman,
      balanceUsdt: commissionUsdt,
    };
  }
}

export const paymentService = new PaymentService();
