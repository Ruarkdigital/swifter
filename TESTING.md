# SwiftPro Testing Guide

This document provides a comprehensive guide to the testing structure and practices for the SwiftPro procurement platform.

## Testing Architecture

The testing structure has been localized to each feature page, following a modular approach that keeps tests close to the code they're testing.

### Directory Structure

```
src/pages/
├── CompaniesPage/
│   ├── __tests__/
│   │   ├── companies.spec.ts
│   │   ├── companies-api.spec.ts
│   │   ├── companies-detailed.spec.ts
│   │   ├── companies-performance.spec.ts
│   │   ├── run-tests.cjs
│   │   └── utils/
│   │       └── test-helpers.ts
│   └── index.tsx
├── AdminManagementPage/
│   ├── __tests__/
│   │   └── admin-management.spec.ts
│   └── index.tsx
├── EvaluationManagementPage/
│   ├── __tests__/
│   │   └── evaluation-management.spec.ts
│   └── index.tsx
├── VendorManagementPage/
│   ├── __tests__/
│   │   └── vendor-management.spec.ts
│   └── index.tsx
├── ProjectManagementPage/
│   ├── __tests__/
│   │   └── project-management.spec.ts
│   └── index.tsx
├── ContractManagementPage/
│   ├── __tests__/
│   │   └── contract-management.spec.ts
│   └── index.tsx
├── ReportsPage/
│   ├── __tests__/
│   │   └── reports.spec.ts
│   └── index.tsx
└── SettingsPage/
    ├── __tests__/
    │   └── settings.spec.ts
    └── index.tsx
```

## Testing Framework

We use **Playwright** for end-to-end testing, which provides:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Auto-wait capabilities
- Network interception
- Screenshot and video recording
- Parallel test execution

## Test Categories

### 1. Companies Page Tests
The most comprehensive test suite covering:
- **Basic Tests** (`companies.spec.ts`): Core functionality, navigation, display
- **API Tests** (`companies-api.spec.ts`): API interactions, data fetching, error handling
- **Detailed Tests** (`companies-detailed.spec.ts`): Complex user interactions, forms
- **Performance Tests** (`companies-performance.spec.ts`): Load times, responsiveness

### 2. Feature-Specific Tests
Each feature page has its own test suite covering:
- Page navigation and display
- CRUD operations
- Form validations
- Search and filtering
- Pagination
- Error handling
- Responsive design
- Dark mode compatibility

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Playwright** (installed as dev dependency)

### Installation

```bash
# Install Playwright (if not already installed)
npm install --save-dev @playwright/test

# Install browser binaries
npx playwright install
```

### Running Tests

#### Individual Feature Tests

```bash
# Companies page tests (with custom runner)
npm run test:companies

# Admin management tests
npm run test:admin

# Evaluation management tests
npm run test:evaluation

# Vendor management tests
npm run test:vendor

# Project management tests
npm run test:project

# Contract management tests
npm run test:contract

# Reports tests
npm run test:reports

# Settings tests
npm run test:settings
```

#### All Feature Tests

```bash
# Run all feature tests sequentially
npm run test:all-features

# Run all tests (including any global tests)
npm test
```

#### Test Modes

```bash
# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report
```

## 📁 Test Structure

```
tests/
├── companies.spec.ts              # Basic functionality tests
├── companies-detailed.spec.ts     # Detailed component tests
├── companies-api.spec.ts          # API integration tests
├── companies-performance.spec.ts  # Performance & accessibility tests
└── utils/
    └── test-helpers.ts            # Shared utilities and helpers

playwright.config.ts               # Playwright configuration
run-companies-tests.cjs            # Custom test runner script
```

## 🧪 Test Categories

### 1. Basic Functionality Tests (`companies.spec.ts`)

- **Authentication & Navigation**
  - Login flow
  - Navigation to companies page
  - Route protection

- **CRUD Operations**
  - Create new company
  - View company details
  - Update company information
  - Delete company
  - Status management (activate/suspend)

- **Data Management**
  - Search functionality
  - Pagination
  - Sorting
  - Filtering

### 2. Detailed Component Tests (`companies-detailed.spec.ts`)

- **UI Components**
  - Statistics cards
  - Data table structure
  - Status badges
  - Action dropdowns
  - Modal dialogs

- **User Interactions**
  - Form validation
  - Error handling
  - Loading states
  - Empty states

- **Responsive Design**
  - Mobile viewport
  - Tablet viewport
  - Desktop viewport

### 3. API Integration Tests (`companies-api.spec.ts`)

- **API Mocking**
  - Success responses
  - Error responses
  - Network timeouts
  - Malformed data

- **Data Validation**
  - Request parameters
  - Response handling
  - Error propagation

- **Edge Cases**
  - Empty datasets
  - Large datasets
  - Concurrent requests

### 4. Performance & Accessibility Tests (`companies-performance.spec.ts`)

- **Performance Metrics**
  - Page load times
  - Search response times
  - Pagination performance
  - Memory usage

- **Accessibility Compliance**
  - WCAG guidelines
  - Keyboard navigation
  - Screen reader support
  - Color contrast
  - Focus management

## 🛠️ Test Utilities

The `test-helpers.ts` file provides reusable utilities:

### Configuration
```typescript
TEST_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  credentials: { /* test user credentials */ }
}
```

### Helper Functions
- `loginAs(page, userType)` - Authenticate as different user types
- `navigateToCompanies(page)` - Navigate to companies page
- `waitForTableLoad(page)` - Wait for data table to load
- `performSearch(page, query)` - Execute search operations
- `takeScreenshot(page, name)` - Capture screenshots
- `mockAPIResponse(page, endpoint, response)` - Mock API calls

### Mock Data
```typescript
MOCK_COMPANIES = {
  active: [/* active company data */],
  inactive: [/* inactive company data */]
}
```

## ⚙️ Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
{
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  reporter: [['html'], ['line']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
}
```

## 🎯 Test Execution Options

### Browser Selection
```bash
# Run on specific browser
node run-companies-tests.cjs all chromium
node run-companies-tests.cjs all firefox
node run-companies-tests.cjs all webkit
node run-companies-tests.cjs all all  # All browsers
```

### Execution Modes
```bash
# Headless mode (default)
node run-companies-tests.cjs all

# Headed mode (browser visible)
node run-companies-tests.cjs all chromium --headed

# Debug mode (step through tests)
node run-companies-tests.cjs all chromium --debug

# UI mode (interactive test runner)
node run-companies-tests.cjs all chromium --ui
```

### Test Filtering
```bash
# Run specific test file
npx playwright test companies.spec.ts

# Run tests matching pattern
npx playwright test --grep "should create company"

# Run tests in specific project
npx playwright test --project=chromium
```

## 📊 Test Reports

Playwright generates comprehensive test reports:

### HTML Report
```bash
npm run test:report
# Opens interactive HTML report in browser
```

### Report Features
- Test execution timeline
- Screenshots on failure
- Video recordings (if enabled)
- Network activity logs
- Console output
- Trace viewer for debugging

## 🐛 Debugging

### Debug Mode
```bash
# Run in debug mode
npm run test:debug

# Debug specific test
npx playwright test companies.spec.ts --debug
```

### Trace Viewer
```bash
# View traces for failed tests
npx playwright show-trace test-results/trace.zip
```

### Screenshots
Screenshots are automatically captured on test failures and stored in `test-results/`.

## 🔧 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Port Conflicts**
   - Ensure port 3000 is available
   - Update `baseURL` in config if needed

3. **Authentication Issues**
   - Verify test credentials in `test-helpers.ts`
   - Check login flow implementation

4. **Timeout Issues**
   - Increase timeout in config
   - Add explicit waits for slow operations

5. **Flaky Tests**
   - Use proper wait conditions
   - Avoid hard-coded delays
   - Implement retry logic

### Environment Variables
```bash
# Set custom base URL
BASE_URL=http://localhost:4000 npm run test:companies

# Enable debug logging
DEBUG=pw:api npm run test:companies

# Run in CI mode
CI=true npm run test:companies
```

## 📈 Best Practices

### Test Writing
1. **Use descriptive test names**
2. **Follow AAA pattern** (Arrange, Act, Assert)
3. **Keep tests independent**
4. **Use proper selectors** (data-testid preferred)
5. **Handle async operations properly**

### Maintenance
1. **Regular updates** of test data
2. **Review and refactor** flaky tests
3. **Update selectors** when UI changes
4. **Monitor test execution times**
5. **Keep dependencies updated**

### Performance
1. **Parallel execution** for faster runs
2. **Selective test execution** during development
3. **Efficient waiting strategies**
4. **Resource cleanup** after tests

## 🚀 Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:companies
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

When adding new tests:

1. Follow existing patterns and conventions
2. Add appropriate documentation
3. Include both positive and negative test cases
4. Ensure tests are reliable and maintainable
5. Update this documentation as needed

---

**Happy Testing! 🎉**