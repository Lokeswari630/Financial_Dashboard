import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart3, PiggyBank, ShoppingBag, Sparkles, Target, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function InsightsSection() {
  const { transactions, isDarkMode, getTotalIncome, getTotalExpenses, getMonthlyTrend } = useFinance();

  const getMonthKey = (dateValue) => {
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const formatCompactCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const formatMonthLabel = (monthKey) => {
    if (!monthKey) {
      return 'N/A';
    }
    const parsed = new Date(`${monthKey}-01`);
    if (Number.isNaN(parsed.getTime())) {
      return monthKey;
    }
    return parsed.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const monthlyTrend = getMonthlyTrend();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0;

  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topExpenseEntry = Object.entries(expenseByCategory).sort(([, a], [, b]) => b - a)[0];
  const topExpenseCategory = topExpenseEntry
    ? topExpenseEntry[0].charAt(0).toUpperCase() + topExpenseEntry[0].slice(1)
    : 'N/A';
  const topExpenseAmount = topExpenseEntry ? topExpenseEntry[1] : 0;

  const lastMonth = monthlyTrend[monthlyTrend.length - 1] || { month: '', income: 0, expense: 0 };
  const prevMonth = monthlyTrend[monthlyTrend.length - 2] || { month: '', income: 0, expense: 0 };

  const monthOnMonthExpensesPct =
    prevMonth.expense > 0
      ? ((lastMonth.expense - prevMonth.expense) / prevMonth.expense) * 100
      : 0;

  const monthOnMonthIncomePct =
    prevMonth.income > 0
      ? ((lastMonth.income - prevMonth.income) / prevMonth.income) * 100
      : 0;

  const netSavingsThisMonth = (lastMonth.income || 0) - (lastMonth.expense || 0);

  const incomeChangeValue = (lastMonth.income || 0) - (prevMonth.income || 0);
  const expenseChangeValue = (lastMonth.expense || 0) - (prevMonth.expense || 0);

  const mostActiveMonth = [...monthlyTrend].sort(
    (a, b) => b.income + b.expense - (a.income + a.expense)
  )[0] || { month: '' };

  const avgMonthlyIncome =
    monthlyTrend.length > 0
      ? monthlyTrend.reduce((sum, item) => sum + item.income, 0) / monthlyTrend.length
      : 0;

  const monthlyComparisonData = [prevMonth, lastMonth]
    .filter((item) => item.month)
    .map((item) => ({
      name: formatMonthLabel(item.month),
      income: item.income,
      expense: item.expense,
    }));

  const monthOptions = React.useMemo(() => {
    const unique = new Set(
      transactions
        .filter((t) => t.type === 'expense')
        .map((t) => getMonthKey(t.date))
        .filter(Boolean)
    );
    return [...unique].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = React.useState(() => monthOptions[0] || '');

  React.useEffect(() => {
    if (!monthOptions.length) {
      setSelectedMonth('');
      return;
    }
    if (!selectedMonth || !monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0]);
    }
  }, [monthOptions, selectedMonth]);

  const monthlyCategoryData = React.useMemo(() => {
    if (!selectedMonth) {
      return [];
    }

    const grouped = transactions
      .filter((t) => t.type === 'expense' && getMonthKey(t.date) === selectedMonth)
      .reduce((acc, t) => {
        const key = t.category || 'other';
        acc[key] = (acc[key] || 0) + t.amount;
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedMonth]);

  const comparisonStats = [
    {
      label: 'Income change',
      value: `${incomeChangeValue >= 0 ? '+' : ''}${formatCompactCurrency(Math.abs(incomeChangeValue))}`,
      percent: `${monthOnMonthIncomePct >= 0 ? '+' : ''}${monthOnMonthIncomePct.toFixed(1)}%`,
      tone: incomeChangeValue >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300',
    },
    {
      label: 'Expense change',
      value: `${expenseChangeValue >= 0 ? '+' : ''}${formatCompactCurrency(Math.abs(expenseChangeValue))}`,
      percent: `${monthOnMonthExpensesPct >= 0 ? '+' : ''}${monthOnMonthExpensesPct.toFixed(1)}%`,
      tone: expenseChangeValue <= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-pink-600 dark:text-pink-300',
    },
    {
      label: 'Net savings',
      value: formatCurrency(netSavingsThisMonth),
      percent: lastMonth.month ? formatMonthLabel(lastMonth.month) : 'Current month',
      tone: netSavingsThisMonth >= 0 ? 'text-violet-600 dark:text-violet-300' : 'text-rose-600 dark:text-rose-300',
    },
  ];

  const summaryCards = [
    {
      title: 'Top Spending Category',
      value: topExpenseCategory,
      subtitle: `${formatCurrency(topExpenseAmount)} spent - your biggest expense bucket.`,
      icon: <ShoppingBag className="h-5 w-5 text-rose-600 dark:text-rose-300" />,
      iconBg: 'bg-rose-100 dark:bg-rose-900/35',
      valueClass: 'text-rose-700 dark:text-rose-300',
    },
    {
      title: 'Savings Rate',
      value: `${Math.max(savingsRate, 0).toFixed(0)}%`,
      subtitle:
        savingsRate >= 20
          ? "Great job! You're saving above the recommended 20% threshold."
          : "You're below the 20% goal. Review variable expenses to improve this metric.",
      icon: <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/35',
      valueClass: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      title: 'Month-on-Month Expenses',
      value: `${monthOnMonthExpensesPct >= 0 ? '+' : ''}${monthOnMonthExpensesPct.toFixed(0)}%`,
      subtitle: `${monthOnMonthExpensesPct >= 0 ? 'Spending rose' : 'Spending dropped'} vs ${formatMonthLabel(prevMonth.month)}.`,
      icon: <TrendingUp className="h-5 w-5 text-pink-600 dark:text-pink-300" />,
      iconBg: 'bg-pink-100 dark:bg-pink-900/35',
      valueClass: monthOnMonthExpensesPct >= 0 ? 'text-pink-700 dark:text-pink-300' : 'text-emerald-700 dark:text-emerald-300',
    },
    {
      title: 'Net Savings This Month',
      value: formatCurrency(netSavingsThisMonth),
      subtitle: `Income ${formatCurrency(lastMonth.income || 0)} minus expenses ${formatCurrency(lastMonth.expense || 0)} for ${formatMonthLabel(lastMonth.month)}.`,
      icon: <Target className="h-5 w-5 text-violet-600 dark:text-violet-300" />,
      iconBg: 'bg-violet-100 dark:bg-violet-900/35',
      valueClass: netSavingsThisMonth >= 0 ? 'text-violet-700 dark:text-violet-300' : 'text-rose-700 dark:text-rose-300',
    },
    {
      title: 'Most Active Month',
      value: formatMonthLabel(mostActiveMonth.month),
      subtitle: 'The month with the highest combined income and expense activity.',
      icon: <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />,
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/35',
      valueClass: 'text-cyan-700 dark:text-cyan-300',
    },
    {
      title: 'Avg Monthly Income',
      value: formatCompactCurrency(avgMonthlyIncome),
      subtitle: 'Average income across all recorded months in your history.',
      icon: <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-300" />,
      iconBg: 'bg-teal-100 dark:bg-teal-900/35',
      valueClass: 'text-teal-700 dark:text-teal-300',
    },
  ];

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

  const axisColor = isDarkMode ? '#8ea0bf' : '#64748b';
  const gridColor = isDarkMode ? 'rgba(100,116,139,0.3)' : 'rgba(148,163,184,0.28)';
  const tooltipStyles = isDarkMode
    ? {
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        border: '1px solid rgba(100,116,139,0.5)',
        borderRadius: '10px',
        color: '#e2e8f0',
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid rgba(148,163,184,0.45)',
        borderRadius: '10px',
        color: '#0f172a',
      };

  return (
    <div className="space-y-8 font-sans">
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-4xl">Insights</h2>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400 sm:text-base">Key observations from your financial data</p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/60 dark:bg-slate-900/75 dark:shadow-[0_18px_40px_rgba(2,6,23,0.52)]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg}`}>
                  {card.icon}
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800 dark:text-white">
                  {card.title}
                </p>
              </div>
              <p className={`mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl ${card.valueClass}`}>{card.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">{card.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-[0_18px_40px_rgba(2,6,23,0.52)]">
        <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">Monthly Comparison</h3>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400 sm:text-base">
          {formatMonthLabel(prevMonth.month)} vs {formatMonthLabel(lastMonth.month)}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {comparisonStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/55"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className={`mt-2 text-xl font-extrabold tracking-tight ${item.tone}`}>
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {item.percent}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparisonData} barGap={0} barCategoryGap="0%">
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis
                stroke={axisColor}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v).replace('.00', '')}
                width={90}
              />
              <Tooltip
                cursor={{ fill: isDarkMode ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.08)' }}
                contentStyle={tooltipStyles}
                formatter={(value, name) => [formatCurrency(Number(value)), name === 'income' ? 'Income' : 'Expense']}
              />
              <Bar dataKey="income" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={70} />
              <Bar dataKey="expense" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={70} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-[0_18px_40px_rgba(2,6,23,0.52)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
              Spending By Category
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400 sm:text-base">
              Category-wise expenses for {selectedMonth ? formatMonthLabel(selectedMonth) : 'selected month'}
            </p>
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field w-full py-2 text-sm"
              disabled={!monthOptions.length}
            >
              {monthOptions.length === 0 ? (
                <option value="">No months available</option>
              ) : (
                monthOptions.map((monthKey) => (
                  <option key={monthKey} value={monthKey}>
                    {formatMonthLabel(monthKey)}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="mt-6 h-80 w-full">
          {monthlyCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCategoryData} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis
                  type="number"
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCompactCurrency(v)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: isDarkMode ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.08)' }}
                  contentStyle={tooltipStyles}
                  formatter={(value) => [formatCurrency(Number(value)), 'Spent']}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {monthlyCategoryData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={getCategoryColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No expense records for this month.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
