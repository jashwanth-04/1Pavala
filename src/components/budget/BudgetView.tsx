import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BudgetProgressBar } from '../charts/BudgetProgressBar';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, getMonthLabel } from '../../utils/formatters';
import {
  Target,
  Edit3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Save,
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    selectedMonth,
    settings,
    currentMonthStats,
    setBudget,
    budgets,
    categories,
    categoryMap,
    expenses,
  } = useApp();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState(String(currentMonthStats.budget));

  // Determine days remaining in the selected month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const totalDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const currentDay = today.getDate();
  const isSelectedCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const daysRemaining = isSelectedCurrentMonth ? Math.max(1, totalDays - currentDay + 1) : totalDays;

  // Safe daily allowance
  const remainingBudget = currentMonthStats.remainingBudget;
  const safeDailyBudget = remainingBudget > 0 ? Number((remainingBudget / daysRemaining).toFixed(2)) : 0;

  // Category expenses for this month
  const categorySpending = React.useMemo(() => {
    const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
    const totals: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      totals[exp.categoryId] = (totals[exp.categoryId] || 0) + exp.amount;
    });

    const currentBudgetObj = budgets.find((b) => b.month === selectedMonth);
    const catBudgets = currentBudgetObj?.categoryBudgets || {};

    return categories.map((cat) => {
      const spent = totals[cat.id] || 0;
      const budgetCap = catBudgets[cat.id] || 0;
      const percent = budgetCap > 0 ? Math.round((spent / budgetCap) * 100) : null;
      return {
        category: cat,
        spent,
        budgetCap,
        percent,
      };
    }).sort((a, b) => b.spent - a.spent);
  }, [expenses, selectedMonth, categories, budgets]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newBudgetAmount);
    if (!isNaN(parsed) && parsed > 0) {
      setBudget(selectedMonth, parsed);
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Monthly Budget Plan
          </h2>
        </div>

        <div className="shrink-0">
          {!isEditingBudget ? (
            <button
              onClick={() => {
                setNewBudgetAmount(String(currentMonthStats.budget));
                setIsEditingBudget(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-brand-600/25 transition-all whitespace-nowrap"
            >
              <Edit3 size={14} />
              <span>Adjust Budget Limit</span>
            </button>
          ) : (
            <form onSubmit={handleSaveBudget} className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs sm:text-sm">
                  {settings.currencySymbol}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  placeholder="10000"
                  className="w-24 sm:w-36 pl-6 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-white dark:bg-[#2C2C2E] border border-brand-500 rounded-xl text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Save size={13} />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBudget(false)}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.12] text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Budget Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
        <BudgetProgressBar
          budget={currentMonthStats.budget}
          spent={currentMonthStats.totalSpent}
          currencySymbol={settings.currencySymbol}
          thresholds={settings.thresholds}
          showWarningBanner={true}
        />

        {/* Pacing Advice Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-700 shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Days Remaining</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSelectedCurrentMonth ? `Until end of ${getMonthLabel(selectedMonth).split(' ')[0]}` : 'Past month cycle'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-700 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Daily Safe Allowance</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {formatCurrency(safeDailyBudget, settings.currencySymbol)}
                <span className="text-xs font-normal text-slate-400">/day</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {remainingBudget > 0 ? 'To stay strictly under budget' : 'Budget limit already crossed'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100/70 text-purple-700 shrink-0">
              <TrendingDown size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Average Daily Spend</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {formatCurrency(
                  Number((currentMonthStats.totalSpent / (isSelectedCurrentMonth ? Math.max(1, currentDay) : totalDays)).toFixed(2)),
                  settings.currencySymbol
                )}
                <span className="text-xs font-normal text-slate-400">/day</span>
              </p>
              <p className="text-[11px] text-slate-400">Current actual expenditure rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Guide */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Budget Alert Threshold System
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-yellow-200/60 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-yellow-800">
              <AlertTriangle size={15} />
              <span>75% Soft Alert</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px]">
              Triggered when you cross three quarters of your monthly limit ({formatCurrency(Math.round(currentMonthStats.budget * 0.75), settings.currencySymbol)}).
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200/60 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertTriangle size={15} />
              <span>90% Critical Warning</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px]">
              High caution threshold ({formatCurrency(Math.round(currentMonthStats.budget * 0.90), settings.currencySymbol)}). Review non-essential spending.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-red-200/60 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-red-800">
              <AlertTriangle size={15} />
              <span>100% Limit Exhausted</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px]">
              Full budget used. 1Pavala never blocks your expenses—you can continue adding records freely.
            </p>
          </div>
        </div>
      </div>

      {/* Category Spending against budget */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
        <h3 className="text-base font-bold text-slate-900 mb-1">Category Spending Analysis</h3>
        <p className="text-xs text-slate-500 mb-4">
          Breakdown of current month's expenses across categories
        </p>

        <div className="space-y-4">
          {categorySpending.map((item) => {
            if (item.spent === 0) return null;
            const shareOfTotal =
              currentMonthStats.totalSpent > 0
                ? Math.round((item.spent / currentMonthStats.totalSpent) * 100)
                : 0;

            return (
              <div key={item.category.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon category={item.category} size="sm" />
                    <span className="font-bold text-slate-900">{item.category.name}</span>
                    <span className="text-[11px] text-slate-400">({shareOfTotal}% of total spend)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">
                      {formatCurrency(item.spent, settings.currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${shareOfTotal}%`,
                      backgroundColor: item.category.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
