// Optional documentation tooling. Install Playwright in .screenshots-tooling first.
const { chromium } = require('../.screenshots-tooling/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const baseURL = process.env.CASHCOMPASS_URL || 'http://localhost:8082';
const output = path.resolve(__dirname, '../screenshots');
const screens = [];

async function capture(page, name, label) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  });
  await page.screenshot({ path: path.join(output, `${name}.png`), animations: 'disabled' });
  screens.push({ name, label });
  console.log(`Captured ${name}`);
}

async function contactSheet(browser, items, filename, columns) {
  const page = await browser.newPage({ viewport: { width: columns * 222 + 24, height: Math.ceil(items.length / columns) * 478 + 24 }, deviceScaleFactor: 1 });
  const cards = await Promise.all(items.map(async item => {
    const bytes = await fs.readFile(path.join(output, `${item.name}.png`));
    return `<figure><figcaption>${item.label}</figcaption><img src="data:image/png;base64,${bytes.toString('base64')}" /></figure>`;
  }));
  await page.setContent(`<html><head><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#e8ede6;font:600 12px system-ui;color:#20392c;display:grid;grid-template-columns:repeat(${columns},198px);gap:24px}figure{margin:0}figcaption{height:28px}img{width:198px;height:auto;border-radius:16px;box-shadow:0 3px 14px #20392c18;border:1px solid #d9dfd3}</style></head><body>${cards.join('')}</body></html>`);
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
  await page.screenshot({ path: path.join(output, filename), fullPage: true });
  await page.close();
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.CASHCOMPASS_BROWSER || 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, timezoneId: 'Australia/Perth', locale: 'en-PH' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(30000);

    await page.goto(`${baseURL}/`);
    await page.getByRole('button', { name: 'Start CashCompass', exact: true }).waitFor();
    await capture(page, '01-splash', '1. Splash');
    await page.goto(`${baseURL}/onboarding?step=0`);
    await page.getByRole('heading', { name: /Know where/ }).waitFor();
    await capture(page, '02-onboarding-spending', '2. Know your spending');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('heading', { name: /Reach your/ }).waitFor();
    await capture(page, '03-onboarding-goals', '3. Reach your goals');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('heading', { name: /A happier/ }).waitFor();
    await capture(page, '04-onboarding-wellbeing', '4. A happier financial you');
    await page.getByRole('button', { name: 'Get Started', exact: true }).click();
    await page.getByText('Continue with Google', { exact: true }).waitFor();
    await capture(page, '05-sign-in', '5. Sign-in preview');
    await page.getByRole('button', { name: 'Explore the demo', exact: true }).click();
    await page.getByText('Total Balance', { exact: true }).waitFor();
    await capture(page, '06-home', '6. Home overview');
    await page.getByRole('button', { name: /Add Expense/ }).click();
    await page.getByRole('textbox', { name: 'Transaction note', exact: true }).fill('Grab to office');
    await capture(page, '07-add-transaction', '7. Add transaction');
    await page.getByRole('button', { name: 'Save transaction', exact: true }).click();
    await page.getByRole('heading', { name: 'Expense Added!', exact: true }).waitFor();
    await capture(page, '08-transaction-added', '8. Transaction added');
    await page.getByRole('button', { name: 'View Transactions', exact: true }).click();
    await page.getByRole('heading', { name: 'Transactions', exact: true }).waitFor();
    await capture(page, '09-transactions', '9. Transactions');
    await page.getByRole('button', { name: 'View category breakdown', exact: true }).click();
    await page.getByRole('heading', { name: 'Categories', exact: true }).waitFor();
    await capture(page, '10-categories', '10. Category breakdown');
    await page.getByRole('button', { name: 'Budgets', exact: true }).click();
    await page.getByRole('heading', { name: 'Budgets', exact: true }).waitFor();
    await capture(page, '11-budgets', '11. Monthly budgets');
    await page.getByRole('button', { name: 'Goals', exact: true }).click();
    await page.getByRole('heading', { name: 'Goals', exact: true }).waitFor();
    await capture(page, '12-goals', '12. Savings goals');
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    await page.getByRole('button', { name: /Insights/ }).click();
    await page.getByRole('heading', { name: 'Insights', exact: true }).waitFor();
    await capture(page, '13-insights', '13. Insights');
    await page.getByRole('button', { name: 'Profile', exact: true }).click();
    await page.getByRole('heading', { name: 'Profile', exact: true }).waitFor();
    await capture(page, '14-profile', '14. Profile');

    // Verify financial updates through the UI after capturing the gallery.
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    await page.getByText('₱ 42,100.00', { exact: true }).filter({ visible: true }).waitFor();
    await page.getByText('₱ 18,700.00', { exact: false }).filter({ visible: true }).waitFor();
    await page.getByRole('button', { name: 'Transactions', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search transactions', exact: true }).fill('Grab to office');
    await page.getByRole('button', { name: /Grab to office, ₱ 250, expense/ }).click();
    await page.getByRole('button', { name: 'Edit transaction', exact: true }).click();
    await page.getByRole('textbox', { name: 'Amount in Philippine pesos', exact: true }).fill('500');
    await page.getByRole('button', { name: 'Save transaction', exact: true }).click();
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    await page.getByText('₱ 41,850.00', { exact: true }).filter({ visible: true }).waitFor();
    await page.getByRole('button', { name: 'Transactions', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search transactions', exact: true }).fill('Grab to office');
    await page.getByRole('button', { name: /Grab to office, ₱ 500, expense/ }).click();
    await page.getByRole('button', { name: 'Delete transaction', exact: true }).click();
    await page.getByRole('button', { name: 'Delete transaction', exact: true }).click();
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    await page.getByText('₱ 42,350.00', { exact: true }).filter({ visible: true }).waitFor();
    assert.deepEqual(errors, [], `Browser errors: ${errors.join('; ')}`);

    await contactSheet(browser, screens.slice(0, 8), 'welcome-and-tracking.png', 4);
    await contactSheet(browser, screens.slice(8), 'planning-and-insights.png', 3);
    console.log('PASS: 14 screens captured; add/edit/delete update the balance; no uncaught browser errors.');
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
