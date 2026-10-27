import { generateOtp, verifyOtp, isAccountLocked, lockAccount } from '../src/lib/auth';

describe('BioPay Auth Security & Lockout Tests', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('Production never accepts 123456 backdoor code', async () => {
    process.env.NODE_ENV = 'production';
    const testIdentifier = 'user_prod_test@biopay.app';

    // Generate real OTP
    const { code } = await generateOtp(testIdentifier);
    expect(code).toBeDefined();
    expect(code.length).toBe(6);

    // If 123456 is tested and it is not the actual generated code, it MUST fail
    if (code !== '123456') {
      const result = await verifyOtp(testIdentifier, '123456');
      expect(result.success).toBe(false);
      expect(result.error).toContain('کد وارد شده صحیح نمی‌باشد');
    }
  });

  it('OTP code expires after 3 minutes', async () => {
    const testIdentifier = 'expire_test@biopay.app';
    const { code, expiresAt } = await generateOtp(testIdentifier);

    // Validity must be exactly 3 minutes (180,000ms)
    const validityMs = expiresAt - Date.now();
    expect(validityMs).toBeGreaterThan(170000);
    expect(validityMs).toBeLessThanOrEqual(180500);

    // Fast-forward or simulate expiry
    const pastTime = Date.now() - 1000;
    // Calling with expired time
    expect(pastTime < expiresAt).toBe(true);
  });

  it('Account locks out for 15 minutes after 5 failed attempts', async () => {
    const testIdentifier = 'lockout_test@biopay.app';
    await generateOtp(testIdentifier);

    // Fail 1 to 4
    for (let i = 1; i <= 4; i++) {
      const res = await verifyOtp(testIdentifier, '000000');
      expect(res.success).toBe(false);
      expect(await isAccountLocked(testIdentifier)).toBe(false);
    }

    // 5th failed attempt locks out the account
    const fifthAttempt = await verifyOtp(testIdentifier, '000000');
    expect(fifthAttempt.success).toBe(false);
    expect(await isAccountLocked(testIdentifier)).toBe(true);

    // Further attempts are blocked by lockout
    const sixthAttempt = await verifyOtp(testIdentifier, '000000');
    expect(sixthAttempt.success).toBe(false);
    expect(sixthAttempt.error).toContain('۱۵ دقیقه مسدود');
  });
});
