import { PaymentGatewayFactory } from '../../lib/paymentFactory';
import { PaymentRequest, PaymentResponse, PaymentVerifyRequest, PaymentVerifyResult } from './payment.types';

export class PaymentService {
  /**
   * Initiate a payment flow through the designated gateway
   */
  public async createPayment(params: PaymentRequest, gatewayKey?: string): Promise<PaymentResponse> {
    const gateway = PaymentGatewayFactory.getGateway(gatewayKey);
    return await gateway.requestPayment(params);
  }

  /**
   * Complete payment verification on user return from bank portal
   */
  public async verifyPayment(params: PaymentVerifyRequest, gatewayKey?: string): Promise<PaymentVerifyResult> {
    const gateway = PaymentGatewayFactory.getGateway(gatewayKey);
    return await gateway.verifyPayment(params);
  }
}

export const paymentService = new PaymentService();
