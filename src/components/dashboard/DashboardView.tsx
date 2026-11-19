import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, formatDateDisplay, getMonthLabel, getShortMonthLabel } from '../../utils/formatters';
import { aggregateCategoryTotals } from '../../services/finance';
import {
  Plus,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Calendar,
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
    availableMonths,
    currentMonthKey,
    settings,
    openAddExpenseModal,
    setActiveTab,
    expenses,
    categoryMap,
  } = useApp();

  const monthExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(selectedMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedMonth]);

  const recentExpenses = useMemo(() => monthExpenses.slice(0, 4), [monthExpenses]);

  const topCategories = useMemo(() => {
    return aggregateCategoryTotals(monthExpenses, categoryMap, currentMonthStats.totalSpent).slice(0, 4);
  }, [monthExpenses, currentMonthStats.totalSpent, categoryMap]);

  const isOverBudget = currentMonthStats.remainingBudget < 0;
  const budgetPercentage = currentMonthStats.budget > 0
    ? Math.round((currentMonthStats.totalSpent / currentMonthStats.budget) * 100)
    : 0;
  const clampedProgress = Math.min(100, Math.max(0, budgetPercentage));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <section className="apple-card-elevated p-5 sm:p-7 bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08]">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div className="relative inline-flex items-center">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.14] border border-black/[0.05] dark:border-white/[0.08] text-[#1C1C1E] dark:text-white transition-all duration-150 cursor-pointer pointer-events-none select-none shadow-2xs">
              <Calendar size={11} className="text-[#214B30] dark:text-[#34C759] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                <span className="sm:hidden">{getShortMonthLabel(selectedMonth)}</span>
                <span className="hidden sm:inline">{getMonthLabel(selectedMonth)}</span>
              </span>
              <ChevronDown size={10} className="text-[#8E8E93] shrink-0 ml-0.5" />
            </div>

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

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-black/[0.03] dark:bg-white/[0.06] text-[#8E8E93] dark:text-[#AEAEB2] whitespace-nowrap">
              <span className="tabular-nums">{currentMonthStats.expenseCount}</span>
              <span>expenses</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${
                isOverBudget
                  ? 'bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/20'
                  : 'bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/20'
              }`}
            >
              {isOverBudget ? (
                <>
                  <AlertCircle size={10} className="shrink-0" />
                  <span className="tabular-nums">
                    {formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)} over
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={10} className="shrink-0" />
                  <span className="tabular-nums">
                    {formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)} left
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4 sm:mb-5">
          <div className="min-w-0">
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1C1E] dark:text-white tabular-nums leading-none">
              {formatCurrency(currentMonthStats.totalSpent, settings.currencySymbol)}
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-1.5 text-xs sm:text-sm text-[#8E8E93]">
              <span>
                Target limit: <strong className="font-semibold text-[#1C1C1E] dark:text-white tabular-nums">{formatCurrency(currentMonthStats.budget, settings.currencySymbol)}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 mb-5 sm:mb-6">
          <div className="h-2 w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget ? 'bg-[#FF3B30]' : clampedProgress >= 90 ? 'bg-[#FF9500]' : 'bg-[#34C759]'
              }`}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] sm:text-xs text-[#8E8E93] tabular-nums font-medium">
            <span>{budgetPercentage}% consumed</span>
            <span>
              {isOverBudget
                ? `${formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)} over limit`
                : `${formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)} available`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={openAddExpenseModal}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#214B30] hover:bg-[#1A3B26] active:bg-[#132B1C] text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-4 rounded-full shadow-[0_2px_12px_rgba(33,75,48,0.30)] dark:shadow-[0_2px_14px_rgba(33,75,48,0.45)] border border-white/10 apple-pressable"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Record Expense</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] text-[#1C1C1E] dark:text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-4 rounded-full border border-black/[0.05] dark:border-white/[0.08] apple-pressable"
          >
            <span>View Ledger</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-black/[0.04] dark:border-white/[0.06] text-left">
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
              {isOverBudget ? 'Overspend' : 'Remaining'}
            </div>
            <div
              className={`text-sm sm:text-base font-bold mt-0.5 tabular-nums ${
                isOverBudget ? 'text-[#FF3B30]' : 'text-[#34C759]'
              }`}
            >
              {formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)}
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
              Average Cost
            </div>
            <div className="text-sm sm:text-base font-bold mt-0.5 text-[#1C1C1E] dark:text-white tabular-nums">
              {formatCurrency(currentMonthStats.averageExpense, settings.currencySymbol)}
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
              Lead Category
            </div>
            <div className="text-sm sm:text-base font-bold mt-0.5 text-[#1C1C1E] dark:text-white truncate">
              {currentMonthStats.highestCategory?.category.name || '—'}
            </div>
          </div>
        </div>
      </section>

      <section className="apple-card p-4 sm:p-6 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#34C759]/10 text-[#34C759] flex items-center justify-center shrink-0">
              <PieChart size={13} />
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
          <div className="py-6 text-center text-xs text-[#8E8E93]">
            No category spending recorded yet
            <p className="text-[11px] text-[#AEAEB2] mt-0.5">
              Your top expense distribution will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {topCategories.map(({ category, amount, percentage }) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CategoryIcon category={category} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#1C1C1E] dark:text-white truncate">
                      {category.name}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#8E8E93]">
                      {percentage}% of spending
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-white tabular-nums">
                    {formatCurrency(amount, settings.currencySymbol)}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setActiveTab('insights')}
              className="w-full mt-2 py-2 text-center text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore Full Category Breakdown</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </section>

      <section className="apple-card p-4 sm:p-6 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#214B30]/10 dark:bg-[#34C759]/15 text-[#214B30] dark:text-[#34C759] flex items-center justify-center shrink-0">
              <Receipt size={13} />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              Recent Activity
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-[#214B30] dark:text-[#34C759] hover:underline flex items-center gap-0.5 apple-pressable"
          >
            <span>Ledger ({currentMonthStats.expenseCount})</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#8E8E93]">
            No expenses recorded for this month
            <p className="text-[11px] text-[#AEAEB2] mt-0.5">
              Tap &quot;Record Expense&quot; above to add your first transaction.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
            {recentExpenses.map((exp) => {
              const cat = categoryMap.get(exp.categoryId);
              return (
                <div
                  key={exp.id}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CategoryIcon category={cat} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#1C1C1E] dark:text-white truncate">
                        {exp.note?.trim() || cat?.name || 'Expense'}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-[#8E8E93]">
                        {formatDateDisplay(exp.date)} {exp.paymentMethod ? `• ${exp.paymentMethod}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-white tabular-nums">
                      {formatCurrency(exp.amount, settings.currencySymbol)}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="pt-3">
              <button
                onClick={() => setActiveTab('transactions')}
                className="w-full py-2 text-center text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                <span>View All Transactions</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
