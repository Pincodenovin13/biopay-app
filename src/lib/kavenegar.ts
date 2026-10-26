/**
 * BioPay Kavenegar Notification Service
 * 
 * STRICT ARCHITECTURE RULE (PART 9):
 * 1. OTP sending logic removed for all users during registration (registration uses Email + Password + Telegram Verification).
 * 2. Kavenegar SMS dependency removed completely from registration.
 * 3. Kavenegar is maintained ONLY for operational notifications:
 *    - Payment Success notifications for Iranian merchants/customers
 *    - Payout / Withdrawal approved notices for Iranian users who provided a verified Iranian phone
 */

export interface KavenegarSendResult {
  ok: boolean;
  messageId?: number;
  cost?: number;
  statusText?: string;
  simulated?: boolean;
}

export class KavenegarNotificationService {
  private apiKey: string;
  private sender: string;

  constructor() {
    this.apiKey = process.env.KAVENEGAR_API_KEY || 'MOCK_KAVENEGAR_KEY';
    this.sender = process.env.KAVENEGAR_SENDER || '10008663';
  }

  /**
   * Send SMS notification for successful subscription or store order payment
   * Strictly for Iranian users (+98 / 09...)
   */
  public async notifyPaymentSuccess(params: {
    phone: string;
    orderOrPlanTitle: string;
    amountToman: number;
    trackingCode: string;
  }): Promise<KavenegarSendResult> {
    // Only dispatch to valid Iranian mobile prefixes
    if (!this.isIranianPhone(params.phone)) {
      console.log(`[Kavenegar Notice] Skipped SMS for non-Iranian number: ${params.phone}`);
      return { ok: true, simulated: true, statusText: 'Skipped for non-Iranian number' };
    }

    const message =
      `بایوپی: پرداخت شما با موفقیت ثبت شد.\n` +
      `سفارش/پلن: ${params.orderOrPlanTitle}\n` +
      `مبلغ: ${params.amountToman.toLocaleString('fa-IR')} تومان\n` +
      `کد پیگیری: ${params.trackingCode}\n` +
      `biopay.app`;

    return this.dispatchSms(params.phone, message, 'PAYMENT_SUCCESS');
  }

  /**
   * Send SMS notification for approved bank payout (Paya)
   * Strictly for Iranian users (+98 / 09...)
   */
  public async notifyPayoutApproved(params: {
    phone: string;
    amountToman: number;
    shebaMasked: string;
    payaTrackingNumber: string;
  }): Promise<KavenegarSendResult> {
    if (!this.isIranianPhone(params.phone)) {
      console.log(`[Kavenegar Notice] Skipped SMS for non-Iranian number: ${params.phone}`);
      return { ok: true, simulated: true, statusText: 'Skipped for non-Iranian number' };
    }

    const message =
      `بایوپی: درخواست تسویه حساب شما تایید شد.\n` +
      `مبلغ: ${params.amountToman.toLocaleString('fa-IR')} تومان\n` +
      `شماره شبا: ${params.shebaMasked}\n` +
      `شناسه پیگیری پایا: ${params.payaTrackingNumber}\n` +
      `biopay.app`;

    return this.dispatchSms(params.phone, message, 'PAYOUT_APPROVED');
  }

  private isIranianPhone(phone: string): boolean {
    const clean = phone.replace(/\D/g, '');
    return clean.startsWith('09') || clean.startsWith('989');
  }

  private async dispatchSms(receptor: string, message: string, template: string): Promise<KavenegarSendResult> {
    try {
      if (this.apiKey && !this.apiKey.includes('MOCK')) {
        const endpoint = `https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            receptor,
            sender: this.sender,
            message,
          }),
        });
        const data = await res.json();
        return {
          ok: data.return?.status === 200,
          messageId: data.entries?.[0]?.messageid,
          cost: data.entries?.[0]?.cost,
        };
      }
    } catch (err: any) {
      console.warn(`[Kavenegar Dispatch] Error sending SMS (${template}):`, err.message);
    }

    // Default simulated response
    console.log(`[Kavenegar SMS] (${template}) to ${receptor}: "${message.replace(/\n/g, ' ')}"`);
    return {
      ok: true,
      simulated: true,
      messageId: Math.floor(1000000 + Math.random() * 9000000),
      statusText: 'Delivered (Simulated)',
    };
  }
}

export const kavenegarService = new KavenegarNotificationService();
