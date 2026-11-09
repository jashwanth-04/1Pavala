import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, formatDateDisplay, getMonthLabel, getShortMonthLabel, getPreviousMonthKey } from '../../utils/formatters';
import {
  Plus,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Calendar,
  TrendingUp,
  Receipt,
  CheckCircle2,
  AlertCircle,
  PieChart,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentMonthStats,
    selectedMonth,
    setSelectedMonth,
    currentMonthKey,
    settings,
    openAddExpenseModal,
    setActiveTab,
    expenses,
    categoryMap,
  } = useApp();

  // Build list of available months for selection
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    monthSet.add(currentMonthKey);
    monthSet.add(getPreviousMonthKey(currentMonthKey));

    expenses.forEach((e) => {
      if (e.date && e.date.length >= 7) {
        monthSet.add(e.date.substring(0, 7));
      }
    });

    return Array.from(monthSet).sort().reverse();
  }, [expenses, currentMonthKey]);

  // Transactions for the selected month, sorted newest first
  const monthExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(selectedMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedMonth]);

  // Executive summary: last 4 expenses only for glanceability
  const recentExpenses = useMemo(() => monthExpenses.slice(0, 4), [monthExpenses]);

  // Executive summary: top 4 spending categories
  const topCategories = useMemo(() => {
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
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [monthExpenses, currentMonthStats.totalSpent, categoryMap]);

  const isOverBudget = currentMonthStats.remainingBudget < 0;
  const budgetPercentage = currentMonthStats.budget > 0
    ? Math.round((currentMonthStats.totalSpent / currentMonthStats.budget) * 100)
    : 0;
  const clampedProgress = Math.min(100, Math.max(0, budgetPercentage));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* =========================================================
          1. EXECUTIVE HERO CARD (Apple Wallet / Card Pattern)
          High glanceability: Balance, budget pacing, and actions
          ========================================================= */}
      <section className="apple-card-elevated p-5 sm:p-7 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08]">
        {/* Top Meta Row: Compact Month Capsule on Left + Badges on Right */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {/* Compact Month Capsule (Shortened for mobile, perfectly balanced) */}
          <div className="relative inline-flex items-center">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.14] border border-black/[0.05] dark:border-white/[0.08] text-[#1C1C1E] dark:text-white transition-all duration-150 cursor-pointer pointer-events-none select-none shadow-2xs">
              <Calendar size={11} className="text-[#214B30] dark:text-[#34C759] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                <span className="sm:hidden">{getShortMonthLabel(selectedMonth)}</span>
                <span className="hidden sm:inline">{getMonthLabel(selectedMonth)}</span>
              </span>
              <ChevronDown size={10} className="text-[#8E8E93] shrink-0 ml-0.5" />
            </div>

            {/* Invisible native select for fluid touch wheel / dropdown selection */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Change Month"
              aria-label="Change month"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {getMonthLabel(m)} {m === currentMonthKey ? '• Current' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Minimized Meta Badges: Sleek micro-capsules matching height */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Expense Count Micro-Tag */}
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.08] text-slate-600 dark:text-slate-400 whitespace-nowrap leading-none">
              {currentMonthStats.expenseCount} {currentMonthStats.expenseCount === 1 ? 'expense' : 'expenses'}
            </span>

            {/* Minimized Budget Status Micro-Pill */}
            <div
              className={`inline-flex items-center gap-1 font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs whitespace-nowrap leading-none ${
                isOverBudget
                  ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                  : 'bg-[#34C759]/10 text-[#34C759]'
              }`}
            >
              {isOverBudget ? (
                <AlertCircle size={10} className="sm:w-3 sm:h-3 shrink-0" />
              ) : (
                <CheckCircle2 size={10} className="sm:w-3 sm:h-3 shrink-0" />
              )}
              <span>
                {isOverBudget
                  ? `Over by ${formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)}`
                  : `${formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Total Amount */}
        <div className="mt-1">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1C1C1E] dark:text-white tabular-nums">
            {formatCurrency(currentMonthStats.totalSpent, settings.currencySymbol)}
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-medium">
            Target limit: {formatCurrency(currentMonthStats.budget, settings.currencySymbol)}
          </p>
        </div>

        {/* Apple-style Integrated Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="h-2 w-full bg-black/[0.04] dark:bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-[#FF3B30]'
                  : budgetPercentage >= 85
                  ? 'bg-[#FF9500]'
                  : 'bg-[#214B30] dark:bg-[#34C759]'
              }`}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#8E8E93] font-medium">
            <span>{budgetPercentage}% consumed</span>
            <span>{formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)} {isOverBudget ? 'over' : 'available'}</span>
          </div>
        </div>

        {/* Symmetrical Quick Actions Row (Fixed for Mobile & Desktop - No Text Wrapping, Matching Heights) */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-black/[0.05] dark:border-white/[0.08]">
          <button
            onClick={openAddExpenseModal}
            className="h-11 px-4 rounded-full bg-[#214B30] hover:bg-[#1A3B26] active:bg-[#132B1C] text-white text-xs sm:text-sm font-semibold shadow-[0_2px_10px_rgba(33,75,48,0.28)] border border-white/10 transition-all apple-pressable flex items-center justify-center gap-1.5 whitespace-nowrap"
            aria-label="Record new expense"
          >
            <Plus size={15} strokeWidth={2.5} className="shrink-0" />
            <span className="truncate">Record Expense</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className="h-11 px-4 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] active:bg-black/[0.12] border border-black/[0.04] dark:border-white/[0.06] text-[#1C1C1E] dark:text-white text-xs sm:text-sm font-semibold transition-all apple-pressable flex items-center justify-center gap-1.5 whitespace-nowrap"
            aria-label="View expense ledger"
          >
            <span className="truncate">View Ledger</span>
            <ArrowRight size={14} className="text-[#8E8E93] shrink-0" />
          </button>
        </div>

        {/* Clean 3-Metric Executive Footer Strip */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Remaining
            </span>
            <p
              className={`text-base sm:text-lg font-bold mt-0.5 tabular-nums ${
                isOverBudget ? 'text-[#FF3B30]' : 'text-[#34C759]'
              }`}
            >
              {formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)}
            </p>
            <p className="text-[10px] text-[#8E8E93] mt-0.5 hidden sm:block">
              {isOverBudget ? 'Exceeded' : `${100 - clampedProgress}% remaining`}
            </p>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Average Cost
            </span>
            <p className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-white mt-0.5 tabular-nums">
              {formatCurrency(currentMonthStats.averageExpense, settings.currencySymbol)}
            </p>
            <p className="text-[10px] text-[#8E8E93] mt-0.5 hidden sm:block">Per purchase</p>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Lead Category
            </span>
            <p className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-white mt-0.5 truncate">
              {currentMonthStats.highestCategory
                ? currentMonthStats.highestCategory.category.name
                : '—'}
            </p>
            <p className="text-[10px] text-[#8E8E93] mt-0.5 truncate hidden sm:block">
              {currentMonthStats.highestCategory
                ? `${currentMonthStats.highestCategory.percentage}% of total`
                : 'No data'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. EXECUTIVE SNAPSHOT: Top Categories & Recent Activity
          Two clean cards side-by-side on desktop, stacked on mobile.
          Zero redundant charts — Deep dives live in Insights/Expenses.
          ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A: Top Spending Categories Snapshot */}
        <section className="apple-card p-5 sm:p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#214B30]/10 dark:bg-emerald-500/15 text-[#214B30] dark:text-[#34C759] flex items-center justify-center">
                  <PieChart size={14} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">
                  Top Categories
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('insights')}
                className="text-xs font-semibold text-[#214B30] dark:text-[#34C759] hover:underline flex items-center gap-0.5 apple-pressable"
              >
                <span>Insights</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {topCategories.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center">
                <p className="text-xs text-[#8E8E93]">No category spending recorded yet</p>
                <p className="text-[11px] text-[#8E8E93]/70 mt-1 max-w-xs">
                  Your top expense distribution will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06] mt-1">
                {topCategories.map((item) => (
                  <div key={item.category.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryIcon category={item.category} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-[#1C1C1E] dark:text-white truncate">
                          {item.category.name}
                        </p>
                        <p className="text-[10px] text-[#8E8E93]">
                          {item.percentage}% of spending
                        </p>
                      </div>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-white tabular-nums shrink-0">
                      {formatCurrency(item.amount, settings.currencySymbol)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {topCategories.length > 0 && (
            <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] mt-2">
              <button
                onClick={() => setActiveTab('insights')}
                className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1 apple-pressable"
              >
                <span>Explore Full Category Breakdown</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </section>

        {/* Card B: Recent Activity Snapshot */}
        <section className="apple-card p-5 sm:p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#214B30]/10 dark:bg-emerald-500/15 text-[#214B30] dark:text-[#34C759] flex items-center justify-center">
                  <Receipt size={14} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">
                  Recent Activity
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-semibold text-[#214B30] dark:text-[#34C759] hover:underline flex items-center gap-0.5 apple-pressable"
              >
                <span>Ledger ({monthExpenses.length})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center">
                <p className="text-xs text-[#8E8E93]">No transactions recorded yet</p>
                <p className="text-[11px] text-[#8E8E93]/70 mt-1 max-w-xs">
                  Recorded transactions will show here for instant review.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06] mt-1">
                {recentExpenses.map((exp) => {
                  const cat = categoryMap.get(exp.categoryId);
                  return (
                    <div key={exp.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CategoryIcon category={cat} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[#1C1C1E] dark:text-white truncate">
                            {cat?.name || exp.categoryId}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93]">
                            <span>{formatDateDisplay(exp.date)}</span>
                            {exp.paymentMethod && (
                              <>
                                <span>•</span>
                                <span>{exp.paymentMethod}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-white tabular-nums shrink-0">
                        {formatCurrency(exp.amount, settings.currencySymbol)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {recentExpenses.length > 0 && (
            <div className="pt-3 border-t border-black/[0.04] dark:divide-white/[0.06] mt-2">
              <button
                onClick={() => setActiveTab('transactions')}
                className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1 apple-pressable"
              >
                <span>View All Transactions</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
