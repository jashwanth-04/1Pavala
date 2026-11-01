import React from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  formatCurrency,
  formatDateDisplay,
  getMonthLabel,
  getPreviousMonthKey,
} from '../../utils/formatters';
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Award,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  FileSpreadsheet,
  Printer,
  ShoppingBag,
} from 'lucide-react';

export const MonthlySummaryView: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    currentMonthStats,
    settings,
    expenses,
    categoryMap,
    exportData,
  } = useApp();

  const prevMonthKey = getPreviousMonthKey(selectedMonth);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));

  // Category breakdown ranked
  const categoryRanking = React.useMemo(() => {
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    monthExpenses.forEach((exp) => {
      totals[exp.categoryId] = (totals[exp.categoryId] || 0) + exp.amount;
      counts[exp.categoryId] = (counts[exp.categoryId] || 0) + 1;
    });

    const total = currentMonthStats.totalSpent;

    return Object.entries(totals)
      .map(([catId, amount]) => {
        const cat = categoryMap.get(catId) || {
          id: catId,
          name: catId,
          icon: 'MoreHorizontal',
          color: '#64748b',
          bgLight: '#f1f5f9',
        };
        const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;
        return {
          category: cat,
          amount,
          count: counts[catId] || 0,
          percentage,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, currentMonthStats.totalSpent, categoryMap]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Print/Export action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Monthly Financial Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comprehensive audit and statistical breakdown for{' '}
            <span className="font-semibold text-slate-700">{getMonthLabel(selectedMonth)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => exportData('csv')}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 shadow-xs transition-colors"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Spending
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(currentMonthStats.totalSpent, settings.currencySymbol)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            {currentMonthStats.monthOverMonthDiff > 0 ? (
              <span className="text-red-600 font-semibold flex items-center">
                <ArrowUpRight size={14} /> +
                {formatCurrency(currentMonthStats.monthOverMonthDiff, settings.currencySymbol)}
              </span>
            ) : currentMonthStats.monthOverMonthDiff < 0 ? (
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowDownRight size={14} />
                {formatCurrency(currentMonthStats.monthOverMonthDiff, settings.currencySymbol)}
              </span>
            ) : (
              <span className="text-slate-400">Same as last mo</span>
            )}
            <span className="text-slate-400 text-[10px]">vs prev mo</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Transactions
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {currentMonthStats.expenseCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Avg{' '}
            <span className="font-bold text-slate-700">
              {formatCurrency(currentMonthStats.averageExpense, settings.currencySymbol)}
            </span>{' '}
            / expense
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Budget vs Actual
          </p>
          <p
            className={`text-2xl font-black mt-1 ${
              currentMonthStats.remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {currentMonthStats.budgetPercentage}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {currentMonthStats.remainingBudget >= 0
              ? `${formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)} under limit`
              : `${formatCurrency(Math.abs(currentMonthStats.remainingBudget), settings.currencySymbol)} over limit`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Lead Category
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1 truncate">
            {currentMonthStats.highestCategory
              ? currentMonthStats.highestCategory.category.name
              : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {currentMonthStats.highestCategory
              ? `${formatCurrency(currentMonthStats.highestCategory.amount, settings.currencySymbol)} (${currentMonthStats.highestCategory.percentage}%)`
              : 'No expenses'}
          </p>
        </div>
      </div>

      {/* Highlights: Largest Expense & Month-Over-Month Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Largest Single Expense Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Largest Single Purchase
              </h3>
              <p className="text-xs text-slate-500">Highest individual expense this month</p>
            </div>
          </div>

          {currentMonthStats.largestExpense ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CategoryIcon
                  category={categoryMap.get(currentMonthStats.largestExpense.categoryId)}
                  size="lg"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {categoryMap.get(currentMonthStats.largestExpense.categoryId)?.name ||
                      currentMonthStats.largestExpense.categoryId}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDateDisplay(currentMonthStats.largestExpense.date)}
                    {currentMonthStats.largestExpense.paymentMethod &&
                      ` • ${currentMonthStats.largestExpense.paymentMethod}`}
                  </p>
                  {currentMonthStats.largestExpense.note && (
                    <p className="text-xs text-slate-400 italic mt-0.5">
                      "{currentMonthStats.largestExpense.note}"
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900">
                  {formatCurrency(
                    currentMonthStats.largestExpense.amount,
                    settings.currencySymbol
                  )}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Single item</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              No transactions recorded for this month.
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average transaction size:</span>
            <span className="font-bold text-slate-800">
              {formatCurrency(currentMonthStats.averageExpense, settings.currencySymbol)}
            </span>
          </div>
        </div>

        {/* Previous Month Delta Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Month-over-Month Delta
              </h3>
              <p className="text-xs text-slate-500">
                Direct variance vs {getMonthLabel(prevMonthKey)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs sm:text-sm">
              <span className="text-slate-600 font-medium">Previous Month Total:</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(currentMonthStats.prevMonthSpent, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs sm:text-sm">
              <span className="text-slate-600 font-medium">Current Month Total:</span>
              <span className="font-extrabold text-slate-900">
                {formatCurrency(currentMonthStats.totalSpent, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white">
              <span className="text-slate-700">Net Difference:</span>
              <span
                className={
                  currentMonthStats.monthOverMonthDiff > 0
                    ? 'text-red-600'
                    : currentMonthStats.monthOverMonthDiff < 0
                    ? 'text-emerald-600'
                    : 'text-slate-600'
                }
              >
                {currentMonthStats.monthOverMonthDiff > 0 ? '+' : ''}
                {formatCurrency(
                  currentMonthStats.monthOverMonthDiff,
                  settings.currencySymbol
                )}{' '}
                {currentMonthStats.monthOverMonthPercentChange !== null &&
                  `(${currentMonthStats.monthOverMonthPercentChange > 0 ? '+' : ''}${
                    currentMonthStats.monthOverMonthPercentChange
                  }%)`}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 text-[11px] text-slate-400">
            Calculated automatically from stored transaction records.
          </div>
        </div>
      </div>

      {/* Category breakdown table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
        <h3 className="text-base font-bold text-slate-900 mb-1">Category Expenditure Audit</h3>
        <p className="text-xs text-slate-500 mb-4">
          All categories sorted by highest expenditure
        </p>

        {categoryRanking.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-6 text-center">
            No category expenditures recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-center">Count</th>
                  <th className="pb-3 font-semibold text-right">Share</th>
                  <th className="pb-3 font-semibold text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryRanking.map((item) => (
                  <tr key={item.category.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CategoryIcon category={item.category} size="sm" />
                        <span className="font-bold text-slate-900">{item.category.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-slate-500 font-medium">
                      {item.count} {item.count === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-semibold text-slate-600">{item.percentage}%</span>
                    </td>
                    <td className="py-3 text-right font-black text-slate-900">
                      {formatCurrency(item.amount, settings.currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
