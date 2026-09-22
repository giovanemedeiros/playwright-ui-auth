import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Helper Functions
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

//
// Tests suite
//

// [CT01] Register a new user
test.describe('Authentication - Serverest', () => {

  test('Should register a new user successfully', async ({ page }) => {
    // Navigate to registration page
    await page.goto('https://front.serverest.dev/cadastrarusuarios');

    // Get incremental number and fill registration form
    const userNumber = getNextUserNumber();
    const randomUser = `testqav${userNumber}`;
    const randomEmail = `testqav${userNumber}@email.com`;

    await page.waitForTimeout(2000);
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

  // [CT02] Login with valid credentials
    test('Should login with valid credentials', async ({ page }) => {

    // Get incremental number for login form
    const userNumber = getNextUserNumber() -1;
    const randomEmail = `testqav${userNumber}@email.com`;
    
    // Navigate to login page
    await page.goto('https://front.serverest.dev/login');
    await page.waitForTimeout(2000);
    await page.getByTestId('email').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('email').fill(randomEmail);
    await page.waitForTimeout(2000);
    await page.getByTestId('senha').click();
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

  // [CT03]

  // [CT04]

});
