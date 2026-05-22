import { test, expect } from '@playwright/test';

test.describe('Open-Forms E2E Form CRUD', () => {
  test('Should create a form, add questions, save, view results, and delete the form', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/login');

    // Login
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');

    // Dashboard
    await page.waitForTimeout(2000);

    // Go back to dashboard and create a form
    await page.click('text=Criar formulário');

    // Wait for the builder to load
    await page.waitForSelector('input[placeholder="Título do Formulário"]');

    // Add a question
    await page.click('text=Adicionar Questão');
    await page.waitForTimeout(500); // Give it a moment to render

    // Add options
    await page.click('text=Adicionar opção');
    await page.waitForTimeout(500);

    // Set correct option
    const checkboxes = await page.$$('input[type="checkbox"]');
    if (checkboxes.length > 0) {
        await checkboxes[0].check();
    }

    // Save and wait
    await page.waitForTimeout(1000); // Simulate auto-save

    // Check if view mode works
    await page.click('text=Visualização');

    // Check if results tab works
    await page.click('text=Respostas');
    await expect(page.locator('text=Total de Submissões')).toBeVisible();
    await expect(page.locator('text=Desempenho por Questão')).toBeVisible();

    // Go back to dashboard to delete the form
    await page.click('button[title="Voltar para o Dashboard"]');
    await page.waitForTimeout(2000);

    // Find the newest form and click delete
    const formCard = page.locator('.group').first();
    const deleteButton = formCard.locator('button.opacity-0'); // Using the opacity-0 class to grab the inner button

    // Hover over the card to reveal the button, then click
    await formCard.hover();
    await deleteButton.click();

    // Confirm deletion in the alert dialog
    await page.click('text=Sim, excluir');

    // Wait for the form to disappear
    await page.waitForTimeout(500);
  });
});
