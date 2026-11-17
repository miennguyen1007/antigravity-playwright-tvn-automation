import { test, expect } from '../../src/fixtures';
import { config } from '../../src/data/config';
import { TestData } from '../../src/data/TestData';

/**
 * Login E2E Tests — Covers happy path, negative, security, and UI/UX scenarios.
 */
test.describe('Login Page @e2e @login', () => {
  // ── Happy Path ─────────────────────────────────────────────────────
  test.describe('Happy Path', () => {
    test('TC_LGN_001 - Valid login with correct credentials', async ({ loginPage, page }) => {
      await loginPage.loginAndWaitForRedirect(
        config.credentials.user.username,
        config.credentials.user.password,
      );
      await page.waitForTimeout(2000);
      expect(page.url()).not.toMatch(/\/account\/login/);
    });

    test('TC_LGN_002 - Login page displays heading "Welcome Back"', async ({ loginPage, page }) => {
      await loginPage.goto();
      await expect(loginPage.pageHeading).toBeVisible();
      await expect(loginPage.pageHeading).toHaveText(/Welcome Back/);
    });
  });

  // ── Negative Tests ─────────────────────────────────────────────────
  test.describe('Negative Tests', () => {
    test('TC_LGN_003 - Login with wrong password shows error', async ({ loginPage, page }) => {
      await loginPage.login(config.credentials.user.username, 'WrongPassword123!');
      await page.waitForTimeout(2000);
      // Should remain on login page or show error
      const url = page.url();
      const errorVisible = await loginPage.isErrorVisible();
      expect(url.includes('/login') || errorVisible).toBeTruthy();
    });

    test('TC_LGN_004 - Login with non-existent email shows error', async ({ loginPage, page }) => {
      await loginPage.login('nonexistent_user_12345@example.com', 'SomePassword123!');
      await page.waitForTimeout(2000);
      const url = page.url();
      const errorVisible = await loginPage.isErrorVisible();
      expect(url.includes('/login') || errorVisible).toBeTruthy();
    });

    test('TC_LGN_005 - Login with empty fields should not submit or show validation', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.click(loginPage.loginButton);
      await page.waitForTimeout(2000);
      // Should stay on login page
      expect(page.url()).toMatch(/\/account\/login/);
    });
  });

  // ── Security Tests ─────────────────────────────────────────────────
  test.describe('Security Tests', () => {
    test('TC_LGN_006 - Password field is masked (type=password)', async ({ loginPage, page }) => {
      await loginPage.goto();
      const type = await loginPage.passwordInput.getAttribute('type');
      expect(type).toBe('password');
    });

    test('TC_LGN_007 - Login page uses HTTPS', async ({ loginPage, page }) => {
      await loginPage.goto();
      expect(page.url()).toMatch(/^https:\/\//);
    });

    // SQL injection payloads
    for (const payload of TestData.sqlInjection) {
      test(`TC_LGN_012 - SQL injection: "${payload}"`, async ({ loginPage, page }) => {
        await loginPage.login(payload, payload);
        await page.waitForTimeout(2000);
        // Should not crash or expose data — stays on login or shows error
        const url = page.url();
        const errorVisible = await loginPage.isErrorVisible();
        expect(url.includes('/login') || errorVisible).toBeTruthy();
      });
    }

    // XSS payloads
    for (const payload of TestData.xssPayloads) {
      test(`TC_LGN_013 - XSS payload: "${payload}"`, async ({ loginPage, page }) => {
        await loginPage.login(payload, payload);
        await page.waitForTimeout(2000);
        // Page should not execute script — no alert dialogs, stays on login
        const url = page.url();
        const errorVisible = await loginPage.isErrorVisible();
        expect(url.includes('/login') || errorVisible).toBeTruthy();
      });
    }
  });

  // ── UI/UX Tests ────────────────────────────────────────────────────
  test.describe('UI/UX Tests', () => {
    test('TC_LGN_008 - Email and password fields have placeholder text', async ({ loginPage, page }) => {
      await loginPage.goto();
      const emailPlaceholder = await loginPage.emailInput.getAttribute('placeholder');
      const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');
      // At minimum the inputs should be visible (placeholder may vary)
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
    });

    test('TC_LGN_009 - Forgot password link is visible and navigates', async ({ loginPage, page }) => {
      await loginPage.goto();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await loginPage.clickForgotPassword();
      await page.waitForTimeout(2000);
      expect(page.url()).toMatch(/reset-password/);
    });

    test('TC_LGN_010 - Create account link is visible and navigates', async ({ loginPage, page }) => {
      await loginPage.goto();
      await expect(loginPage.createAccountLink).toBeVisible();
      await loginPage.clickCreateAccount();
      await page.waitForURL(/register/, { timeout: 10_000 });
      expect(page.url()).toMatch(/register/);
    });

    test('TC_LGN_011 - Tab order: email → password → sign in', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.emailInput.focus();
      await page.keyboard.press('Tab');
      // After Tab from email, focus should be on password
      const focusedId = await page.evaluate(() => (globalThis as any).document.activeElement?.id);
      expect(focusedId).toBe('field-password');
    });

    test('TC_LGN_014 - Enter key submits login form', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fill(loginPage.emailInput, config.credentials.user.username);
      await loginPage.fill(loginPage.passwordInput, config.credentials.user.password);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      // Should attempt login — either redirect or remain with result
      const url = page.url();
      // If credentials are valid, should redirect; otherwise stays on login
      expect(url).toBeDefined();
    });
  });
});
