import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext(undefined);

const STORAGE_KEY = 'finance_dashboard_data';
const DARK_MODE_KEY = 'finance_dashboard_dark_mode';
const ROLE_KEY = 'finance_dashboard_role';

// Default transactions data
const defaultTransactions = [
  {
    id: '1',
    date: '2024-03-25',
    amount: 5000,
    category: 'salary',
    type: 'income',
    description: 'Monthly Salary',
  },
  {
    id: '2',
    date: '2024-03-24',
    amount: 150,
    category: 'food',
    type: 'expense',
    description: 'Groceries',
  },
  {
    id: '3',
    date: '2024-03-23',
    amount: 50,
    category: 'transport',
    type: 'expense',
    description: 'Taxi fare',
  },
  {
    id: '4',
    date: '2024-03-22',
    amount: 1200,
    category: 'freelance',
    type: 'income',
    description: 'Freelance project',
  },
  {
    id: '5',
    date: '2024-03-20',
    amount: 80,
    category: 'entertainment',
    type: 'expense',
    description: 'Movie tickets',
  },
  {
    id: '6',
    date: '2024-03-18',
    amount: 600,
    category: 'utilities',
    type: 'expense',
    description: 'Electricity and water bills',
  },
  {
    id: '7',
    date: '2024-03-15',
    amount: 200,
    category: 'shopping',
    type: 'expense',
    description: 'Clothing',
  },
  {
    id: '8',
    date: '2024-03-10',
    amount: 300,
    category: 'healthcare',
    type: 'expense',
    description: 'Doctor appointment',
  },
  {
    id: '9',
    date: '2024-02-28',
    amount: 5100,
    category: 'salary',
    type: 'income',
    description: 'February Salary',
  },
  {
    id: '10',
    date: '2024-02-22',
    amount: 900,
    category: 'freelance',
    type: 'income',
    description: 'Website redesign payment',
  },
  {
    id: '11',
    date: '2024-02-18',
    amount: 420,
    category: 'utilities',
    type: 'expense',
    description: 'Internet and electricity',
  },
  {
    id: '12',
    date: '2024-02-12',
    amount: 260,
    category: 'food',
    type: 'expense',
    description: 'Weekend groceries',
  },
  {
    id: '13',
    date: '2024-01-29',
    amount: 5200,
    category: 'salary',
    type: 'income',
    description: 'January Salary',
  },
  {
    id: '14',
    date: '2024-01-21',
    amount: 350,
    category: 'education',
    type: 'expense',
    description: 'Online course subscription',
  },
  {
    id: '15',
    date: '2024-01-15',
    amount: 180,
    category: 'transport',
    type: 'expense',
    description: 'Fuel and metro recharge',
  },
];

export const FinanceProvider = ({ children }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);

  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultTransactions;
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length < defaultTransactions.length) {
        return defaultTransactions;
      }
      return Array.isArray(parsed) ? parsed : defaultTransactions;
    } catch {
      return defaultTransactions;
    }
  });

  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    return stored || 'viewer';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return JSON.parse(stored);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update localStorage when transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Update localStorage when role changes
  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  // Update localStorage and apply dark mode class when isDarkMode changes
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const editTransaction = (id, updatedTransaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...updatedTransaction, id } : t
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getTransactionsByCategory = () => {
    const categories = {
      salary: 0,
      freelance: 0,
      food: 0,
      transport: 0,
      entertainment: 0,
      utilities: 0,
      shopping: 0,
      healthcare: 0,
      education: 0,
      other: 0,
    };

    transactions.forEach((t) => {
      categories[t.category] += t.amount;
    });

    return categories;
  };

  const getMonthlyTrend = () => {
    const months = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expense += t.amount;
      }
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month,
        ...data,
      }));
  };

  const getInsights = () => {
    const insights = [];
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const balance = totalIncome - totalExpenses;
    const categories = getTransactionsByCategory();
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');
    const incomeTransactions = transactions.filter((t) => t.type === 'income');

    if (transactions.length === 0) {
      return ['📊 Add your first transaction to unlock personalized insights.'];
    }

    // Balance insight
    if (totalIncome === 0 && totalExpenses > 0) {
      insights.push('⚠️ No income entries detected yet while expenses exist. Add income transactions for better planning.');
    } else if (balance > 0 && totalIncome > 0) {
      const savingsRate = ((balance / totalIncome) * 100).toFixed(1);
      insights.push(`💰 Great! You have a ${savingsRate}% savings rate. Keep it up!`);
    } else if (balance < 0) {
      insights.push(
        `⚠️ Warning: Your expenses exceed income by ${formatCurrency(Math.abs(balance))}. Consider reducing expenses.`
      );
    } else {
      insights.push(`📊 You're breaking even this month. Aim to increase savings.`);
    }

    // Highest expense category
    const highestCategory = Object.entries(categories)
      .filter(([key]) => ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'healthcare', 'education', 'other'].includes(key))
      .sort(([, a], [, b]) => b - a)[0];

    if (highestCategory) {
      const [category, amount] = highestCategory;
      const categoryShare = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(0) : '0';
      insights.push(
        `📌 Your highest expense category is ${category} at ${formatCurrency(amount)} (${categoryShare}% of expenses).`
      );

      if (Number(categoryShare) >= 40) {
        insights.push(
          `⚠️ ${category} alone contributes ${categoryShare}% of total expenses. Consider adding a monthly cap for this category.`
        );
      }
    }

    // Spending trend
    const trend = getMonthlyTrend();
    if (trend.length >= 2) {
      const lastMonth = trend[trend.length - 1];
      const prevMonth = trend[trend.length - 2];
      const expenseChange = lastMonth.expense - prevMonth.expense;
      const incomeChange = lastMonth.income - prevMonth.income;

      if (expenseChange > 0) {
        const expenseChangePct = prevMonth.expense > 0
          ? ((expenseChange / prevMonth.expense) * 100).toFixed(1)
          : '0.0';
        insights.push(
          `📈 Your expenses increased by ${formatCurrency(Math.abs(expenseChange))} (${expenseChangePct}%) compared to last month.`
        );
      } else if (expenseChange < 0) {
        insights.push(
          `📉 Great! Your expenses decreased by ${formatCurrency(Math.abs(expenseChange))} compared to last month.`
        );
      }

      if (incomeChange > 0) {
        insights.push(`📈 Income improved by ${formatCurrency(incomeChange)} versus last month.`);
      } else if (incomeChange < 0) {
        insights.push(`⚠️ Income dropped by ${formatCurrency(Math.abs(incomeChange))} versus last month.`);
      }
    }

    // Discretionary spend monitoring
    const discretionaryCategories = ['shopping', 'entertainment', 'other'];
    const discretionaryExpense = expenseTransactions
      .filter((t) => discretionaryCategories.includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses > 0) {
      const discretionaryShare = (discretionaryExpense / totalExpenses) * 100;
      if (discretionaryShare >= 35) {
        insights.push(
          `💡 Discretionary spending is ${discretionaryShare.toFixed(0)}% of total expenses. A small cut here can improve savings quickly.`
        );
      }
    }

    // Largest single expense insight
    if (expenseTransactions.length > 0 && totalExpenses > 0) {
      const largestExpense = [...expenseTransactions].sort((a, b) => b.amount - a.amount)[0];
      const spikeShare = (largestExpense.amount / totalExpenses) * 100;
      if (spikeShare >= 25) {
        insights.push(
          `⚠️ A single transaction (${largestExpense.description}) accounts for ${spikeShare.toFixed(0)}% of expenses.`
        );
      }
    }

    // Recency and activity insight
    if (transactions.length > 0) {
      const latestTransactionDate = new Date(
        Math.max(...transactions.map((t) => new Date(t.date).getTime()))
      );
      const msInDay = 1000 * 60 * 60 * 24;
      const daysSinceLastTxn = Math.floor((Date.now() - latestTransactionDate.getTime()) / msInDay);

      if (daysSinceLastTxn >= 14) {
        insights.push(`📊 No transactions were added in the last ${daysSinceLastTxn} days. Update records for more accurate insights.`);
      }
    }

    // Income diversity insight
    const hasSalary = incomeTransactions.some((t) => t.category === 'salary');
    const hasFreelance = incomeTransactions.some((t) => t.category === 'freelance');
    if (hasSalary && !hasFreelance) {
      insights.push('💡 You currently rely on one primary income source. Consider adding a secondary stream for better stability.');
    }

    // Income opportunities
    if (categories.freelance === 0 && totalIncome > 0) {
      insights.push(`💡 Consider exploring freelance opportunities to increase income.`);
    }

    return insights;
  };

  const value = {
    transactions,
    role,
    isDarkMode,
    addTransaction,
    editTransaction,
    deleteTransaction,
    setRole,
    toggleDarkMode,
    getTransactionsByCategory,
    getTotalIncome,
    getTotalExpenses,
    getTotalBalance,
    getMonthlyTrend,
    getInsights,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
