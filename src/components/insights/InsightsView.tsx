import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { SpendingTrendChart } from '../charts/SpendingTrendChart';
import { MonthComparisonChart } from '../charts/MonthComparisonChart';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, getMonthLabel, getPreviousMonthKey } from '../../utils/formatters';
import {
  PieChart,
  TrendingUp,
  Scale,
  CreditCard,
  Calendar,
  Layers,
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const {
    expenses,
    categories,
    categoryMap,
    selectedMonth,
    settings,
    currentMonthStats,
  } = useApp();

  const prevMonthKey = getPreviousMonthKey(selectedMonth);

  const monthExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Category breakdown
  const categorySegments = useMemo(() => {
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

  // Payment Method Breakdown
  const paymentMethodStats = useMemo(() => {
    const totals: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      const method = exp.paymentMethod || 'Other';
      totals[method] = (totals[method] || 0) + exp.amount;
    });

    const total = currentMonthStats.totalSpent;
    return Object.entries(totals)
      .map(([method, amount]) => ({
        method,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, currentMonthStats.totalSpent]);

  // Day of Week Distribution
  const dayOfWeekStats = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totals = [0, 0, 0, 0, 0, 0, 0];

    monthExpenses.forEach((exp) => {
      const d = new Date(exp.date);
      const dayIdx = d.getDay();
      totals[dayIdx] += exp.amount;
    });

    const maxDayAmount = Math.max(...totals, 100);

    return dayNames.map((name, idx) => ({
      name,
      amount: totals[idx],
      percentOfMax: (totals[idx] / maxDayAmount) * 100,
      isWeekend: idx === 0 || idx === 6,
    }));
  }, [monthExpenses]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Financial Insights
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Visualize patterns, category proportions, and month-over-month performance for{' '}
          <span className="font-semibold text-slate-700">{getMonthLabel(selectedMonth)}</span>
        </p>
      </div>

      {/* Grid 1: Category Breakdown & Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Category Spending Distribution
              </h3>
              <p className="text-xs text-slate-500">Relative share per expense category</p>
            </div>
          </div>

          <CategoryDonutChart
            segments={categorySegments}
            totalSpent={currentMonthStats.totalSpent}
            currencySymbol={settings.currencySymbol}
          />
        </div>

        {/* Daily Spending Trend */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Daily Trend &amp; Rhythm
              </h3>
              <p className="text-xs text-slate-500">Day-by-day expenditure flow</p>
            </div>
          </div>

          <SpendingTrendChart
            expenses={expenses}
            monthKey={selectedMonth}
            currencySymbol={settings.currencySymbol}
          />
        </div>
      </div>

      {/* Grid 2: Month-over-Month Comparison */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Scale size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Month-over-Month Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Comparing {getMonthLabel(selectedMonth)} with {getMonthLabel(prevMonthKey)}
            </p>
          </div>
        </div>

        <MonthComparisonChart
          currentMonthKey={selectedMonth}
          previousMonthKey={prevMonthKey}
          expenses={expenses}
          categories={categories}
          currencySymbol={settings.currencySymbol}
        />
      </div>

      {/* Grid 3: Payment Methods & Day of Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Payment Channel Breakdown
              </h3>
              <p className="text-xs text-slate-500">UPI, Cards, and Cash distribution</p>
            </div>
          </div>

          {paymentMethodStats.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No payment data recorded</p>
          ) : (
            <div className="space-y-3">
              {paymentMethodStats.map((item) => (
                <div key={item.method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.method}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">{item.percentage}%</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(item.amount, settings.currencySymbol)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Day of Week */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Spending by Day of Week
              </h3>
              <p className="text-xs text-slate-500">Analyze weekday vs weekend spending</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4">
            {dayOfWeekStats.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <div className="h-28 w-full flex items-end justify-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      item.isWeekend ? 'bg-amber-500' : 'bg-brand-500'
                    }`}
                    style={{
                      height: `${Math.max(8, item.percentOfMax)}%`,
                    }}
                    title={`${item.name}: ${formatCurrency(item.amount, settings.currencySymbol)}`}
                  />
                </div>
                <span
                  className={`text-xs mt-2 font-semibold ${
                    item.isWeekend ? 'text-amber-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formatCurrency(item.amount, settings.currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
