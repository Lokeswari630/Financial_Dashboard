# Finance Dashboard

A responsive finance dashboard built with React, Vite, Tailwind CSS, and Recharts.

It helps track transactions, visualize monthly trends, and view insights with light/dark theme support.

## Highlights

- Dashboard overview cards for balance, income, expenses, and savings rate
- Monthly cash flow line chart
- Spend analysis doughnut chart with category breakdown
- Insights page with KPI cards and monthly comparison chart
- Spending by category chart with month selector
- Transactions table with search, filters, sorting, and pagination
- CSV export by date range
- Role-based UI behavior (viewer/admin)
- Persistent data and preferences using localStorage

## Tech Stack

- React 18
- React Router DOM 6
- Tailwind CSS 3
- Recharts 2
- Lucide React + React Icons
- Vite 5

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Open app

```text
http://localhost:5173
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build in `dist`
- `npm run preview` - preview production build locally

## Project Structure

```text
src/
   components/
      ChartsSection.jsx
      DashboardOverview.jsx
      Header.jsx
      InsightsSection.jsx
      TransactionForm.jsx
      TransactionsTable.jsx
   context/
      FinanceContext.jsx
   layout/
      AppShell.jsx
   pages/
      OverviewPage.jsx
      TransactionsPage.jsx
      InsightsPage.jsx
   App.jsx
   main.jsx
   index.css
```

## Deployment Notes

This project is configured for Vercel SPA routing using `vercel.json`.

If direct-refresh on nested routes (for example `/insights`) returns 404, ensure `vercel.json` is present in the repo root with an index rewrite.

## Current Behavior Notes

- Transaction and theme state persist in localStorage.
- Dark mode is supported throughout the app.
- Category colors are deterministic across charts.

## License

MIT
