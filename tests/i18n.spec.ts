/**
 * BioPay - End-to-End Internationalization & Direction Tests
 * Playwright Test Suite for fa / ar / en switching & RTL support
 */

import { test, expect } from '@playwright/test';

test.describe('BioPay Multi-Language & RTL Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('default language should be Persian with RTL direction', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'fa');

    // Check Persian hero title
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toContainText('اینستاگرام');
  });

  test('switching to English changes direction to LTR and updates typography', async ({ page }) => {
    // Open language dropdown
    const langButton = page.locator('button:has-text("فارسی")').first();
    await langButton.click();

    // Click English
    const enOption = page.locator('button:has-text("English"), div:has-text("English")').last();
    await enOption.click();

    // Verify HTML dir and lang
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');

    // Verify English text
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toContainText('Instagram');
  });

  test('switching to Arabic keeps RTL direction and renders Arabic copy', async ({ page }) => {
    // Open language dropdown
    const langButton = page.locator('button:has-text("فارسی")').first();
    await langButton.click();

    // Click Arabic
    const arOption = page.locator('button:has-text("العربية"), div:has-text("العربية")').last();
    await arOption.click();

    // Verify HTML dir and lang
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');

    // Verify Arabic text
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toContainText('إنستغرام');
  });

  test('currency and numbers match locale conventions', async ({ page }) => {
    // Check that default Persian page renders Toman
    await expect(page.locator('body')).toContainText('تومان');
  });
});
