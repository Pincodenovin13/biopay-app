import { IPaymentGateway } from '../modules/payments/payment.types';
import { ZarinpalGateway } from '../modules/payments/zarinpal.gateway';

/**
 * PaymentGatewayFactory - Central registry to switch or extend payment gateways
 */
export class PaymentGatewayFactory {
  private static gateways: Map<string, IPaymentGateway> = new Map();
  private static defaultGatewayKey: string = 'zarinpal';

  static {
    // Register default Zarinpal gateway
    const defaultZarinpal = new ZarinpalGateway(
      process.env.ZARINPAL_MERCHANT_ID,
      process.env.ZARINPAL_SANDBOX !== 'false'
    );
    this.register('zarinpal', defaultZarinpal);
  }

  /**
   * Register a new gateway implementation (e.g. IdpayGateway, NextPayGateway)
   */
  public static register(key: string, gateway: IPaymentGateway): void {
    this.gateways.set(key.toLowerCase(), gateway);
  }

  /**
   * Retrieve active or specified payment gateway
   */
  public static getGateway(key?: string): IPaymentGateway {
    const targetKey = (key || this.defaultGatewayKey).toLowerCase();
    const gateway = this.gateways.get(targetKey);
    if (!gateway) {
      throw new Error(`Payment gateway '${targetKey}' is not registered in PaymentGatewayFactory.`);
    }
    return gateway;
  }

  /**
   * List all registered gateway names
   */
  public static getAvailableGateways(): string[] {
    return Array.from(this.gateways.keys());
  }
}
