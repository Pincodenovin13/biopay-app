/**
 * Pluggable Payment Gateway Architecture for Iranian & Middle-Eastern merchants
 */

export interface PaymentRequest {
  orderId: string;
  amount: number; // In Tomans (or IRR depending on currency config)
  description: string;
  customerPhone?: string;
  customerEmail?: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  gateway: string;
  authority: string; // Token or tracking authority from gateway
  paymentUrl: string;
  errorCode?: number | string;
  errorMessage?: string;
}

export interface PaymentVerifyRequest {
  authority: string;
  amount: number;
  orderId?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  refId: string; // Bank Shaparak reference number
  trackingCode: string;
  cardPanMasked?: string;
  feeAmount?: number;
  verifiedAt: string;
  rawStatus?: number | string;
  errorMessage?: string;
}

export interface IPaymentGateway {
  name: string;
  isSandbox: boolean;
  requestPayment(params: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(params: PaymentVerifyRequest): Promise<PaymentVerifyResult>;
}
