# End-to-End Tests

This directory contains end-to-end tests for the IT-Wörter Bingo application using [Playwright](https://playwright.dev/).

## Running Tests

### Run all tests (headless mode)
```bash
npm run test:e2e
```

### Run tests with UI (interactive mode)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

## Test Coverage

The end-to-end tests verify the following functionality:

1. **App renders correctly** - Checks that the main title, stats badges, and control buttons are visible
2. **Bingo grid renders** - Verifies that all 25 bingo fields are present
3. **Field selection** - Tests clicking on fields to select/deselect them
4. **Tab navigation** - Verifies switching between Bingo and List tabs
5. **Loading state** - Checks that the loading indicator appears during initialization
6. **New game functionality** - Tests the "Neues Spiel" button
7. **Reset functionality** - Tests the "Zurücksetzen" button
8. **Responsive layout** - Verifies that the layout is responsive

## Test Structure

- `e2e/app.spec.ts` - Main test file containing all end-to-end tests
- `playwright.config.ts` - Playwright configuration file

## Configuration

The tests are configured to:
- Run on Chromium browser
- Start a local dev server automatically before running tests
- Use http://localhost:5000 as the base URL
- Generate HTML reports for test results
- Capture traces on first retry for debugging

## Viewing Test Reports

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

## Debugging Tests

To debug a specific test:

```bash
npx playwright test --debug
```

Or use VS Code's Playwright extension for an enhanced debugging experience.
