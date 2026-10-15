# CashCompass screenshot gallery

These are actual screenshots of the production web export, captured in headless Microsoft Edge at **390 × 844 CSS pixels**, device scale factor 1, with the Australia/Perth timezone. Capture date: **October 15, 2026**. They are not native-device screenshots or the original concept art.

The gallery completes onboarding, opens the demo, and saves a ₱250 transportation expense labelled “Grab to office.” Screens 9–14 retain that entry, so monthly spending increases from ₱18,450 to ₱18,700. Screenshot data is illustrative and dates are based on the capture session.

| Screen | Full-resolution capture |
| --- | --- |
| 1. Splash | [View](01-splash.png) |
| 2. Onboarding: spending | [View](02-onboarding-spending.png) |
| 3. Onboarding: goals | [View](03-onboarding-goals.png) |
| 4. Onboarding: wellbeing | [View](04-onboarding-wellbeing.png) |
| 5. Sign-in preview | [View](05-sign-in.png) |
| 6. Home | [View](06-home.png) |
| 7. Add transaction | [View](07-add-transaction.png) |
| 8. Transaction added | [View](08-transaction-added.png) |
| 9. Transactions | [View](09-transactions.png) |
| 10. Categories | [View](10-categories.png) |
| 11. Budgets | [View](11-budgets.png) |
| 12. Savings goals | [View](12-goals.png) |
| 13. Insights | [View](13-insights.png) |
| 14. Profile | [View](14-profile.png) |

The two overview images are composed from the unmodified full-resolution captures using a browser-rendered gallery. Scrollable screens show the first viewport; additional content remains available by scrolling in the app.

## Refresh the screenshots

Install optional Playwright tooling into the ignored local folder; this does not add a runtime dependency:

```powershell
npm install --prefix .screenshots-tooling --no-save --no-package-lock playwright
npx expo export --platform web --max-workers 2
node scripts/serve-preview.cjs
```

With the server running, open a second PowerShell terminal in the repository root:

```powershell
$env:CASHCOMPASS_URL = 'http://localhost:8083'
node scripts/capture-screenshots.cjs
```

Microsoft Edge must be installed. For Google Chrome, set `$env:CASHCOMPASS_BROWSER = 'chrome'` before running the script. Override `CASHCOMPASS_PORT` for the local preview server and `CASHCOMPASS_URL` for the capture target if needed.

The script captures all fourteen screens, builds the two overview images, and verifies that adding, editing, and deleting an expense updates the balance without uncaught browser errors. All transactions are local demo state; it does not connect to banking or authentication services.
