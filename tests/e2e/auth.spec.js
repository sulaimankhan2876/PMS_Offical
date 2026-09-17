import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login and redirect to dashboard', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Check if we are on the login page (or if it auto-navigates)
    // The LMS seems to have a login page if the user is not authenticated.
    // If it's already on the dashboard, we check for a dashboard element.
    const url = page.url();
    
    if (url.includes('/login') || await page.isVisible('button:has-text("Login")')) {
      // Basic login flow - adjust selectors based on actual implementation
      const emailInput = page.getByPlaceholder(/email|username/i);
      const passwordInput = page.getByPlaceholder(/password/i);
      
      if (await emailInput.isVisible()) {
        await emailInput.fill('admin@example.com');
        await passwordInput.fill('password');
        await page.getByRole('button', { name: /login|sign in/i }).click();
      }
    }
    
    // Verify we reached the dashboard
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });
});
