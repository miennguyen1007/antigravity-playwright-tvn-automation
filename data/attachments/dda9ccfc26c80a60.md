# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/login.spec.ts >> Login Page @e2e @login >> Happy Path >> TC_LGN_001 - Valid login with correct credentials
- Location: tests/e2e/login.spec.ts:11:9

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /\/account\/login/
Received string:      "https://tvn-sut.info/account/login"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - navigation [ref=e9]:
        - navigation [ref=e12]:
          - list [ref=e13]:
            - listitem [ref=e14]:
              - button "Shop" [ref=e15]
            - listitem [ref=e18]:
              - link "About us" [ref=e19] [cursor=pointer]:
                - /url: /page/about-us
      - link [ref=e22] [cursor=pointer]:
        - /url: /
      - generic [ref=e27]:
        - link [ref=e29] [cursor=pointer]:
          - /url: "#"
        - link [ref=e34] [cursor=pointer]:
          - /url: https://tvn-sut.info/account/login
        - button "Shopping cart with 0 items" [ref=e40] [cursor=pointer]
  - main [ref=e44]:
    - navigation "breadcrumb" [ref=e47]:
      - list [ref=e48]:
        - listitem [ref=e49]:
          - link "Home" [ref=e50] [cursor=pointer]:
            - /url: /
        - listitem [aria-hidden] [ref=e51]
        - listitem [ref=e54]:
          - link "Login" [disabled] [ref=e55]
    - generic [ref=e56]:
      - generic [ref=e60]:
        - heading "Welcome Back!" [level=1] [ref=e61]
        - paragraph [ref=e62]: Please sign in to your account
        - group [ref=e64]:
          - generic [ref=e65]:
            - group [ref=e66]:
              - generic [ref=e67]:
                - text: Email
                - generic [ref=e68]: "*"
              - group [ref=e69]:
                - textbox "Email *" [ref=e70]:
                  - /placeholder: Email
                  - text: user@tvn-sut.info
                - group [ref=e71]
            - group [ref=e75]:
              - generic [ref=e76]:
                - text: Password
                - generic [ref=e77]: "*"
              - group [ref=e78]:
                - textbox "Password *" [active] [invalid] [ref=e79]:
                  - /placeholder: Password
                - group [ref=e80]
                - group [ref=e85]:
                  - button [ref=e86]
              - alert [ref=e93]: Password is required
            - button "Sign In" [ref=e95]
      - generic [ref=e96]:
        - link "Create an account" [ref=e97] [cursor=pointer]:
          - /url: https://tvn-sut.info/account/register
        - link "Forgot your password?" [ref=e98] [cursor=pointer]:
          - /url: https://tvn-sut.info/account/reset-password
  - contentinfo [ref=e99]:
    - generic [ref=e101]:
      - img "PayPal" [ref=e117]
      - generic [ref=e123]: © 2022 Evershop. All Rights Reserved.
```

# Test source

```ts
  1   | import { test, expect } from '../../src/fixtures';
  2   | import { config } from '../../src/data/config';
  3   | import { TestData } from '../../src/data/TestData';
  4   | 
  5   | /**
  6   |  * Login E2E Tests — Covers happy path, negative, security, and UI/UX scenarios.
  7   |  */
  8   | test.describe('Login Page @e2e @login', () => {
  9   |   // ── Happy Path ─────────────────────────────────────────────────────
  10  |   test.describe('Happy Path', () => {
  11  |     test('TC_LGN_001 - Valid login with correct credentials', async ({ loginPage, page }) => {
  12  |       await loginPage.loginAndWaitForRedirect(
  13  |         config.credentials.user.username,
  14  |         config.credentials.user.password,
  15  |       );
  16  |       await page.waitForTimeout(2000);
> 17  |       expect(page.url()).not.toMatch(/\/account\/login/);
      |                              ^ Error: expect(received).not.toMatch(expected)
  18  |     });
  19  | 
  20  |     test('TC_LGN_002 - Login page displays heading "Welcome Back"', async ({ loginPage, page }) => {
  21  |       await loginPage.goto();
  22  |       await expect(loginPage.pageHeading).toBeVisible();
  23  |       await expect(loginPage.pageHeading).toHaveText(/Welcome Back/);
  24  |     });
  25  |   });
  26  | 
  27  |   // ── Negative Tests ─────────────────────────────────────────────────
  28  |   test.describe('Negative Tests', () => {
  29  |     test('TC_LGN_003 - Login with wrong password shows error', async ({ loginPage, page }) => {
  30  |       await loginPage.login(config.credentials.user.username, 'WrongPassword123!');
  31  |       await page.waitForTimeout(2000);
  32  |       // Should remain on login page or show error
  33  |       const url = page.url();
  34  |       const errorVisible = await loginPage.isErrorVisible();
  35  |       expect(url.includes('/login') || errorVisible).toBeTruthy();
  36  |     });
  37  | 
  38  |     test('TC_LGN_004 - Login with non-existent email shows error', async ({ loginPage, page }) => {
  39  |       await loginPage.login('nonexistent_user_12345@example.com', 'SomePassword123!');
  40  |       await page.waitForTimeout(2000);
  41  |       const url = page.url();
  42  |       const errorVisible = await loginPage.isErrorVisible();
  43  |       expect(url.includes('/login') || errorVisible).toBeTruthy();
  44  |     });
  45  | 
  46  |     test('TC_LGN_005 - Login with empty fields should not submit or show validation', async ({ loginPage, page }) => {
  47  |       await loginPage.goto();
  48  |       await loginPage.click(loginPage.loginButton);
  49  |       await page.waitForTimeout(2000);
  50  |       // Should stay on login page
  51  |       expect(page.url()).toMatch(/\/account\/login/);
  52  |     });
  53  |   });
  54  | 
  55  |   // ── Security Tests ─────────────────────────────────────────────────
  56  |   test.describe('Security Tests', () => {
  57  |     test('TC_LGN_006 - Password field is masked (type=password)', async ({ loginPage, page }) => {
  58  |       await loginPage.goto();
  59  |       const type = await loginPage.passwordInput.getAttribute('type');
  60  |       expect(type).toBe('password');
  61  |     });
  62  | 
  63  |     test('TC_LGN_007 - Login page uses HTTPS', async ({ loginPage, page }) => {
  64  |       await loginPage.goto();
  65  |       expect(page.url()).toMatch(/^https:\/\//);
  66  |     });
  67  | 
  68  |     // SQL injection payloads
  69  |     for (const payload of TestData.sqlInjection) {
  70  |       test(`TC_LGN_012 - SQL injection: "${payload}"`, async ({ loginPage, page }) => {
  71  |         await loginPage.login(payload, payload);
  72  |         await page.waitForTimeout(2000);
  73  |         // Should not crash or expose data — stays on login or shows error
  74  |         const url = page.url();
  75  |         const errorVisible = await loginPage.isErrorVisible();
  76  |         expect(url.includes('/login') || errorVisible).toBeTruthy();
  77  |       });
  78  |     }
  79  | 
  80  |     // XSS payloads
  81  |     for (const payload of TestData.xssPayloads) {
  82  |       test(`TC_LGN_013 - XSS payload: "${payload}"`, async ({ loginPage, page }) => {
  83  |         await loginPage.login(payload, payload);
  84  |         await page.waitForTimeout(2000);
  85  |         // Page should not execute script — no alert dialogs, stays on login
  86  |         const url = page.url();
  87  |         const errorVisible = await loginPage.isErrorVisible();
  88  |         expect(url.includes('/login') || errorVisible).toBeTruthy();
  89  |       });
  90  |     }
  91  |   });
  92  | 
  93  |   // ── UI/UX Tests ────────────────────────────────────────────────────
  94  |   test.describe('UI/UX Tests', () => {
  95  |     test('TC_LGN_008 - Email and password fields have placeholder text', async ({ loginPage, page }) => {
  96  |       await loginPage.goto();
  97  |       const emailPlaceholder = await loginPage.emailInput.getAttribute('placeholder');
  98  |       const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');
  99  |       // At minimum the inputs should be visible (placeholder may vary)
  100 |       await expect(loginPage.emailInput).toBeVisible();
  101 |       await expect(loginPage.passwordInput).toBeVisible();
  102 |     });
  103 | 
  104 |     test('TC_LGN_009 - Forgot password link is visible and navigates', async ({ loginPage, page }) => {
  105 |       await loginPage.goto();
  106 |       await expect(loginPage.forgotPasswordLink).toBeVisible();
  107 |       await loginPage.clickForgotPassword();
  108 |       await page.waitForTimeout(2000);
  109 |       expect(page.url()).toMatch(/reset-password/);
  110 |     });
  111 | 
  112 |     test('TC_LGN_010 - Create account link is visible and navigates', async ({ loginPage, page }) => {
  113 |       await loginPage.goto();
  114 |       await expect(loginPage.createAccountLink).toBeVisible();
  115 |       await loginPage.clickCreateAccount();
  116 |       await page.waitForURL(/register/, { timeout: 10_000 });
  117 |       expect(page.url()).toMatch(/register/);
```