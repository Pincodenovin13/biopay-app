/**
 * USDT TRC20 Payment Service via TronGrid API
 */

export interface UsdtPaymentSession {
  sessionId: string;
  planName: 'Starter' | 'Pro' | 'ReferrerRenewal';
  baseAmountUsdt: number;
  exactAmountUsdt: number; // base + unique fractional offset e.g. 26.0142
  depositAddress: string;
  expiresAt: number; // Unix timestamp
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED';
  confirmations: number;
  txHash?: string;
}

export class UsdtPaymentService {
  private masterWalletAddress: string;
  private tronGridApiUrl: string;

  constructor() {
    this.masterWalletAddress =
      process.env.MASTER_USDT_TRC20_WALLET || 'TLyEzSampleTronGridMasterWalletAddress2026';
    this.tronGridApiUrl =
      process.env.TRONGRID_API_URL || 'https://api.trongrid.io';
  }

  /**
   * Create a unique deposit session for the user
   */
  public createSession(planName: 'Starter' | 'Pro' | 'ReferrerRenewal'): UsdtPaymentSession {
    let baseAmount = 26;
    if (planName === 'Pro') baseAmount = 53;
    if (planName === 'ReferrerRenewal') baseAmount = 15;

    // Generate unique 4-decimal offset (e.g. 0.0123)
    const randomOffset = Math.floor(1000 + Math.random() * 9000) / 100000;
    const exactAmount = +(baseAmount + randomOffset).toFixed(4);

    return {
      sessionId: `USDT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
      planName,
      baseAmountUsdt: baseAmount,
      exactAmountUsdt: exactAmount,
      depositAddress: this.masterWalletAddress,
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes window
      status: 'PENDING',
      confirmations: 0,
    };
  }

  /**
   * Poll TronGrid API for TRC20 transfer matching exact amount
   */
  public async checkTransaction(session: UsdtPaymentSession): Promise<{
    confirmed: boolean;
    confirmations: number;
    txHash?: string;
  }> {
    try {
      if (typeof window === 'undefined' && process.env.TRONGRID_API_KEY) {
        const url = `${this.tronGridApiUrl}/v1/accounts/${session.depositAddress}/transactions/trc20?limit=20&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
        const res = await fetch(url, {
          headers: {
            'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY || '',
          },
        });
        const data = await res.json();

        if (data && data.data) {
          // USDT TRC20 has 6 decimals
          const targetUnits = Math.round(session.exactAmountUsdt * 1e6).toString();
          const match = data.data.find(
            (tx: any) => tx.value === targetUnits && tx.to === session.depositAddress
          );

          if (match) {
            return {
              confirmed: true,
              confirmations: 3,
              txHash: match.transaction_id,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn('TronGrid live check error:', err.message);
    }

    // In preview/simulation mode:
    return {
      confirmed: false,
      confirmations: 0,
    };
  }
}

export const usdtService = new UsdtPaymentService();
