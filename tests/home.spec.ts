import { test, expect } from '@playwright/test';

test.describe('Nithuri Basic Smoke Tests', () => {
  test('header has correct title', async ({ page }) => {
    await page.goto('/');
    // Use the exact title found by the browser
    await expect(page).toHaveTitle(/Nithuri/i, { timeout: 20000 });
  });

  test('hero section contains expected text', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 20000 });
    const text = await h1.innerText();
    expect(text.toLowerCase()).toContain('find');
  });

  test('login button exists', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /Login/i }).first();
    await expect(loginBtn).toBeVisible();
  });
});
