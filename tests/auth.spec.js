// 1. Imports
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 2. Helper Functions
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

// 3. Test Suite
test.describe('Authentication - Serverest', () => {

  test('Should register a new user successfully', async ({ page }) => {
    // Navigate to registration page
    await page.goto('https://front.serverest.dev/cadastrarusuarios');

    // Get incremental number and fill registration form
    const userNumber = getNextUserNumber();
    const randomUser = `testqav${userNumber}`;
    const randomEmail = `testqav${userNumber}@email.com`;

    await page.getByTestId('nome').fill(randomUser);
    await page.getByTestId('email').fill(randomEmail);
    await page.getByTestId('password').fill('testqa26');
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrar').click();

    // Validate successful registration
    await expect(page).toHaveURL('https://front.serverest.dev/admin/home');
    await expect(page.getByText(/bem vindo/i)).toBeVisible();
  });
  
});
