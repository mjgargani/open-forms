# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/admin-users-flow.spec.ts >> Open-Forms E2E Admin Users Flow >> Login as admin, check users list, and verify form access
- Location: e2e/admin-users-flow.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('tbody tr').filter({ hasText: 'test_user_1780172332498' }).first().locator('.text-gray-400.hover\\:text-red-500')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]: Online - Conectado ao servidor undefined
  - generic [ref=e7]:
    - generic [ref=e8]:
      - img [ref=e9]
      - heading "Painel de Administração" [level=1] [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]:
        - heading "Novo Usuário" [level=2] [ref=e14]
        - generic [ref=e15]:
          - generic [ref=e16]:
            - generic [ref=e17]: Nome
            - textbox [ref=e18]
          - generic [ref=e19]:
            - generic [ref=e20]: Usuário (Login)
            - textbox [ref=e21]
          - generic [ref=e22]:
            - generic [ref=e23]: E-mail
            - textbox [ref=e24]
          - generic [ref=e25]:
            - generic [ref=e26]: Senha
            - textbox [ref=e27]
          - generic [ref=e28]:
            - generic [ref=e29]: Nível de Acesso
            - combobox [ref=e30]:
              - option "Usuário (USER)" [selected]
              - option "Administrador (ADMIN)"
          - button "Criar" [ref=e32]
      - generic [ref=e33]:
        - heading "Usuários Cadastrados" [level=2] [ref=e34]
        - table [ref=e36]:
          - rowgroup [ref=e37]:
            - row "Nome Usuário Role Ações" [ref=e38]:
              - columnheader "Nome" [ref=e39]
              - columnheader "Usuário" [ref=e40]
              - columnheader "Role" [ref=e41]
              - columnheader "Ações" [ref=e42]
          - rowgroup [ref=e43]:
            - row "Administrator admin@openforms.com admin ADMIN" [ref=e44]:
              - cell "Administrator admin@openforms.com" [ref=e45]:
                - generic [ref=e46]: Administrator
                - generic [ref=e47]: admin@openforms.com
              - cell "admin" [ref=e48]
              - cell "ADMIN" [ref=e49]
              - cell [ref=e50]:
                - button [ref=e51]:
                  - img [ref=e52]
                - button [ref=e54]:
                  - img [ref=e55]
            - row "Test User test@test.com test_user USER" [ref=e58]:
              - cell "Test User test@test.com" [ref=e59]:
                - generic [ref=e60]: Test User
                - generic [ref=e61]: test@test.com
              - cell "test_user" [ref=e62]
              - cell "USER" [ref=e63]
              - cell [ref=e64]:
                - button [ref=e65]:
                  - img [ref=e66]
                - button [ref=e68]:
                  - img [ref=e69]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Open-Forms E2E Admin Users Flow', () => {
  4  |   test('Login as admin, check users list, and verify form access', async ({ page }) => {
  5  |     const uniqueUser = `test_user_${Date.now()}`;
  6  |
  7  |     // Navigate to the app
  8  |     await page.goto('http://localhost:5173/login');
  9  |
  10 |     // Login
  11 |     await page.fill('input[type="text"]', 'admin');
  12 |     await page.fill('input[type="password"]', 'admin');
  13 |     await page.click('button[type="submit"]');
  14 |
  15 |     // Dashboard
  16 |     await page.waitForTimeout(2000);
  17 |     await expect(page.locator('text=Painel Admin')).toBeVisible();
  18 |
  19 |     // Check if the dashboard shows the owner name (since the test seed has user null initially, just make sure there is no error)
  20 |     await expect(page.locator('text=Meus Formulários')).toBeVisible();
  21 |
  22 |     // Navigate to admin
  23 |     await page.click('text=Painel Admin');
  24 |     await page.waitForTimeout(2000);
  25 |     await expect(page.locator('text=Painel de Administração')).toBeVisible();
  26 |     await expect(page.locator('text=admin@openforms.com')).toBeVisible();
  27 |
  28 |     // Create new non-admin user
  29 |     await page.fill('input[type="text"] >> nth=0', 'Test User'); // Name
  30 |     await page.fill('input[type="text"] >> nth=1', 'test_user'); // User
  31 |     await page.fill('input[type="email"]', 'test@test.com');
  32 |     await page.fill('input[type="password"]', 'password');
  33 |     await page.selectOption('select', 'USER');
  34 |     await page.click('button:has-text("Criar")');
  35 |
  36 |     // Verify it appeared in the list
  37 |     await expect(page.locator('text=test@test.com')).toBeVisible();
  38 |
  39 |     // Logout
  40 |     await page.goto('http://localhost:5173/');
  41 |     await page.click('text=Sair');
  42 |
  43 |     // Login as the new non-admin user
  44 |     await page.fill('input[type="text"]', 'test_user');
  45 |     await page.fill('input[type="password"]', 'password');
  46 |     await page.click('button[type="submit"]');
  47 |
  48 |     // Dashboard
  49 |     await page.waitForTimeout(2000);
  50 |     await expect(page.locator('text=Meus Formulários')).toBeVisible();
  51 |
  52 |     // Non-admin shouldn't see 'Painel Admin'
  53 |     await expect(page.locator('text=Painel Admin')).not.toBeVisible();
  54 |
  55 |     // Verify they see NO forms right now
  56 |     await expect(page.locator('text=Nenhum formulário encontrado.')).toBeVisible();
  57 |
  58 |     // Logout
  59 |     await page.click('text=Sair');
  60 |
  61 |     // Cleanup: Login as admin to delete user
  62 |     await page.fill('input[type="text"]', 'admin');
  63 |     await page.fill('input[type="password"]', 'admin');
  64 |     await page.click('button[type="submit"]');
  65 |
  66 |     await page.waitForTimeout(2000);
  67 |     await page.click('text=Painel Admin');
  68 |     await page.waitForTimeout(2000);
  69 |     // accept the alert
  70 |     page.on('dialog', dialog => dialog.accept());
  71 |     // Click the delete button for the newly created user
  72 |     const row = page.locator('tbody tr').filter({ hasText: uniqueUser }).first();
> 73 |     await row.locator('.text-gray-400.hover\\:text-red-500').click();
     |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  74 |     // Wait for row to disappear
  75 |     await expect(row).not.toBeVisible();
  76 |   });
  77 | });
  78 |
```