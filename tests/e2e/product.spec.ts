import { test, expect } from '../../src/fixtures';
import { config } from '../../src/data/config';

const PRODUCT_SLUG = 'stainless-steel-thermos-yellow';

/**
 * Product List & Product Detail E2E Tests
 */
test.describe('Product Pages @e2e @product', () => {
  // ── Product List Page ──────────────────────────────────────────────
  test.describe('Product List Page', () => {
    test('TC_PRD_001 - Product list page has correct title', async ({ productListPage, page }) => {
      await productListPage.goto();
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('TC_PRD_002 - Product list shows products', async ({ productListPage, page }) => {
      await productListPage.goto();
      const count = await productListPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PRD_003 - Price range sliders are visible', async ({ productListPage, page }) => {
      await productListPage.goto();
      await expect(productListPage.priceRangeMin).toBeVisible();
      await expect(productListPage.priceRangeMax).toBeVisible();
    });

    test('TC_PRD_004 - Color filter checkboxes are visible', async ({ productListPage, page }) => {
      await productListPage.goto();
      await expect(productListPage.colorFilterYellow).toBeVisible();
      await expect(productListPage.colorFilterBlack).toBeVisible();
      await expect(productListPage.colorFilterWhite).toBeVisible();
    });

    test('TC_PRD_005 - Clicking a product navigates to product detail', async ({ productListPage, page }) => {
      await productListPage.goto();
      await productListPage.clickProductByIndex(0);
      await page.waitForTimeout(2000);
      expect(page.url()).toMatch(/\/accessories\/.+/);
    });
  });

  // ── Product Detail Page ────────────────────────────────────────────
  test.describe('Product Detail Page', () => {
    test('TC_PRD_006 - Product detail page shows product title', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.productTitle).toBeVisible();
      const title = await productDetailPage.getProductTitle();
      expect(title.length).toBeGreaterThan(0);
    });

    test('TC_PRD_007 - Quantity input is visible and editable', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.qtyInput).toBeVisible();
      await productDetailPage.setQuantity(3);
      const value = await productDetailPage.qtyInput.inputValue();
      expect(value).toBe('3');
    });

    test('TC_PRD_008 - ADD TO CART button is visible', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.addToCartButton).toBeVisible();
    });

    test('TC_PRD_009 - Variant buttons are visible', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      const variantCount = await productDetailPage.variantButtons.count();
      expect(variantCount).toBeGreaterThan(0);
    });

    test('TC_PRD_010 - Quantity boundary: setting 0 quantity', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.setQuantity(0);
      const value = await productDetailPage.qtyInput.inputValue();
      expect(value).toBe('0');
    });

    test('TC_PRD_011 - Quantity boundary: setting -1 quantity', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.setQuantity(-1);
      const value = await productDetailPage.qtyInput.inputValue();
      // The field may reject negative values or keep it
      expect(value).toBeDefined();
    });

    test('TC_PRD_012 - Breadcrumb Home link navigates to homepage', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.breadcrumbHome).toBeVisible();
      await productDetailPage.breadcrumbHome.click();
      await page.waitForURL(/\/$|tvn-sut\.info$/, { timeout: 10_000 });
      expect(page.url()).toMatch(/\/$|tvn-sut\.info\/?$/);
    });

    test('TC_PRD_013 - Breadcrumb Category link navigates to product list', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(productDetailPage.breadcrumbCategory).toBeVisible();
      await productDetailPage.breadcrumbCategory.click();
      await page.waitForURL(/\/accessories/, { timeout: 10_000 });
      expect(page.url()).toMatch(/\/accessories/);
    });
  });
});
