# CashCompass — Product & UI/UX Handoff

**Status:** Design-first; no implementation until the user explicitly gives the signal.  
**Date:** 2026-10-15  
**Project:** React Native expense tracker, intended to use Expo and TypeScript.  
**Product name:** CashCompass  
**Character / mascot concept:** Panda Pocket (a friendly panda with backpack and compass). Panda Pocket is **not** the app name.

## Product vision
A friendly, polished expense tracker for everyday money management in the Philippines. The user can record income and expenses, understand where money goes, manage budgets, save toward goals, and review insights. Make financial tracking approachable without sacrificing clarity.

## Visual direction
- Palette: forest green, cream/white, gentle pastel green, warm accents.
- Rounded cards, uncluttered readable text, friendly illustrations.
- Panda mascot at splash/onboarding, transaction success, savings milestones, and occasional contextual reminders; avoid overwhelming the dashboard.
- Philippine peso (₱) as the sample/default currency, configurable in settings.
- Initial UI concept is a **single 14-screen contact sheet**, generated in the ChatGPT conversation. **Image binary has not yet been added to the repository**. Store it at `docs/design/cashcompass-screen-concepts.png` once uploaded. The conversation attachment is named `a_wide_clean_modern_marketing_style_mockup_image.png`. Do not treat this mockup as final detailed UX or copy.

## Screens (initial concept)
1. Splash screen — CashCompass logo, mascot, tagline.
2. Onboarding: Know where your money goes.
3. Onboarding: Reach your goals faster.
4. Onboarding: A happier financial you.
5. Sign in / sign up — Google, Apple, email (authentication options are design proposals, not configured services).
6. Home overview — balance, monthly spending vs budget, recent transactions, fast add actions.
7. Add transaction — expense/income switch, amount, category, date, notes; design includes a possible receipt-scanning action (future scope).
8. Transaction added — confirmation with shortcuts to add another or view transactions.
9. Transaction history — search, date grouping, amount/category information.
10. Category breakdown — chart and spending per category.
11. Budgets — monthly limits and percentage used by category.
12. Savings goals — progress cards and goal creation.
13. Insights / reports — charts, trends, category comparisons.
14. Profile / settings — account, currency, categories, notification preferences, appearance, security, help.

## Primary user journey
```text
Splash
  → Onboarding (3 slides, skip available)
  → Sign in / Create account
  → Initial setup (currency, optional opening balance; recommended addition)
  → Home
     ├─ Add Expense / Income → Enter details → Save → Success → Home or Transactions
     ├─ Transactions → Search / Filter → Transaction details → Edit / Delete
     ├─ Budgets → Set category limits → View remaining / over-budget status
     ├─ Goals → Create goal → Record contribution → Track progress
     ├─ Insights (accessible from Home) → Review month and categories
     └─ Profile → Settings and financial preferences
```

## Proposed navigation
Five primary bottom tabs: **Home**, **Transactions**, **Budgets**, **Goals**, **Profile**. Insights is accessed from Home initially. Add Transaction is a prominent Home action and may be promoted to a floating action button later after design review.

## Important local-market product consideration
Design an **Accounts / Wallets** model with Cash, GCash, Maya, and bank accounts. Distinguish **transfers** between the user's own wallets from genuine expenses so transfers do **not** inflate spending totals. Also support income.

## Core requirements and example scenarios
- Record a ₱250 Grab expense under Transportation; confirm that the list and dashboards reflect it.
- Search transactions and correct erroneous entries.
- Set Food & Drink budget (example ₱8,000) and indicate utilization/remaining amount.
- Save toward an example ₱12,000 hiking trip.
- Show insights by month and category.
- Present amounts in PHP in mockups, but don't hard-code currency into the data model.

## Proposed tech direction — NOT YET APPROVED FOR IMPLEMENTATION
- Expo + React Native + TypeScript, Expo Router for navigation.
- Plan the data model and backend after screenshots, navigation, and behavior are approved.
- Do not interpret this document as approval to scaffold, code, select authentication vendors, or deploy.

## Design review / decisions needed
- Approve or iterate visual style, mascot, typography, and color palette.
- Review each of the 14 mockup screens for legibility and fidelity.
- Refine new-user setup and wallet flows.
- Decide between a dedicated Insights tab vs access from Home.
- Confirm MVP vs later features (e.g. receipt scanning, notifications, charts, sign-in providers).
- Only implement when the user explicitly says to start coding.

## How Codex should use this document
Treat this file as the current design brief and UX reference, not as a finished technical specification. **Screenshots first; code later on explicit user signal.** Preserve the **CashCompass** branding and **Panda Pocket** mascot distinction. When implementing, work in small screen-by-screen milestones, with user approval between stages.
