/**
 * BioPay Payment Service
 * Handles payment creation, verification, subscription activation, and referral commission calculations.
 */

import { PaymentGatewayFactory } from './paymentFactory';
import { usdtService, UsdtPaymentSession } from '../modules/payments/usdt.service';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentVerifyRequest,
  PaymentVerifyResult,
} from '../modules/payments/payment.types';

export interface PlanActivationResult {
  success: boolean;
  userId: string;
  planSlug: 'starter' | 'pro';
  activeUntil: string;
  referralCommissionCredited?: {
    referrerId: string;
    commissionPercent: number;
    commissionAmountToman: number;
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
  // In-memory payment ledger for active transactions
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
        gateway: 'ZARINPAL',
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
  public createUsdtSession(planName: 'Starter' | 'Pro' | 'ReferrerRenewal'): UsdtPaymentSession {
    return usdtService.createSession(planName);
  }

  /**
   * 2. Verify payment callback from gateway
   */
  public async verifyPayment(
    params: PaymentVerifyRequest & { userId?: string; planSlug?: 'starter' | 'pro' },
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
   * 3. Calculate referral commission based on plan
   * - Starter: 10%
   * - Pro: 15%
   */
  public calculateReferralCommission(
    planSlug: 'starter' | 'pro',
    amountToman: number
  ): { percent: number; commissionToman: number } {
    const percent = planSlug === 'pro' ? 15 : 10;
    const commissionToman = Math.round((amountToman * percent) / 100);
    return {
      percent,
      commissionToman,
    };
  }

  /**
   * 4. Activate plan subscription for user and credit referrer
   */
  public async activatePlan(params: {
    userId: string;
    planSlug: 'starter' | 'pro';
    amountToman: number;
    durationMonths?: number;
    referrerId?: string;
  }): Promise<PlanActivationResult> {
    const duration = params.durationMonths || 1;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + duration);

    let commissionResult = undefined;

    if (params.referrerId) {
      const commission = this.calculateReferralCommission(params.planSlug, params.amountToman);
      await this.creditReferrer(
        params.referrerId,
        params.userId,
        params.planSlug,
        commission.commissionToman
      );
      commissionResult = {
        referrerId: params.referrerId,
        commissionPercent: commission.percent,
        commissionAmountToman: commission.commissionToman,
      };
    }

    return {
      success: true,
      userId: params.userId,
      planSlug: params.planSlug,
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
    planSlug: 'starter' | 'pro',
    commissionToman: number
  ): Promise<{ credited: boolean; balanceToman: number }> {
    // In real app / Prisma:
    // await prisma.referral.upsert({ ... })
    // await prisma.user.update({ where: { id: referrerUserId }, data: { walletBalance: { increment: commissionToman } } })
    console.log(
      `[Referral Credit] User ${referrerUserId} credited with ${commissionToman} Toman from referee ${refereeUserId} (Plan: ${planSlug})`
    );

    return {
      credited: true,
      balanceToman: commissionToman,
    };
  }
}

export const paymentService = new PaymentService();
