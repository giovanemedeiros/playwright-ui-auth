import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Helper Function
function getNextUserNumber() {

  const filePath = path.resolve('counter.json');
  let currentNumber = 1;

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    currentNumber = JSON.parse(data).count || 1;
  }

  // Writes the next number (+1) to counter.json file
  fs.writeFileSync(filePath, JSON.stringify({ count: currentNumber + 1 }, null, 2));
  return currentNumber;
}

test.describe('Authentication - Serverest', () => {

  // ---- [CT01] Register a new user ----
  test('Should register a new user successfully', async ({ page }) => {
    await page.goto('https://front.serverest.dev/cadastrarusuarios');

    // Get incremental number and fill registration form
    const userNumber = getNextUserNumber();
    const randomUser = `testqav${userNumber}`;
    const randomEmail = `testqav${userNumber}@email.com`;

    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Fill registration form
    await page.getByTestId('nome').fill(randomUser);
    await page.waitForTimeout(2000);
    await page.getByTestId('email').fill(randomEmail);
    await page.waitForTimeout(2000);
    await page.getByTestId('password').fill('testqa26');
    await page.waitForTimeout(2000);
    await page.getByTestId('checkbox').check();
    await page.waitForTimeout(2000);
    await page.getByTestId('cadastrar').click();
    await page.waitForTimeout(5000);

    // Validate successful registration
    await expect(page).toHaveURL('https://front.serverest.dev/admin/home');
    await expect(page.getByText(/bem vindo/i)).toBeVisible();
    await page.waitForTimeout(5000);
  });

  // ---- [CT02] Login with valid credentials ----
  test('Should login with valid credentials', async ({ page, request }) => {
    
    // Get incremental number and create user via API
    const userNumber = getNextUserNumber();
    const randomUser = `testqav${userNumber}`;
    const randomEmail = `testqav${userNumber}@email.com`;
    
    // Silent user registration via API (Background)
    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: randomUser,
        email: randomEmail,
        password: 'testqa26',
        administrador: 'true'
      }
    });

    // UI visual test on login page
    await page.goto('https://front.serverest.dev/login');
    await page.waitForTimeout(2000);
    await page.getByTestId('email').fill(randomEmail);
    await page.waitForTimeout(2000);
    await page.getByTestId('senha').fill('testqa26');
    await page.waitForTimeout(2000);
    await page.getByTestId('entrar').click();
    await page.waitForTimeout(5000);
    
    // Validate successful login
    await expect(page).toHaveURL('https://front.serverest.dev/admin/home');
    await expect(page.getByText(/bem vindo/i)).toBeVisible();
    await page.waitForTimeout(5000);
  });

  // ---- [CT03] Login with not valid credentials ----
  test('Should show error message when logging in with invalid credentials', async ({ page }) => {

    // Go to login page
    await page.goto('https://front.serverest.dev/login');
    await page.waitForTimeout(2000);

    // Fill login form
    await page.getByTestId('email').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('email').fill('invalido@email.com');
    await page.waitForTimeout(2000);
    await page.getByTestId('senha').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('senha').fill('123456');
    await page.waitForTimeout(2000);
    await page.getByTestId('entrar').click();
    await page.waitForTimeout(5000);
    await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
    await page.waitForTimeout(5000);
  });

  // ---- [CT04] Logout from system ----
  test('Should logout successfully from system', async ({ page, request }) => {

    // Get incremental number and create user via API
    const userNumber = getNextUserNumber();
    const randomUser = `testqav${userNumber}`;
    const randomEmail = `testqav${userNumber}@email.com`;
    
    // Silent user registration via API (Background)
    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: randomUser,
        email: randomEmail,
        password: 'testqa26',
        administrador: 'true'
      }
    });

    // Silent login
    const loginResponse = await request.post('https://serverest.dev/login', {
      data: {
        email: randomEmail,
        password: 'testqa26'
      }
    });

    const { authorization } = await loginResponse.json();

    // Inject token into browser's localStorage before loading page
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('serverest/userToken', token);
    }, authorization);

    // Opens DIRECTLY at admin home page already logged in!
    await page.goto('https://front.serverest.dev/admin/home');
    await page.waitForTimeout(2000);
    await expect(page.getByText(/bem vindo/i)).toBeVisible();

    // Visual action: Click logout!
    await page.getByTestId('logout').click();
    await page.waitForTimeout(5000);
    
    // Validate logout assertion
    await expect(page).toHaveURL('https://front.serverest.dev/login');
    await expect(page.getByTestId('entrar')).toBeVisible();
    await page.waitForTimeout(5000);
  });

});
