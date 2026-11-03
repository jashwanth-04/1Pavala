import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, formatDateDisplay, getMonthLabel, getPreviousMonthKey } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../constants/categories';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Download,
  Receipt,
  X,
} from 'lucide-react';
import { Expense, SortField, SortOrder } from '../../types';

export const TransactionListView: React.FC = () => {
  const {
    expenses,
    categories,
    categoryMap,
    settings,
    openAddExpenseModal,
    openEditExpenseModal,
    deleteExpense,
    exportData,
    currentMonthKey,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Month options
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      if (e.date?.length >= 7) set.add(e.date.substring(0, 7));
    });
    set.add(currentMonthKey);
    return Array.from(set).sort().reverse();
  }, [expenses, currentMonthKey]);

  // Filter & Sort
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // Month
      if (selectedMonth !== 'ALL' && !exp.date.startsWith(selectedMonth)) {
        return false;
      }
      // Category
      if (selectedCategory !== 'ALL' && exp.categoryId !== selectedCategory) {
        return false;
      }
      // Payment Method
      if (selectedMethod !== 'ALL' && exp.paymentMethod !== selectedMethod) {
        return false;
      }
      // Search Note or Category Name
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const catName = categoryMap.get(exp.categoryId)?.name?.toLowerCase() || '';
        const note = (exp.note || '').toLowerCase();
        const method = (exp.paymentMethod || '').toLowerCase();
        if (!catName.includes(q) && !note.includes(q) && !method.includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === 'category') {
        const catA = categoryMap.get(a.categoryId)?.name || '';
        const catB = categoryMap.get(b.categoryId)?.name || '';
        return sortOrder === 'asc' ? catA.localeCompare(catB) : catB.localeCompare(catA);
      }
      return 0;
    });
  }, [expenses, selectedMonth, selectedCategory, selectedMethod, searchQuery, sortBy, sortOrder, categoryMap]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'ALL' || selectedMonth !== 'ALL' || selectedMethod !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedMonth('ALL');
    setSelectedMethod('ALL');
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transaction History
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={() => exportData('csv')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors whitespace-nowrap"
            title="Download CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddExpenseModal}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md shadow-brand-600/25 transition-all whitespace-nowrap"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200/80 space-y-3 sm:space-y-4">
        {/* Search box - full width */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search note, category..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 3 Filters placed beside each other in a line */}
        <div className="grid grid-cols-3 gap-2">
          {/* Month selector filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500 cursor-pointer truncate"
            >
              <option value="ALL">Month</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {getMonthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500 cursor-pointer truncate"
            >
              <option value="ALL">Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment method filter */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500 cursor-pointer truncate"
            >
              <option value="ALL">Payment</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter stats and Sort buttons - Swapped order */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100 text-xs">
          {/* Sort toggles (First) */}
          <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto pb-0.5 sm:pb-0">
            <span className="mr-1 text-[11px] uppercase tracking-wider font-semibold text-slate-400 shrink-0">
              Sort by:
            </span>
            <button
              onClick={() => toggleSort('date')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-[#214B30] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.12]'
              }`}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('amount')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'amount'
                  ? 'bg-[#214B30] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.12]'
              }`}
            >
              Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('category')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'category'
                  ? 'bg-[#214B30] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.12]'
              }`}
            >
              Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          {/* Expenses found & Total (Second) */}
          <div className="flex items-center gap-2 text-slate-600 flex-wrap">
            <span className="font-semibold text-slate-900">{filteredExpenses.length}</span> expenses found
            <span className="text-slate-300">•</span>
            <span>Total: </span>
            <span className="font-bold text-slate-900">
              {formatCurrency(totalFilteredAmount, settings.currencySymbol)}
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-2 inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="py-14 px-4 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Receipt size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No expenses found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {hasActiveFilters
                ? 'Try adjusting your search query, month, or category filters.'
                : 'Get started by recording your first transaction.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={openAddExpenseModal}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs"
              >
                <Plus size={16} />
                <span>Add First Expense</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredExpenses.map((exp) => {
              const cat = categoryMap.get(exp.categoryId);

              return (
                <div
                  key={exp.id}
                  onClick={() => openEditExpenseModal(exp)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openEditExpenseModal(exp);
                    }
                  }}
                  className="p-3.5 sm:p-4 sm:px-6 hover:bg-slate-50/80 active:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group select-none"
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <CategoryIcon category={cat} size="lg" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {cat?.name || exp.categoryId}
                      </div>

                      {/* Description: Date and payment type beside each other */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600">
                          {formatDateDisplay(exp.date)}
                        </span>
                        {exp.paymentMethod && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                              {exp.paymentMethod}
                            </span>
                          </>
                        )}
                        {exp.note && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="truncate max-w-[150px] sm:max-w-[280px] text-slate-500 italic">
                              "{exp.note}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete button (Row click opens edit modal) */}
                  <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {formatCurrency(exp.amount, settings.currencySymbol)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Delete expense of ${settings.currencySymbol}${exp.amount}?`
                          )
                        ) {
                          deleteExpense(exp.id);
                        }
                      }}
                      className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete expense"
                      aria-label="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
