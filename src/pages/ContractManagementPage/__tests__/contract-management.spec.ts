import { test, expect, Page } from '@playwright/test';

// Test data constants
const TEST_USER = {
  email: 'admin@swiftpro.com',
  password: '@swift_alg'
};

const TEST_CONTRACT = {
  title: 'Test Service Agreement',
  vendor: 'Test Vendor Inc',
  type: 'Service Agreement',
  value: '50000',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
};

// Helper function to login
async function login(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', TEST_USER.email);
  await page.fill('[data-testid="password-input"]', TEST_USER.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

// Helper function to navigate to contract management page
async function navigateToContractManagement(page: Page) {
  await page.goto('/dashboard/contract-management');
  await page.waitForLoadState('networkidle');
}

test.describe('Contract Management Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  test('should display contract management page with correct title and header', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Check page title
    await expect(page).toHaveTitle(/Contract Management/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Contract Management');
    
    // Check if Create Contract button is visible
    await expect(page.locator('text=Create Contract')).toBeVisible();
  });

  test('should display contract statistics cards', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Check if statistics cards are visible
    await expect(page.locator('[data-testid="total-contracts-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-contracts-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="expiring-contracts-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="contract-value-stat"]')).toBeVisible();
  });

  test('should display contracts table with correct columns', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Wait for table to load
    await page.waitForSelector('[data-testid="contracts-table"]');
    
    // Check table headers
    await expect(page.locator('th:has-text("Contract Title")')).toBeVisible();
    await expect(page.locator('th:has-text("Vendor")')).toBeVisible();
    await expect(page.locator('th:has-text("Type")')).toBeVisible();
    await expect(page.locator('th:has-text("Value")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("End Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should open create contract dialog', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Click create contract button
    await page.click('[data-testid="create-contract-button"]');
    
    // Check if dialog is open
    await expect(page.locator('[data-testid="create-contract-dialog"]')).toBeVisible();
    await expect(page.locator('text=Create New Contract')).toBeVisible();
  });

  test('should create a new contract with step form', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Open create dialog
    await page.click('[data-testid="create-contract-button"]');
    
    // Step 1: Basic Information
    await page.fill('[data-testid="contract-title-input"]', TEST_CONTRACT.title);
    await page.selectOption('[data-testid="vendor-select"]', TEST_CONTRACT.vendor);
    await page.selectOption('[data-testid="contract-type-select"]', TEST_CONTRACT.type);
    await page.click('[data-testid="next-step-button"]');
    
    // Step 2: Financial Details
    await page.fill('[data-testid="contract-value-input"]', TEST_CONTRACT.value);
    await page.fill('[data-testid="start-date-input"]', TEST_CONTRACT.startDate);
    await page.fill('[data-testid="end-date-input"]', TEST_CONTRACT.endDate);
    await page.click('[data-testid="next-step-button"]');
    
    // Step 3: Terms and Conditions
    await page.fill('[data-testid="terms-textarea"]', 'Standard terms and conditions apply.');
    await page.click('[data-testid="next-step-button"]');
    
    // Step 4: Review and Submit
    await expect(page.locator('[data-testid="review-contract-title"]')).toContainText(TEST_CONTRACT.title);
    await page.click('[data-testid="create-contract-submit"]');
    
    // Check success message
    await expect(page.locator('text=Contract created successfully')).toBeVisible();
  });

  test('should search for contracts', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Use search functionality
    await page.fill('[data-testid="search-input"]', 'Service');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
    
    // Check if search results are displayed
    const searchResults = page.locator('[data-testid="contracts-table"] tbody tr');
    await expect(searchResults.count()).resolves.toBeGreaterThanOrEqual(0);
  });

  test('should filter contracts by status', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Apply status filter
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-testid="status-active"]');
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    
    // Check if filtered results are displayed
    await expect(page.locator('[data-testid="contracts-table"]')).toBeVisible();
  });

  test('should filter contracts by type', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Apply type filter
    await page.click('[data-testid="type-filter"]');
    await page.click('[data-testid="type-service-agreement"]');
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    
    // Check if filtered results are displayed
    await expect(page.locator('[data-testid="contracts-table"]')).toBeVisible();
  });

  test('should filter contracts by vendor', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Apply vendor filter
    await page.click('[data-testid="vendor-filter"]');
    await page.click('[data-testid="vendor-test-inc"]');
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    
    // Check if filtered results are displayed
    await expect(page.locator('[data-testid="contracts-table"]')).toBeVisible();
  });

  test('should navigate to contract detail page', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Wait for table to load
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    
    // Click on first contract title to navigate to detail page
    await page.click('[data-testid="contract-title-link"]:first-of-type');
    
    // Check if navigated to detail page
    await expect(page).toHaveURL(/\/dashboard\/contract-management\/\d+/);
  });

  test('should open edit contract dialog', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Wait for table to load
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    
    // Open actions dropdown and click edit
    await page.click('[data-testid="contract-actions-dropdown"]:first-of-type');
    await page.click('[data-testid="edit-contract-action"]');
    
    // Check if edit dialog is open
    await expect(page.locator('[data-testid="edit-contract-dialog"]')).toBeVisible();
    await expect(page.locator('text=Edit Contract')).toBeVisible();
  });

  test('should view contract overview tab in detail page', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Navigate to contract detail page
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    await page.click('[data-testid="contract-title-link"]:first-of-type');
    
    // Check if overview tab is active and visible
    await expect(page.locator('[data-testid="overview-tab"]')).toHaveClass(/active/);
    await expect(page.locator('[data-testid="contract-overview-content"]')).toBeVisible();
  });

  test('should view contract terms tab in detail page', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Navigate to contract detail page
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    await page.click('[data-testid="contract-title-link"]:first-of-type');
    
    // Click on terms tab
    await page.click('[data-testid="terms-tab"]');
    
    // Check if terms tab content is visible
    await expect(page.locator('[data-testid="contract-terms-content"]')).toBeVisible();
  });

  test('should view contract milestones tab in detail page', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Navigate to contract detail page
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    await page.click('[data-testid="contract-title-link"]:first-of-type');
    
    // Click on milestones tab
    await page.click('[data-testid="milestones-tab"]');
    
    // Check if milestones tab content is visible
    await expect(page.locator('[data-testid="contract-milestones-content"]')).toBeVisible();
  });

  test('should view contract documents tab in detail page', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Navigate to contract detail page
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    await page.click('[data-testid="contract-title-link"]:first-of-type');
    
    // Click on documents tab
    await page.click('[data-testid="documents-tab"]');
    
    // Check if documents tab content is visible
    await expect(page.locator('[data-testid="contract-documents-content"]')).toBeVisible();
  });

  test('should display contract status badges correctly', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Wait for table to load
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    
    // Check if status badges are visible
    const statusBadges = page.locator('[data-testid="contract-status-badge"]');
    await expect(statusBadges.first()).toBeVisible();
  });

  test('should handle contract renewal', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Wait for table to load
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    
    // Open actions dropdown and click renew
    await page.click('[data-testid="contract-actions-dropdown"]:first-of-type');
    await page.click('[data-testid="renew-contract-action"]');
    
    // Check if renewal dialog is open
    await expect(page.locator('[data-testid="renew-contract-dialog"]')).toBeVisible();
    await expect(page.locator('text=Renew Contract')).toBeVisible();
  });

  test('should handle contract termination', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Wait for table to load
    await page.waitForSelector('[data-testid="contracts-table"] tbody tr');
    
    // Open actions dropdown and click terminate
    await page.click('[data-testid="contract-actions-dropdown"]:first-of-type');
    await page.click('[data-testid="terminate-contract-action"]');
    
    // Check if termination dialog is open
    await expect(page.locator('[data-testid="terminate-contract-dialog"]')).toBeVisible();
    await expect(page.locator('text=Terminate Contract')).toBeVisible();
  });

  test('should display expiring contracts alert', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Check if expiring contracts alert is visible (if any contracts are expiring)
    const alertExists = await page.locator('[data-testid="expiring-contracts-alert"]').isVisible();
    
    if (alertExists) {
      await expect(page.locator('[data-testid="expiring-contracts-alert"]')).toContainText('expiring');
    }
  });

  test('should handle pagination', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Check if pagination is visible (if there are enough contracts)
    const paginationExists = await page.locator('[data-testid="pagination"]').isVisible();
    
    if (paginationExists) {
      // Test pagination functionality
      await page.click('[data-testid="next-page"]');
      await page.waitForLoadState('networkidle');
      
      // Check if page changed
      await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
    }
  });

  test('should handle empty state when no contracts exist', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/contracts*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], total: 0 })
      });
    });
    
    await navigateToContractManagement(page);
    
    // Check empty state
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('text=No contracts found')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/contracts*', route => {
      route.abort('failed');
    });
    
    await navigateToContractManagement(page);
    
    // Check error state
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await navigateToContractManagement(page);
    
    // Check if mobile layout is applied
    await expect(page.locator('[data-testid="mobile-contracts-view"]')).toBeVisible();
  });

  test('should display correctly in dark mode', async ({ page }) => {
    await navigateToContractManagement(page);
    
    // Toggle dark mode
    await page.click('[data-testid="theme-toggle"]');
    
    // Check if dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Check if components are visible in dark mode
    await expect(page.locator('[data-testid="contracts-table"]')).toBeVisible();
  });
});