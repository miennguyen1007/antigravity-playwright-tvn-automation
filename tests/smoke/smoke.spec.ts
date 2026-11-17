import { test, expect } from '../../src/fixtures';
import { config } from '../../src/data/config';

/**
 * Smoke Tests — Critical-path verification for EverShop storefront.
 * These run first in CI to fail fast if core features are broken.
 */
test.describe('Smoke Tests @smoke', () => {
  test('TC_SM_001 - Homepage loads with title "EverShop"', async ({ homePage, page }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/EverShop/);
  });

  test('TC_SM_002 - Login page loads with heading "Welcome Back"', async ({ loginPage, page }) => {
    await loginPage.goto();
    await expect(loginPage.pageHeading).toBeVisible();
    await expect(loginPage.pageHeading).toHaveText(/Welcome Back/);
  });

  test('TC_SM_003 - Register page loads with heading "Create an account"', async ({ registerPage, page }) => {
    await registerPage.goto();
    await expect(registerPage.pageHeading).toBeVisible();
    await expect(registerPage.pageHeading).toHaveText(/Create an account/);
  });

  test('TC_SM_004 - Product list page loads with products', async ({ productListPage, page }) => {
    await productListPage.goto();
    const count = await productListPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_SM_005 - Product detail page loads correctly', async ({ productDetailPage, page }) => {
    await productDetailPage.gotoProduct('stainless-steel-thermos-yellow');
    await expect(productDetailPage.productTitle).toBeVisible();
    const title = await productDetailPage.getProductTitle();
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC_SM_006 - Cart page accessible', async ({ cartPage, page }) => {
    await cartPage.goto();
    await expect(cartPage.pageHeading).toBeVisible();
  });

  test('TC_SM_007 - Navigation: Home → View Collection → Accessories', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.clickViewCollection();
    await page.waitForURL(/accessories/, { timeout: 10_000 });
    expect(page.url()).toMatch(/accessories/);
  });

  test('TC_SM_008 - Login page has Forgot password link', async ({ loginPage, page }) => {
    await loginPage.goto();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });
});
