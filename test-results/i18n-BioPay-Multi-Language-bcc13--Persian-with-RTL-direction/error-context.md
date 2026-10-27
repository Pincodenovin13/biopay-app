# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: i18n.spec.ts >> BioPay Multi-Language & RTL Verification >> default language should be Persian with RTL direction
- Location: tests/i18n.spec.ts:14:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1').first()
Expected substring: "اینستاگرام"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('h1').first() with timeout 5000ms
  - waiting for locator('h1').first()

```

# Test source

```ts
  1  | /**
  2  |  * BioPay - End-to-End Internationalization & Direction Tests
  3  |  * Playwright Test Suite for fa / ar / en switching & RTL support
  4  |  */
  5  | 
  6  | import { test, expect } from '@playwright/test';
  7  | 
  8  | test.describe('BioPay Multi-Language & RTL Verification', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto('/');
  11 |     await page.waitForLoadState('domcontentloaded');
  12 |   });
  13 | 
  14 |   test('default language should be Persian with RTL direction', async ({ page }) => {
  15 |     const html = page.locator('html');
  16 |     await expect(html).toHaveAttribute('dir', 'rtl');
  17 |     await expect(html).toHaveAttribute('lang', 'fa');
  18 | 
  19 |     // Check Persian hero title
  20 |     const heroTitle = page.locator('h1').first();
> 21 |     await expect(heroTitle).toContainText('اینستاگرام');
     |                             ^ Error: expect(locator).toContainText(expected) failed
  22 |   });
  23 | 
  24 |   test('switching to English changes direction to LTR and updates typography', async ({ page }) => {
  25 |     // Open language dropdown
  26 |     const langButton = page.locator('button:has-text("فارسی")').first();
  27 |     await langButton.click();
  28 | 
  29 |     // Click English
  30 |     const enOption = page.locator('button:has-text("English"), div:has-text("English")').last();
  31 |     await enOption.click();
  32 | 
  33 |     // Verify HTML dir and lang
  34 |     const html = page.locator('html');
  35 |     await expect(html).toHaveAttribute('dir', 'ltr');
  36 |     await expect(html).toHaveAttribute('lang', 'en');
  37 | 
  38 |     // Verify English text
  39 |     const heroTitle = page.locator('h1').first();
  40 |     await expect(heroTitle).toContainText('Instagram');
  41 |   });
  42 | 
  43 |   test('switching to Arabic keeps RTL direction and renders Arabic copy', async ({ page }) => {
  44 |     // Open language dropdown
  45 |     const langButton = page.locator('button:has-text("فارسی")').first();
  46 |     await langButton.click();
  47 | 
  48 |     // Click Arabic
  49 |     const arOption = page.locator('button:has-text("العربية"), div:has-text("العربية")').last();
  50 |     await arOption.click();
  51 | 
  52 |     // Verify HTML dir and lang
  53 |     const html = page.locator('html');
  54 |     await expect(html).toHaveAttribute('dir', 'rtl');
  55 |     await expect(html).toHaveAttribute('lang', 'ar');
  56 | 
  57 |     // Verify Arabic text
  58 |     const heroTitle = page.locator('h1').first();
  59 |     await expect(heroTitle).toContainText('إنستغرام');
  60 |   });
  61 | 
  62 |   test('currency and numbers match locale conventions', async ({ page }) => {
  63 |     // Check that default Persian page renders Toman
  64 |     await expect(page.locator('body')).toContainText('تومان');
  65 |   });
  66 | });
  67 | 
```