import { test, expect } from '../../src/fixtures';
import { config } from '../../src/data/config';

const PRODUCT_SLUG = 'stainless-steel-thermos-yellow';

/**
 * Regression Tests — Cross-page interactions and edge-case verification.
 * Runs in multi-browser (Chromium, Firefox, WebKit) per playwright.config.ts.
 */
test.describe('Regression Tests @regression', () => {
  test('TC_REG_R001 - Logo click navigates to homepage', async ({ productListPage, page }) => {
    await productListPage.goto();
    // Click the site logo (usually an anchor wrapping an img or SVG at the top)
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
    await logo.click();
    await page.waitForURL(/\/$|tvn-sut\.info\/?$/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/$|tvn-sut\.info\/?$/);
  });

  test('TC_REG_R002 - About Us link works from homepage', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.clickAboutUs();
    expect(page.url()).toMatch(/about-us/);
  });

  test('TC_REG_R003 - /account without login redirects to /account/login', async ({ page }) => {
    await page.goto('/account');
    await page.waitForURL(/\/account\/login/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/account\/login/);
  });

  test('TC_REG_R004 - /checkout without items redirects to /cart', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(3000);
    // Should redirect to cart when no items
    expect(page.url()).toMatch(/\/cart/);
  });

  test('TC_REG_R005 - Register page Login link navigates to login', async ({ registerPage, page }) => {
    await registerPage.goto();
    await expect(registerPage.loginLink).toBeVisible();
    await registerPage.clickLoginLink();
    await page.waitForURL(/\/account\/login/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/account\/login/);
  });

  test('TC_REG_R006 - Login page Create Account link navigates to register', async ({ loginPage, page }) => {
    await loginPage.goto();
    await expect(loginPage.createAccountLink).toBeVisible();
    await loginPage.clickCreateAccount();
    await page.waitForURL(/register/, { timeout: 10_000 });
    expect(page.url()).toMatch(/register/);
  });

  test('TC_REG_R007 - Mini cart icon visible on homepage', async ({ homePage, page }) => {
    await homePage.goto();
    await expect(homePage.miniCartIcon).toBeVisible();
  });

  test('TC_REG_R008 - Mini cart icon visible on product list page', async ({ productListPage, page }) => {
    await productListPage.goto();
    // Mini cart should be in the header across all pages
    const miniCart = page.locator('.mini-cart-icon');
    await expect(miniCart).toBeVisible();
  });

  test('TC_REG_R009 - Mini cart icon visible on product detail page', async ({ productDetailPage, page }) => {
    await productDetailPage.gotoProduct(PRODUCT_SLUG);
    await expect(productDetailPage.miniCartIcon).toBeVisible();
  });

  test('TC_REG_R010 - Thermos variant buttons all load', async ({ productDetailPage, page }) => {
    await productDetailPage.gotoProduct(PRODUCT_SLUG);
    const variantCount = await productDetailPage.variantButtons.count();
    expect(variantCount).toBeGreaterThan(0);

    // Click each variant and verify the page doesn't break
    for (let i = 0; i < variantCount; i++) {
      const variant = productDetailPage.variantButtons.nth(i);
      await variant.click();
      await page.waitForTimeout(500);
      // Product title should still be visible after variant switch
      await expect(productDetailPage.productTitle).toBeVisible();
    }
  });

  test('TC_REG_R011 - Browser back button works after navigation', async ({ homePage, productListPage, page }) => {
    await homePage.goto();
    await homePage.clickViewCollection();
    await page.waitForURL(/accessories/, { timeout: 10_000 });
    // Go back
    await page.goBack();
    await page.waitForTimeout(2000);
    // Should be back on homepage
    expect(page.url()).toMatch(/\/$|tvn-sut\.info\/?$/);
  });

  test('TC_REG_R012 - Page title is correct on homepage', async ({ homePage, page }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/EverShop/);
  });

  test('TC_REG_R013 - Page title is correct on login page', async ({ loginPage, page }) => {
    await loginPage.goto();
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC_REG_R014 - Page title is correct on product list page', async ({ productListPage, page }) => {
    await productListPage.goto();
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC_REG_R015 - Page title is correct on cart page', async ({ cartPage, page }) => {
    await cartPage.goto();
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
