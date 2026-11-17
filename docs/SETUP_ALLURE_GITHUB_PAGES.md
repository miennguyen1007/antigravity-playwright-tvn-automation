# CI/CD va Allure Report

Workflow nằm tại `.github/workflows/playwright.yml` và chạy khi push hoặc mở pull request vào `main`/`develop`. Push vào `main` sẽ chạy smoke và E2E trên Chromium; pull request cũng chạy hai nhóm này nhưng không publish Pages. Chạy thủ công từ tab **Actions** cho phép chọn `smoke`, `e2e`, `regression` hoặc `all`.

Test results được lưu thành artifact. Allure report được tạo kể cả khi có test fail, để hỗ trợ điều tra; workflow vẫn báo đỏ khi test fail. Report chỉ được publish lên GitHub Pages từ nhánh `main`.

## Cấu hình GitHub

### Secrets

Trong **Settings → Secrets and variables → Actions**, thêm các repository secrets mà test của repo cần:

| Secret | Ghi chú |
|:-------|:--------|
| `BASE_URL` | Tùy chọn; mặc định là `https://tvn-sut.info` |
| `USER_USERNAME` | Tài khoản test nếu suite cần đăng nhập |
| `USER_PASSWORD` | Mật khẩu tài khoản test |
| `ADMIN_USERNAME` | Tài khoản admin nếu suite cần |
| `ADMIN_PASSWORD` | Mật khẩu tài khoản admin |

Workflow truyền secrets trực tiếp vào môi trường của bước chạy test, không ghi chúng vào file trong workspace. Không commit credentials vào repository.

### GitHub Pages

Trong **Settings → Pages**, chọn **Deploy from a branch**, branch `gh-pages`, thư mục `/ (root)`, rồi lưu. Workflow sẽ tạo/cập nhật branch này khi có report trên `main`. URL dự kiến:

`https://miennguyen1007.github.io/antigravity-playwright-tvn-automation/`

Nếu deploy bị từ chối, kiểm tra repository có cho phép GitHub Actions ghi nội dung (`contents: write`) hay không.

## Xem report

- Trên `main`: mở URL GitHub Pages ở trên sau khi job deploy hoàn tất.
- Trên pull request hoặc nhánh khác: tải artifact `allure-report` từ trang workflow run.
- Kết quả thô nằm trong artifact `allure-results`; Playwright HTML report nằm trong `playwright-report`.

Để tạo và mở report sau khi chạy test cục bộ:

```bash
npm run report:allure:generate
npm run report:allure:open
```

