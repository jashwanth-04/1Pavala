import React from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { SpendingTrendChart } from '../charts/SpendingTrendChart';
import { BudgetProgressBar } from '../charts/BudgetProgressBar';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, formatDateDisplay, getMonthLabel } from '../../utils/formatters';
import {
  TrendingUp,
  Wallet,
  ArrowRight,
  Plus,
  Receipt,
  Edit2,
  Trash2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentMonthStats,
    selectedMonth,
    settings,
    openAddExpenseModal,
    openEditExpenseModal,
    deleteExpense,
    setActiveTab,
    expenses,
    categoryMap,
  } = useApp();

  const monthExpenses = expenses
    .filter((e) => e.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentExpenses = monthExpenses.slice(0, 5);

  // Compute category segments for Donut Chart
  const categorySegments = React.useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.amount;
    });

    const total = currentMonthStats.totalSpent;
    if (total === 0) return [];

    return Object.entries(categoryTotals)
      .map(([catId, amount]) => {
        const cat = categoryMap.get(catId) || {
          id: catId,
          name: catId,
          icon: 'MoreHorizontal',
          color: '#64748b',
          bgLight: '#f1f5f9',
        };
        const percentage = Math.round((amount / total) * 100);
        return { category: cat, amount, percentage };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, currentMonthStats.totalSpent, categoryMap]);

  const isOverBudget = currentMonthStats.remainingBudget < 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Primary Hero Card (Apple Wallet / Fitness inspired) */}
      <section className="apple-card-elevated p-6 sm:p-8 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Financial Balance */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">
                {getMonthLabel(selectedMonth)} Spending
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/[0.04] dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                {currentMonthStats.expenseCount} {currentMonthStats.expenseCount === 1 ? 'expense' : 'expenses'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1C1C1E] dark:text-white tabular-nums">
                {formatCurrency(currentMonthStats.totalSpent, settings.currencySymbol)}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs sm:text-sm">
              <span
                className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full text-xs ${
                  isOverBudget
                    ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                    : 'bg-[#34C759]/10 text-[#34C759]'
                }`}
              >
                {!isOverBudget && <CheckCircle2 size={13} className="shrink-0" />}
                {isOverBudget
                  ? `Over budget by ${formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)}`
                  : `${formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)} remaining`}
              </span>

              <span className="text-[#8E8E93]">•</span>
              <span className="text-[#8E8E93] font-medium">
                Target: {formatCurrency(currentMonthStats.budget, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={openAddExpenseModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0062C4] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgba(0,122,255,0.25)] transition-all apple-pressable"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Record Expense</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] active:bg-black/[0.12] text-[#1C1C1E] dark:text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all apple-pressable"
            >
              <span>Ledger</span>
              <ArrowRight size={14} className="text-[#8E8E93]" />
            </button>
          </div>
        </div>

        {/* 4 Inset Grouped Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.08]">
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Monthly Budget
            </span>
            <p className="text-xl sm:text-2xl font-bold text-[#1C1C1E] dark:text-white mt-0.5 tabular-nums">
              {formatCurrency(currentMonthStats.budget, settings.currencySymbol)}
            </p>
            <p className="text-[11px] text-[#8E8E93] mt-0.5">Assigned limit</p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Remaining
            </span>
            <p
              className={`text-xl sm:text-2xl font-bold mt-0.5 tabular-nums ${
                isOverBudget ? 'text-[#FF3B30]' : 'text-[#34C759]'
              }`}
            >
              {formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)}
            </p>
            <p className="text-[11px] text-[#8E8E93] mt-0.5">
              {currentMonthStats.budgetPercentage}% utilized
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Average Expense
            </span>
            <p className="text-xl sm:text-2xl font-bold text-[#1C1C1E] dark:text-white mt-0.5 tabular-nums">
              {formatCurrency(currentMonthStats.averageExpense, settings.currencySymbol)}
            </p>
            <p className="text-[11px] text-[#8E8E93] mt-0.5">Per recorded item</p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Lead Category
            </span>
            <p className="text-xl sm:text-2xl font-bold text-[#1C1C1E] dark:text-white mt-0.5 truncate">
              {currentMonthStats.highestCategory
                ? currentMonthStats.highestCategory.category.name
                : '—'}
            </p>
            <p className="text-[11px] text-[#8E8E93] mt-0.5">
              {currentMonthStats.highestCategory
                ? `${formatCurrency(currentMonthStats.highestCategory.amount, settings.currencySymbol)} (${currentMonthStats.highestCategory.percentage}%)`
                : 'None yet'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Budget Utilization Card */}
      <section className="apple-card p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">Budget Pace</h2>
              <p className="text-xs text-[#8E8E93]">Pacing &amp; threshold status for this month</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('budgeting')}
            className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1 apple-pressable"
          >
            Adjust Budget <ChevronRight size={13} />
          </button>
        </div>

        <BudgetProgressBar
          budget={currentMonthStats.budget}
          spent={currentMonthStats.totalSpent}
          currencySymbol={settings.currencySymbol}
          thresholds={settings.thresholds}
          showWarningBanner={true}
        />
      </section>

      {/* 3. Visualizations Grid: Category Breakdown + Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Donut */}
        <section className="apple-card p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center">
                <Receipt size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">Categories</h3>
                <p className="text-xs text-[#8E8E93]">Share of spending by category</p>
              </div>
            </div>
          </div>

          <CategoryDonutChart
            segments={categorySegments}
            totalSpent={currentMonthStats.totalSpent}
            currencySymbol={settings.currencySymbol}
            onSelectCategory={() => setActiveTab('transactions')}
          />
        </section>

        {/* Spending Trend Chart */}
        <section className="apple-card p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">Spending Rhythm</h3>
                <p className="text-xs text-[#8E8E93]">Daily expenditure trajectory</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1 apple-pressable"
            >
              Full Insights <ChevronRight size={13} />
            </button>
          </div>

          <SpendingTrendChart
            expenses={expenses}
            monthKey={selectedMonth}
            currencySymbol={settings.currencySymbol}
          />
        </section>
      </div>

      {/* 4. Recent Transactions List (Apple Inset Grouped List Pattern) */}
      <section className="apple-card bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-[#8E8E93]">
              Latest entries recorded for {getMonthLabel(selectedMonth)}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1 apple-pressable"
          >
            All ({monthExpenses.length}) <ChevronRight size={13} />
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center text-[#8E8E93] mb-3">
              <Receipt size={22} />
            </div>
            <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white">No expenses yet</p>
            <p className="text-xs text-[#8E8E93] mt-1 max-w-xs">
              Add your first purchase to activate instant breakdowns and budget tracking.
            </p>
            <button
              onClick={openAddExpenseModal}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-[#007AFF] text-white px-4 py-2 rounded-full shadow-xs apple-pressable"
            >
              <Plus size={14} />
              <span>Record Expense</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.08]">
            {recentExpenses.map((exp) => {
              const cat = categoryMap.get(exp.categoryId);
              return (
                <div
                  key={exp.id}
                  className="px-5 sm:px-6 py-3.5 flex items-center justify-between group hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CategoryIcon category={cat} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white truncate">
                        {cat?.name || exp.categoryId}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#8E8E93] mt-0.5">
                        <span>{formatDateDisplay(exp.date)}</span>
                        {exp.paymentMethod && (
                          <>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 rounded-md bg-black/[0.04] dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 font-medium text-[10px]">
                              {exp.paymentMethod}
                            </span>
                          </>
                        )}
                        {exp.note && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline truncate max-w-[220px] text-[#8E8E93]">
                              {exp.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white tabular-nums text-right">
                      {formatCurrency(exp.amount, settings.currencySymbol)}
                    </span>
                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditExpenseModal(exp)}
                        className="p-1.5 rounded-full text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#007AFF]/10 transition-colors apple-pressable"
                        title="Edit"
                        aria-label="Edit expense"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete expense of ${settings.currencySymbol}${exp.amount}?`
                            )
                          ) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 rounded-full text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors apple-pressable"
                        title="Delete"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
