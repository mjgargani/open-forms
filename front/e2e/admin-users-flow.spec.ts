import { test, expect } from '@playwright/test';

test.describe('Open-Forms E2E Admin Users Flow', () => {
  test('Login as admin, check users list, and verify form access', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/login');

    // Login
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');

    // Dashboard
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Painel Admin')).toBeVisible();

    // Check if the dashboard shows the owner name (since the test seed has user null initially, just make sure there is no error)
    await expect(page.locator('text=Meus Formulários')).toBeVisible();

    // Navigate to admin
    await page.click('text=Painel Admin');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Painel de Administração')).toBeVisible();
    await expect(page.locator('text=admin@openforms.com')).toBeVisible();

    // Create new non-admin user
    await page.fill('input[type="text"] >> nth=0', 'Test User'); // Name
    await page.fill('input[type="text"] >> nth=1', 'test_user'); // User
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.selectOption('select', 'USER');
    await page.click('button:has-text("Criar")');

    // Verify it appeared in the list
    await expect(page.locator('text=test@test.com')).toBeVisible();

    // Logout
    await page.goto('http://localhost:5173/');
    await page.click('text=Sair');

    // Login as the new non-admin user
    await page.fill('input[type="text"]', 'test_user');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Dashboard
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Meus Formulários')).toBeVisible();

    // Non-admin shouldn't see 'Painel Admin'
    await expect(page.locator('text=Painel Admin')).not.toBeVisible();

    // Verify they see NO forms right now
    await expect(page.locator('text=Nenhum formulário encontrado.')).toBeVisible();

    // Logout
    await page.click('text=Sair');

    // Cleanup: Login as admin to delete user
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
    await page.click('text=Painel Admin');
    await page.waitForTimeout(2000);
    // accept the alert
    page.on('dialog', dialog => dialog.accept());
    // Click the delete button on the second row (the first row is admin)
    await page.locator('tbody tr').nth(1).locator('button').nth(1).click();
    await expect(page.locator('text=test@test.com')).not.toBeVisible();
  });
});
