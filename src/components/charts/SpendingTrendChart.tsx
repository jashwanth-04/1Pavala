import React, { useState } from 'react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SpendingTrendChartProps {
  expenses: Expense[];
  monthKey: string;
  currencySymbol: string;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  expenses,
  monthKey,
  currencySymbol,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ day: number; amount: number; count: number } | null>(null);

  // Determine number of days in the given month
  const [yearStr, monthStr] = (monthKey || '2026-10').split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Aggregate daily expenses
  const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: 0,
    count: 0,
  }));

  expenses.forEach((exp) => {
    if (exp.date.startsWith(monthKey)) {
      const dayNum = parseInt(exp.date.split('-')[2], 10);
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        dailyTotals[dayNum - 1].amount += exp.amount;
        dailyTotals[dayNum - 1].count += 1;
      }
    }
  });

  const maxAmount = Math.max(...dailyTotals.map((d) => d.amount), 500);
  const totalAmount = dailyTotals.reduce((sum, d) => sum + d.amount, 0);
  const avgAmount = Number((totalAmount / daysInMonth).toFixed(2));

  return (
    <div className="w-full flex flex-col">
      {/* Chart header info */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
        <span>Daily Spending Trajectory</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-500 inline-block" />
            <span>Daily Spend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 border-t-2 border-dashed border-amber-400 inline-block" />
            <span>Avg {formatCurrency(avgAmount, currencySymbol)}/day</span>
          </div>
        </div>
      </div>

      {/* Bar area container */}
      <div className="relative h-44 w-full pt-6 pb-6 flex items-end justify-between gap-[2px] sm:gap-1 bg-slate-50/50 rounded-xl px-2 sm:px-3 border border-slate-100">
        {/* Average line indicator */}
        {maxAmount > 0 && avgAmount > 0 && (
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400 pointer-events-none transition-all duration-300 z-10"
            style={{
              bottom: `${Math.min(92, Math.max(15, (avgAmount / maxAmount) * 100))}%`,
            }}
          />
        )}

        {/* Daily bars */}
        {dailyTotals.map((item) => {
          const heightPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
          const isZero = item.amount === 0;

          return (
            <div
              key={item.day}
              className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredDay(item)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                className={`w-full max-w-[14px] rounded-t-sm transition-all duration-200 ${
                  isZero
                    ? 'bg-slate-200/40 h-1'
                    : 'bg-brand-500 group-hover:bg-brand-600 group-hover:brightness-110 shadow-sm'
                }`}
                style={{
                  height: isZero ? '3px' : `${Math.max(6, heightPercent)}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis day indicators */}
      <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-3">
        <span>Day 1</span>
        <span>Day 10</span>
        <span>Day 20</span>
        <span>Day {daysInMonth}</span>
      </div>

      {/* Hover tooltip bar */}
      <div className="h-6 mt-1 flex items-center justify-center">
        {hoveredDay ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs animate-fade-in shadow-md">
            <span className="font-medium text-slate-300">
              {monthStr}/{hoveredDay.day}:
            </span>
            <span className="font-bold text-white">
              {formatCurrency(hoveredDay.amount, currencySymbol)}
            </span>
            <span className="text-[10px] text-slate-400">
              ({hoveredDay.count} {hoveredDay.count === 1 ? 'expense' : 'expenses'})
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Hover over any bar to view day-level details</span>
        )}
      </div>
    </div>
  );
};
