import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import AppShell from './layout/AppShell';

const OverviewPage = React.lazy(() => import('./pages/OverviewPage'));
const TransactionsPage = React.lazy(() => import('./pages/TransactionsPage'));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage'));

function App() {
  React.useEffect(() => {
    // Apply dark mode class on mount
    const isDarkMode = localStorage.getItem('finance_dashboard_dark_mode');
    if (isDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <FinanceProvider>
      <BrowserRouter>
        <React.Suspense fallback={<div className="sr-only">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="insights" element={<InsightsPage />} />
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;
