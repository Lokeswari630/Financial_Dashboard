import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Download,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import TransactionForm from './TransactionForm';

export default function TransactionsTable() {
  const {
    transactions,
    role,
    deleteTransaction,
    editTransaction,
    addTransaction,
  } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFromDate, setExportFromDate] = useState('');
  const [exportToDate, setExportToDate] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);

  // Get unique categories from transactions
  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.amount.toString().includes(searchTerm)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Sorting
    filtered.sort((a, b) => {
      const amountA = Number(a.amount) || 0;
      const amountB = Number(b.amount) || 0;
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;

      switch (sortBy) {
        case 'date':
          return dateB - dateA;
        case 'amount-desc':
          return amountB - amountA;
        case 'amount-asc':
          return amountA - amountB;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / recordsPerPage)
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingId) {
      editTransaction(editingId, formData);
      setEditingId(null);
    } else {
      addTransaction(formData);
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const toggleExpandedTransaction = (id) => {
    setExpandedTransactionId((prev) => (prev === id ? null : id));
  };

  const exportToCsv = () => {
    if (!exportFromDate || !exportToDate) {
      alert('Please select both From Date and To Date.');
      return;
    }

    if (new Date(exportFromDate) > new Date(exportToDate)) {
      alert('From Date cannot be after To Date.');
      return;
    }

    const start = new Date(exportFromDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(exportToDate);
    end.setHours(23, 59, 59, 999);

    const selectedTransactions = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (selectedTransactions.length === 0) {
      alert('No transactions found in the selected date range.');
      return;
    }

    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;

    const header = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
    const rows = selectedTransactions.map((t) => [
      new Date(t.date).toLocaleDateString('en-IN'),
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${exportFromDate}_to_${exportToDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
  };

  const editingTransaction = editingId
    ? transactions.find((t) => t.id === editingId)
    : null;

  // Calculate statistics
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const incomeAmount = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseAmount = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="card overflow-hidden">
      <div className="mb-6">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              📊 Transactions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              type="button"
              className="btn-secondary flex items-center gap-2 whitespace-nowrap px-3 sm:px-4"
              aria-label="Export transactions as CSV"
            >
              <Download className="w-4 h-4" aria-hidden="true" focusable="false" />
              Export
            </button>
            {role === 'admin' && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setShowForm(true);
                }}
                type="button"
                disabled={showForm}
                className="btn-primary flex items-center gap-2 whitespace-nowrap px-3 sm:px-4"
                aria-label="Add transaction"
              >
                <Plus className="w-5 h-5" aria-hidden="true" focusable="false" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Transaction</span>
              </button>
            )}
          </div>
        </div>

        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Export Transactions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Select date range to download CSV
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={exportFromDate}
                    onChange={(e) => setExportFromDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={exportToDate}
                    onChange={(e) => setExportToDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={exportToCsv}
                  type="button"
                  className="btn-primary flex-1"
                >
                  Download CSV
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  type="button"
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Form */}
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {/* Statistics Bar */}
        {filteredTransactions.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 sm:gap-4 sm:p-4 dark:bg-gray-700">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Total
              </p>
              <p className="whitespace-nowrap text-sm font-bold tabular-nums text-gray-900 dark:text-white sm:text-lg">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold mb-1">
                Income
              </p>
              <p className="whitespace-nowrap text-sm font-bold tabular-nums text-green-600 sm:text-lg">
                {formatCurrency(incomeAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-red-600 font-semibold mb-1">
                Expenses
              </p>
              <p className="whitespace-nowrap text-sm font-bold tabular-nums text-red-600 sm:text-lg">
                {formatCurrency(expenseAmount)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search + Filter Toggle */}
      <div className="mb-6 space-y-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" focusable="false" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field h-12 pl-10"
              aria-label="Search transactions"
            />
          </div>

          <div className="grid w-full grid-cols-5 items-center gap-3 lg:flex lg:w-auto lg:justify-end">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              type="button"
              className="btn-secondary col-span-2 flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap px-3 lg:w-auto lg:px-4"
              aria-expanded={showFilters}
              aria-controls="transaction-filters"
            >
              <Filter className="w-4 h-4" aria-hidden="true" focusable="false" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>

            <div className="col-span-3 inline-flex h-12 w-full rounded-lg border border-gray-300 p-1 dark:border-gray-600 lg:w-auto">
              <button
                onClick={() => setViewMode('table')}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition sm:px-4 ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={viewMode === 'table'}
                aria-label="Show table view"
              >
                <List className="h-4 w-4" aria-hidden="true" focusable="false" />
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition sm:px-4 ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={viewMode === 'cards'}
                aria-label="Show cards view"
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" focusable="false" />
                Cards
              </button>
            </div>
          </div>
        </div>

        

        {showFilters && (
          <div id="transaction-filters" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date">Newest First</option>
              <option value="amount-desc">High to Low</option>
              <option value="amount-asc">Low to High</option>
            </select>
          </div>
        )}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-28" />
                <col />
                <col className="hidden sm:table-column w-36" />
                <col className="w-32" />
                {role === 'admin' && <col className="hidden md:table-column w-28" />}
              </colgroup>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                  <th className="hidden sm:table-cell text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  {role === 'admin' && (
                    <th className="hidden md:table-cell text-center py-3 px-2 sm:px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => {
                  const isLargeExpense =
                    transaction.type === 'expense' && transaction.amount > 500;

                  return (
                    <React.Fragment key={transaction.id}>
                      <tr
                        className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/70 ${
                          isLargeExpense
                            ? 'bg-red-50/60 dark:bg-red-950/30'
                            : 'bg-white dark:bg-gray-900'
                        }`}
                      >
                        <td className="whitespace-nowrap py-4 px-2 sm:px-4 text-sm text-gray-600 dark:text-gray-400 align-top">
                          {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-4 px-2 sm:px-4 text-sm font-medium text-gray-900 dark:text-white align-top">
                          <div className="flex min-w-0 items-start justify-between gap-2">
                            <span className="truncate">{transaction.description}</span>
                          </div>
                          {isLargeExpense && (
                            <span className="mt-2 inline-flex text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                              ⚠ Large Expense
                            </span>
                          )}
                          <div className="mt-1 sm:hidden">
                            <span className="badge badge-info">
                              {transaction.category.charAt(0).toUpperCase() +
                                transaction.category.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell py-4 px-2 sm:px-4 align-top">
                          <span className="badge badge-info">
                            {transaction.category.charAt(0).toUpperCase() +
                              transaction.category.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-4 px-2 sm:px-4 text-right align-top">
                          <span
                            className={`font-bold text-sm tabular-nums ${
                              transaction.type === 'income'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount).replace('₹', '₹ ')}
                          </span>
                        </td>
                        {role === 'admin' && (
                          <td className="hidden md:table-cell py-4 px-2 sm:px-4 text-center align-top">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(transaction);
                                }}
                                type="button"
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                title="Edit transaction"
                                aria-label={`Edit transaction ${transaction.description}`}
                              >
                                <Edit2 className="w-4 h-4" aria-hidden="true" focusable="false" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTransaction(transaction.id);
                                }}
                                type="button"
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                title="Delete transaction"
                                aria-label={`Delete transaction ${transaction.description}`}
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" focusable="false" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedTransactions.map((transaction) => {
              const isLargeExpense =
                transaction.type === 'expense' && transaction.amount > 500;
              const isExpanded = expandedTransactionId === transaction.id;

              return (
                <div
                  key={transaction.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isLargeExpense
                      ? 'border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30'
                      : 'border-gray-200 bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </p>
                      <h4 className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {transaction.description}
                      </h4>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="badge badge-info">
                          {transaction.category.charAt(0).toUpperCase() +
                            transaction.category.slice(1)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            transaction.type === 'income'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold text-base ${
                          transaction.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount).replace('₹', '₹ ')}
                      </p>
                      <button
                        onClick={() => toggleExpandedTransaction(transaction.id)}
                        type="button"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-expanded={isExpanded}
                        aria-controls={`transaction-details-${transaction.id}`}
                      >
                        {isExpanded ? 'Hide details' : 'Show details'}
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" focusable="false" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" focusable="false" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div id={`transaction-details-${transaction.id}`} className="mt-3 rounded-lg bg-gray-100 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      <p>
                        <span className="font-semibold">Transaction ID:</span> {transaction.id}
                      </p>
                      {isLargeExpense && (
                        <p className="mt-1 text-red-600 dark:text-red-400 font-medium">
                          Marked as large expense (above ₹ 500)
                        </p>
                      )}
                    </div>
                  )}

                  {role === 'admin' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        type="button"
                        className="flex-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        type="button"
                        className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
            No transactions found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {searchTerm
              ? 'Try adjusting your search or filters'
              : 'Add your first transaction as an Admin'}
          </p>
        </div>
      )}

      {filteredTransactions.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            type="button"
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Go to previous page"
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              type="button"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            type="button"
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
