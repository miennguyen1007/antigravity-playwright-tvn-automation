import { test, expect } from '../../src/fixtures';
import { config } from '../../src/data/config';

const PRODUCT_SLUG = 'stainless-steel-thermos-yellow';

/**
 * Cart E2E Tests — Empty cart and add-to-cart flow.
 */
test.describe('Cart Page @e2e @cart', () => {
  // ── Empty Cart ─────────────────────────────────────────────────────
  test.describe('Empty Cart', () => {
    test('TC_CRT_001 - Cart page shows Shopping cart heading', async ({ cartPage, page }) => {
      await cartPage.goto();
      await expect(cartPage.pageHeading).toBeVisible();
    });

    test('TC_CRT_002 - Empty cart shows empty message', async ({ cartPage, page }) => {
      await cartPage.goto();
      await expect(cartPage.emptyCartMessage.first()).toBeVisible();
    });

    test('TC_CRT_003 - CONTINUE SHOPPING button is visible', async ({ cartPage, page }) => {
      await cartPage.goto();
      await expect(cartPage.continueShoppingButton).toBeVisible();
    });

    test('TC_CRT_004 - CONTINUE SHOPPING navigates away from cart', async ({ cartPage, page }) => {
      await cartPage.goto();
      await cartPage.continueShopping();
      await page.waitForTimeout(2000);
      expect(page.url()).not.toMatch(/\/cart$/);
    });
  });

  // ── Add to Cart Flow ───────────────────────────────────────────────
  test.describe('Add to Cart Flow', () => {
    test('TC_CRT_005 - Mini cart icon is visible on product detail page', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.miniCartIcon).toBeVisible();
    });

    test('TC_CRT_006 - ADD TO CART button is visible on product detail page', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.addToCartButton).toBeVisible();
    });

    test('TC_CRT_007 - Add product to cart and verify cart page', async ({ productDetailPage, cartPage, page }) => {
      // Navigate to product and add to cart
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      // Select a variant first (required for this product)
      const variantCount = await productDetailPage.variantButtons.count();
      if (variantCount > 0) {
        await productDetailPage.variantButtons.first().click();
        await page.waitForTimeout(500);
      }
      await productDetailPage.setQuantity(1);
      await productDetailPage.addToCart();
      await page.waitForTimeout(2000);

      // Navigate to cart page
      await cartPage.goto();
      await page.waitForTimeout(2000);
      await expect(cartPage.pageHeading).toBeVisible();
    });
  });
});
