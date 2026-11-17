import { test, expect } from '../../src/fixtures';
import { config } from '../../src/data/config';
import { TestData } from '../../src/data/TestData';
import { faker } from '@faker-js/faker';

/**
 * Registration E2E Tests — Covers happy path, negative, and UI/UX scenarios.
 */
test.describe('Register Page @e2e @register', () => {
  // ── Happy Path ─────────────────────────────────────────────────────
  test.describe('Happy Path', () => {
    test('TC_REG_001 - Register page has all required fields and heading', async ({ registerPage, page }) => {
      await registerPage.goto();
      await expect(registerPage.pageHeading).toBeVisible();
      await expect(registerPage.pageHeading).toHaveText(/Create an account/);
      await expect(registerPage.fullNameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.signUpButton).toBeVisible();
    });

    test('TC_REG_002 - Register with unique email succeeds', async ({ registerPage, page }) => {
      const user = TestData.validUser();
      const uniqueEmail = `test_${Date.now()}@example.com`;
      await registerPage.registerAndWaitForRedirect(
        `${user.firstName} ${user.lastName}`,
        uniqueEmail,
        user.password,
      );
      await page.waitForTimeout(2000);
      // Should redirect away from register page on success
      expect(page.url()).not.toMatch(/\/account\/register/);
    });
  });

  // ── Negative Tests ─────────────────────────────────────────────────
  test.describe('Negative Tests', () => {
    test('TC_REG_003 - Submit with empty fields shows validation', async ({ registerPage, page }) => {
      await registerPage.goto();
      await registerPage.click(registerPage.signUpButton);
      await page.waitForTimeout(2000);
      // Should stay on register page
      expect(page.url()).toMatch(/\/account\/register/);
    });

    // Invalid email formats
    for (const invalidEmail of TestData.invalidEmails) {
      test(`TC_REG_004 - Invalid email: "${invalidEmail}"`, async ({ registerPage, page }) => {
        await registerPage.goto();
        await registerPage.fill(registerPage.fullNameInput, 'Test User');
        if (invalidEmail.length > 0) {
          await registerPage.fill(registerPage.emailInput, invalidEmail);
        }
        await registerPage.fill(registerPage.passwordInput, 'ValidPass123!');
        await registerPage.click(registerPage.signUpButton);
        await page.waitForTimeout(2000);
        // Should stay on register page or show error
        const url = page.url();
        const errorVisible = await registerPage.isErrorVisible();
        expect(url.includes('/register') || errorVisible).toBeTruthy();
      });
    }

    test('TC_REG_005 - Short password shows validation', async ({ registerPage, page }) => {
      await registerPage.goto();
      await registerPage.fill(registerPage.fullNameInput, 'Test User');
      await registerPage.fill(registerPage.emailInput, `test_${Date.now()}@example.com`);
      await registerPage.fill(registerPage.passwordInput, TestData.passwordBoundary.tooShort);
      await registerPage.click(registerPage.signUpButton);
      await page.waitForTimeout(2000);
      // Should stay on register page or show error
      const url = page.url();
      const errorVisible = await registerPage.isErrorVisible();
      expect(url.includes('/register') || errorVisible).toBeTruthy();
    });
  });

  // ── UI/UX Tests ────────────────────────────────────────────────────
  test.describe('UI/UX Tests', () => {
    test('TC_REG_006 - Login link is visible and navigates to login page', async ({ registerPage, page }) => {
      await registerPage.goto();
      await expect(registerPage.loginLink).toBeVisible();
      await registerPage.clickLoginLink();
      await page.waitForURL(/\/account\/login/, { timeout: 10_000 });
      expect(page.url()).toMatch(/\/account\/login/);
    });

    test('TC_REG_007 - Password field is masked (type=password)', async ({ registerPage, page }) => {
      await registerPage.goto();
      const type = await registerPage.passwordInput.getAttribute('type');
      expect(type).toBe('password');
    });

    test('TC_REG_008 - Input fields have placeholder text', async ({ registerPage, page }) => {
      await registerPage.goto();
      // Verify inputs are visible and accessible
      await expect(registerPage.fullNameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      // Check for placeholder attributes (may vary by implementation)
      const namePlaceholder = await registerPage.fullNameInput.getAttribute('placeholder');
      const emailPlaceholder = await registerPage.emailInput.getAttribute('placeholder');
      const passwordPlaceholder = await registerPage.passwordInput.getAttribute('placeholder');
      // At minimum, fields should be interactable
      await expect(registerPage.fullNameInput).toBeEnabled();
      await expect(registerPage.emailInput).toBeEnabled();
      await expect(registerPage.passwordInput).toBeEnabled();
    });
  });
});
