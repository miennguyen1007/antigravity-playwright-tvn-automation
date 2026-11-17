# 🚀 Setup Allure Report on GitHub Pages

## Bước 1: Bật GitHub Pages trong Repository Settings

1. Mở repo trên GitHub: https://github.com/miennguyen1007/antigravity-playwright-tvn-automation
2. Vào **Settings** → **Pages** (menu bên trái)
3. Tại mục **Source**, chọn:
   - **Deploy from a branch**
4. Tại mục **Branch**, chọn:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

> ⚠️ Branch `gh-pages` sẽ tự động được tạo sau lần chạy workflow đầu tiên.

## Bước 2: Cấu hình Secrets (nếu cần test với credentials)

Vào **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret Name      | Value                              |
|:-----------------|:-----------------------------------|
| `BASE_URL`       | `https://tvn-sut.info`             |
| `USER_USERNAME`  | (email đăng nhập test)             |
| `USER_PASSWORD`  | (password test)                    |
| `ADMIN_USERNAME` | (email admin, nếu có)              |
| `ADMIN_PASSWORD` | (password admin, nếu có)           |

> Nếu không cần test login, bạn có thể bỏ qua bước này.

## Bước 3: Chạy Workflow

### Tự động chạy khi push:
```bash
git add .
git commit -m "feat: add Allure Report on GitHub Pages"
git push origin main
```

### Chạy thủ công:
1. Vào tab **Actions** trên GitHub
2. Chọn workflow **🎭 Playwright Tests + Allure Report**
3. Click **Run workflow** → chọn test suite → **Run workflow**

## Bước 4: Xem Allure Report

Sau khi workflow chạy xong (2-5 phút), truy cập:

### 🔗 https://miennguyen1007.github.io/antigravity-playwright-tvn-automation/

Report bao gồm:
- ✅ **Overview**: Tổng quan pass/fail/broken
- 📊 **Graphs**: Biểu đồ trend theo từng lần chạy
- 📋 **Suites**: Chi tiết từng test suite (Smoke, E2E, Regression)
- 📸 **Attachments**: Screenshots, videos khi test fail
- 📈 **Timeline**: Thời gian chạy từng test

## Workflow Architecture

```
push to main
    │
    ▼
┌─────────────────────────────┐
│ Job 1: test                 │
│  ├─ smoke:chromium          │
│  └─ e2e:chromium            │
│  → Upload allure-results    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Job 2: allure-report        │
│  ├─ Download all results    │
│  ├─ Fetch history (gh-pages)│
│  ├─ Generate Allure Report  │
│  └─ Deploy → gh-pages      │
└──────────┬──────────────────┘
           │
           ▼
    GitHub Pages live
    (https://<user>.github.io/<repo>/)
```

