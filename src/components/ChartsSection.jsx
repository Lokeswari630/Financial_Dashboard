import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowDownRight, ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ChartsSection() {
  const { transactions, isDarkMode, getMonthlyTrend } = useFinance();
  const [isPieHovering, setIsPieHovering] = React.useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const formatAxisTick = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  const monthlyData = getMonthlyTrend();

  const mockMonthlyData = [
    { month: "Oct'25", income: 4200, expense: 2100 },
    { month: "Nov'25", income: 4600, expense: 2300 },
    { month: "Dec'25", income: 5100, expense: 2600 },
    { month: "Jan'26", income: 5400, expense: 2800 },
    { month: "Feb'26", income: 5800, expense: 3000 },
    { month: "Mar'26", income: 6200, expense: 3400 },
  ];

  const mockPieData = [
    { name: 'Salary', value: 5000 },
    { name: 'Freelance', value: 1200 },
    { name: 'Utilities', value: 600 },
    { name: 'Healthcare', value: 300 },
    { name: 'Shopping', value: 200 },
    { name: 'Food', value: 150 },
  ];

  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const key = transaction.category || 'other';
      acc[key] = (acc[key] || 0) + transaction.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(expenseByCategory)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const CATEGORY_COLOR_MAP = {
    salary: '#3b82f6',
    freelance: '#8b5cf6',
    food: '#10b981',
    transport: '#06b6d4',
    entertainment: '#ec4899',
    utilities: '#14b8a6',
    shopping: '#ef4444',
    healthcare: '#22c55e',
    education: '#f59e0b',
    other: '#eab308',
  };

  const getCategoryColor = (displayName) => {
    const key = String(displayName || '').toLowerCase();
    return CATEGORY_COLOR_MAP[key] || '#3b82f6';
  };

  const effectiveMonthlyData = monthlyData.length >= 2 ? monthlyData : mockMonthlyData;
  const effectivePieData = pieChartData.length > 0 ? pieChartData : mockPieData;

  const formatMonthTick = (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const monthKeyPattern = /^\d{4}-\d{2}$/;
    if (monthKeyPattern.test(value)) {
      const parsed = new Date(`${value}-01`);
      return parsed
        .toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
        .replace(' ', "'");
    }

    if (value.includes("'")) {
      return value;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
        .toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
        .replace(' ', "'");
    }

    const parts = value.split(' ');
    if (parts.length === 2) {
      return `${parts[0]}'${parts[1]}`;
    }

    return value;
  };

  const chartMonthlyData = effectiveMonthlyData.map((item) => ({
    ...item,
    monthLabel: formatMonthTick(item.month),
  }));

  const totalSpend = effectivePieData.reduce((sum, item) => sum + item.value, 0);
  const topSpend = effectivePieData[0] || { name: 'N/A', value: 0 };
  const topSpendShare = totalSpend > 0 ? (topSpend.value / totalSpend) * 100 : 0;

  const lastTwoMonths = effectiveMonthlyData.slice(-2);
  const previousMonthExpense = Number(lastTwoMonths[0]?.expense || 0);
  const currentMonthExpense = Number(lastTwoMonths[1]?.expense || 0);
  const monthlyTrendPercent =
    previousMonthExpense > 0
      ? ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100
      : 0;
  const isTrendDown = monthlyTrendPercent < 0;

  const insightText =
    topSpendShare >= 50
      ? `Watch out! ${topSpend.name} makes up ${topSpendShare.toFixed(0)}% of your total spending. Consider optimizing this budget.`
      : `Good balance. ${topSpend.name} is your top spend at ${topSpendShare.toFixed(0)}% of total spending. Keep monitoring monthly changes.`;

  const formatCompactCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const axisColor = isDarkMode ? '#94a3b8' : '#6b7280';
  const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.28)';
  const lineTooltipStyles = isDarkMode
    ? {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        border: '1px solid #374151',
        borderRadius: '8px',
        color: '#fff',
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        color: '#111827',
      };
  const pieTooltipStyles = isDarkMode
    ? {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: '8px',
        color: '#f8fafc',
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid rgba(148, 163, 184, 0.45)',
        borderRadius: '8px',
        color: '#111827',
      };

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
      <div className="card bg-white dark:bg-slate-900/80">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Monthly Cash Flow
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Income vs Expense trend
          </p>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="monthLabel" stroke={axisColor} />
              <YAxis stroke={axisColor} tickFormatter={formatAxisTick} />
              <Tooltip
                contentStyle={lineTooltipStyles}
                labelStyle={{ color: isDarkMode ? '#fff' : '#111827' }}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Legend wrapperStyle={{ color: isDarkMode ? '#cbd5e1' : '#4b5563' }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card bg-white dark:bg-slate-900/80">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Spend Analysis
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Top categories and monthly movement
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1fr] xl:items-center">
          <div className="relative mx-auto w-full max-w-[250px] aspect-square sm:max-w-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={effectivePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  labelLine={false}
                  stroke={isDarkMode ? '#334155' : '#e5e7eb'}
                  strokeWidth={2}
                  dataKey="value"
                  onMouseEnter={() => setIsPieHovering(true)}
                  onMouseLeave={() => setIsPieHovering(false)}
                >
                  {effectivePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={pieTooltipStyles}
                  itemStyle={{ color: isDarkMode ? '#f8fafc' : '#111827' }}
                  labelStyle={{ color: isDarkMode ? '#cbd5e1' : '#4b5563' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`flex max-w-[72%] flex-col items-center justify-center gap-1 text-center transition-opacity duration-150 ${
                  isPieHovering ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-gray-500 dark:text-gray-400">Total</p>
                <p className="whitespace-nowrap text-2xl font-extrabold leading-none text-gray-900 dark:text-white sm:text-[30px]">{formatCompactCurrency(totalSpend)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/50">
              <p className="mb-1.5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">
                <Flame className="h-3 w-3 text-rose-500" />
                Top Spend
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-slate-100 sm:text-xl">{topSpend.name}</p>
              <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 sm:text-sm">
                {formatCurrency(topSpend.value)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/50">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">Monthly Trend</p>
              <p
                className={`flex items-center gap-2 text-lg font-bold sm:text-xl ${
                  isTrendDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isTrendDown ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                {Math.abs(monthlyTrendPercent).toFixed(1)}%
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-gray-500 dark:text-gray-400">vs last month</p>
            </div>
          </div>
        </div>

       

        <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {effectivePieData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-xs sm:text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(item.name) }}
              ></span>
              <span className="text-gray-700 dark:text-slate-300">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
