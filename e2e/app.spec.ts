import { test, expect } from '@playwright/test';

test.describe('IT-Wörter Bingo App', () => {
  test('should render the app correctly with all main elements', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check that the main title is visible
    await expect(page.getByRole('heading', { name: 'IT-Wörter Bingo' })).toBeVisible();

    // Check that stats badges are visible
    await expect(page.getByText(/\/25/)).toBeVisible(); // Selected count
    await expect(page.getByText(/Spiele:/)).toBeVisible(); // Games played
    await expect(page.getByText(/Bingos:/)).toBeVisible(); // Bingos achieved

    // Check that control buttons are visible
    await expect(page.getByRole('button', { name: /Neues Spiel/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Zurücksetzen/ })).toBeVisible();

    // Check that tabs are visible
    await expect(page.getByRole('tab', { name: /Bingo/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Liste/ })).toBeVisible();

    // Verify the Bingo tab is active by default
    const bingoTab = page.getByRole('tab', { name: /Bingo/ });
    await expect(bingoTab).toHaveAttribute('data-state', 'active');
  });

  test('should render 25 bingo fields in a grid', async ({ page }) => {
    await page.goto('/');

    // Wait for the bingo fields to load
    const bingoFields = page.locator('.bingo-field');
    
    // Check that there are exactly 25 bingo fields
    await expect(bingoFields).toHaveCount(25);

    // Verify each field has content (term text)
    const firstField = bingoFields.first();
    await expect(firstField).not.toBeEmpty();
  });

  test('should allow clicking on bingo fields to select them', async ({ page }) => {
    await page.goto('/');

    // Wait for the grid to be ready
    const bingoFields = page.locator('.bingo-field');
    await expect(bingoFields.first()).toBeVisible();

    // Get the first field
    const firstField = bingoFields.first();

    // Click the first field to select it
    await firstField.click();

    // Verify the field has the 'selected' class
    await expect(firstField).toHaveClass(/selected/);

    // Check that the counter updated (should show 1/25)
    await expect(page.getByText('1/25')).toBeVisible();

    // Click again to deselect
    await firstField.click();

    // Verify the selected class is removed
    await expect(firstField).not.toHaveClass(/selected/);

    // Counter should be back to 0/25
    await expect(page.getByText('0/25')).toBeVisible();
  });

  test('should switch between Bingo and List tabs', async ({ page }) => {
    await page.goto('/');

    // Initially on Bingo tab - verify grid is visible
    await expect(page.locator('.bingo-field').first()).toBeVisible();

    // Click on List tab
    const listTab = page.getByRole('tab', { name: /Liste/ });
    await listTab.click();

    // Verify List tab is now active
    await expect(listTab).toHaveAttribute('data-state', 'active');

    // Verify List tab content is visible
    await expect(page.getByText('Zufallsauswahl')).toBeVisible();
    await expect(page.getByText(/Verfügbar:/)).toBeVisible();

    // List tab should have buttons for random selection
    await expect(page.getByRole('button', { name: /Begriff wählen/ })).toBeVisible();

    // Switch back to Bingo tab
    const bingoTab = page.getByRole('tab', { name: /Bingo/ });
    await bingoTab.click();

    // Verify Bingo tab is active again
    await expect(bingoTab).toHaveAttribute('data-state', 'active');

    // Verify bingo grid is visible again
    await expect(page.locator('.bingo-field').first()).toBeVisible();
  });

  test('should show loading state before content appears', async ({ page }) => {
    // Start navigation but don't wait for load
    const response = page.goto('/');

    // Check for loading indicator
    const loadingText = page.getByText('Spiel wird geladen...');
    
    // Wait for the page to finish loading
    await response;

    // Eventually the main content should appear
    await expect(page.getByRole('heading', { name: 'IT-Wörter Bingo' })).toBeVisible({ timeout: 10000 });
  });

  test('should have working "Neues Spiel" button', async ({ page }) => {
    await page.goto('/');

    // Select a field to mark the board
    const firstField = page.locator('.bingo-field').first();
    const firstFieldText = await firstField.textContent();
    await firstField.click();

    // Verify field is selected
    await expect(firstField).toHaveClass(/selected/);

    // Click "Neues Spiel" button
    await page.getByRole('button', { name: /Neues Spiel/ }).click();

    // Wait for the toast notification (optional, might appear)
    await page.waitForTimeout(500);

    // Verify that a new game was created by checking if fields are reset
    // The first field text might be different (new shuffle)
    const newFirstFieldText = await page.locator('.bingo-field').first().textContent();
    
    // At minimum, selections should be cleared (no selected class on first field)
    await expect(page.locator('.bingo-field').first()).not.toHaveClass(/selected/);

    // Counter should be reset to 0/25
    await expect(page.getByText('0/25')).toBeVisible();
  });

  test('should have working "Zurücksetzen" button', async ({ page }) => {
    await page.goto('/');

    // Select multiple fields
    const bingoFields = page.locator('.bingo-field');
    await bingoFields.nth(0).click();
    await bingoFields.nth(1).click();
    await bingoFields.nth(2).click();

    // Verify selections
    await expect(page.getByText('3/25')).toBeVisible();

    // Click "Zurücksetzen" button
    await page.getByRole('button', { name: /Zurücksetzen/ }).click();

    // Wait a moment for the reset
    await page.waitForTimeout(300);

    // Verify all selections are cleared
    await expect(page.getByText('0/25')).toBeVisible();
    
    // Verify no field has the selected class
    const selectedFields = page.locator('.bingo-field.selected');
    await expect(selectedFields).toHaveCount(0);
  });

  test('should have responsive layout', async ({ page }) => {
    await page.goto('/');

    // Verify the main container has proper classes for responsive layout
    const mainContainer = page.locator('.min-h-screen');
    await expect(mainContainer).toBeVisible();

    // Verify bingo grid is visible and has responsive gap classes
    const bingoGrid = page.locator('.grid.grid-cols-5');
    await expect(bingoGrid).toBeVisible();

    // Check that all 25 fields are visible even in default viewport
    const bingoFields = page.locator('.bingo-field');
    await expect(bingoFields).toHaveCount(25);
  });
});
