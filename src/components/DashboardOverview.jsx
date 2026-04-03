import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, PiggyBank } from 'lucide-react';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function DashboardOverview() {
  const { getTotalIncome, getTotalExpenses, getTotalBalance, transactions } =
    useFinance();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const totalBalance = getTotalBalance();
  const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : '0.0';

  // Calculate trend
  const recentTransactions = transactions.slice(0, 10);
  const lastMonthTransactions = recentTransactions.filter((t) => {
    const transDate = new Date(t.date);
    return transDate.getMonth() === new Date().getMonth() - 1;
  });

  const lastMonthExpense = lastMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpense = transactions
    .filter((t) => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === new Date().getMonth();
    })
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTrend = currentMonthExpense - lastMonthExpense;
  const expenseTrendPercent =
    lastMonthExpense > 0
      ? ((Math.abs(expenseTrend) / lastMonthExpense) * 100).toFixed(1)
      : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in">
      {/* Total Balance Card */}
      <div className="stat-card balance group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">
              Total Balance
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {formatCurrency(totalBalance)}
            </p>
            <p className={`text-sm flex items-center gap-1 ${
              totalBalance >= 0
                ? 'text-green-600 font-semibold'
                : 'text-red-600 font-semibold'
            }`}>
              {totalBalance >= 0 ? (
                <>
                  <FaArrowUp className="w-4 h-4" />
                  Positive
                </>
              ) : (
                <>
                  <FaArrowDown className="w-4 h-4" />
                  Negative
                </>
              )}
            </p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0 ml-3">
            <FaWallet className="text-lg text-blue-600 dark:text-blue-300" />
          </div>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="stat-card income group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">
              Total Income
            </p>
            <p className="text-3xl font-bold text-green-600 mb-3">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              All time
            </p>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0 ml-3">
            <FaArrowUp className="text-lg text-green-600 dark:text-green-300" />
          </div>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="stat-card expense group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-red-600 mb-3">
              {formatCurrency(totalExpenses)}
            </p>
            <p className={`text-sm font-semibold flex items-center gap-1 ${
              expenseTrend <= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {expenseTrend <= 0 ? (
                <>
                  <FaArrowDown className="w-4 h-4" />
                  Down {expenseTrendPercent}%
                </>
              ) : (
                <>
                  <FaArrowUp className="w-4 h-4" />
                  Up {expenseTrendPercent}%
                </>
              )}
            </p>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg flex-shrink-0 ml-3">
            <FaArrowDown className="text-lg text-red-600 dark:text-red-300" />
          </div>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="stat-card group border-l-amber-500">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">
              Savings Rate
            </p>
            <p className="text-3xl font-bold text-amber-600 mb-3">
              {savingsRate}%
            </p>
            <p className="text-sm text-amber-600 font-semibold">
              Of total income saved
            </p>
          </div>
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg flex-shrink-0 ml-3">
            <PiggyBank className="w-5 h-5 text-amber-600 dark:text-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
