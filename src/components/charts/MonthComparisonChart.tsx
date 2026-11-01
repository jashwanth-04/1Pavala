import React from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency, getMonthLabel } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';

interface MonthComparisonChartProps {
  currentMonthKey: string;
  previousMonthKey: string;
  expenses: Expense[];
  categories: Category[];
  currencySymbol: string;
}

export const MonthComparisonChart: React.FC<MonthComparisonChartProps> = ({
  currentMonthKey,
  previousMonthKey,
  expenses,
  categories,
  currencySymbol,
}) => {
  const currentMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonthKey));
  const prevMonthExpenses = expenses.filter((e) => e.date.startsWith(previousMonthKey));

  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const diff = currentTotal - prevTotal;
  const percentChange = prevTotal > 0 ? Math.round((diff / prevTotal) * 100) : null;

  // Breakdown by category comparison
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const currentCatTotals: Record<string, number> = {};
  const prevCatTotals: Record<string, number> = {};

  currentMonthExpenses.forEach((e) => {
    currentCatTotals[e.categoryId] = (currentCatTotals[e.categoryId] || 0) + e.amount;
  });

  prevMonthExpenses.forEach((e) => {
    prevCatTotals[e.categoryId] = (prevCatTotals[e.categoryId] || 0) + e.amount;
  });

  // Unique categories involved
  const allCatIds = Array.from(
    new Set([...Object.keys(currentCatTotals), ...Object.keys(prevCatTotals)])
  );

  const categoryComparisons = allCatIds.map((catId) => {
    const cur = currentCatTotals[catId] || 0;
    const prev = prevCatTotals[catId] || 0;
    const catDiff = cur - prev;
    const cat = catMap.get(catId) || {
      id: catId,
      name: catId,
      icon: 'MoreHorizontal',
      color: '#64748b',
      bgLight: '#f1f5f9',
    };
    return {
      category: cat,
      current: cur,
      prev: prev,
      diff: catDiff,
      maxVal: Math.max(cur, prev),
    };
  });

  // Sort by highest current spend
  categoryComparisons.sort((a, b) => b.current - a.current);
  const topCategories = categoryComparisons.slice(0, 5);

  const maxCategoryValue = Math.max(
    ...topCategories.map((c) => Math.max(c.current, c.prev)),
    100
  );

  return (
    <div className="space-y-6">
      {/* High-level comparison card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            {getMonthLabel(previousMonthKey)}
          </p>
          <p className="text-lg font-bold text-slate-700 mt-1">
            {formatCurrency(prevTotal, currencySymbol)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {prevMonthExpenses.length} transactions
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
          <p className="text-xs text-brand-600 font-semibold">
            {getMonthLabel(currentMonthKey)} (Current)
          </p>
          <p className="text-lg font-extrabold text-slate-900 mt-1">
            {formatCurrency(currentTotal, currencySymbol)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {currentMonthExpenses.length} transactions
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 flex flex-col justify-center">
          <p className="text-xs text-slate-500 font-medium">Spending Difference</p>
          <div className="flex items-center gap-1.5 mt-1">
            {diff > 0 ? (
              <span className="flex items-center text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">
                <ArrowUpRight size={16} className="mr-0.5" />
                +{formatCurrency(diff, currencySymbol)} {percentChange !== null && `(${percentChange}%)`}
              </span>
            ) : diff < 0 ? (
              <span className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                <ArrowDownRight size={16} className="mr-0.5" />
                {formatCurrency(diff, currencySymbol)} {percentChange !== null && `(${percentChange}%)`}
              </span>
            ) : (
              <span className="flex items-center text-sm font-semibold text-slate-500">
                <Minus size={16} className="mr-0.5" /> No difference
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {diff > 0 ? 'Spending increased vs last month' : diff < 0 ? 'Spending saved vs last month' : 'Equal spending'}
          </p>
        </div>
      </div>

      {/* Top categories side-by-side bars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-800">Top Categories Comparison</h4>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
              <span>Previous</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
              <span>Current</span>
            </div>
          </div>
        </div>

        {topCategories.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            No comparison data available for these months.
          </p>
        ) : (
          <div className="space-y-4">
            {topCategories.map((item) => {
              const currentPercent = (item.current / maxCategoryValue) * 100;
              const prevPercent = (item.prev / maxCategoryValue) * 100;

              return (
                <div key={item.category.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={item.category} size="sm" />
                      <span className="font-semibold text-slate-800">{item.category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        prev: {formatCurrency(item.prev, currencySymbol)}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(item.current, currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Dual comparative bar */}
                  <div className="space-y-1">
                    {/* Previous month bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-300 rounded-full transition-all duration-500"
                        style={{ width: `${prevPercent}%` }}
                      />
                    </div>
                    {/* Current month bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentPercent}%` }}
                      />
                    </div>
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
