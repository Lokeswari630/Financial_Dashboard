import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import AppShell from './layout/AppShell';
import OverviewPage from './pages/OverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

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
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="insights" element={<InsightsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;
