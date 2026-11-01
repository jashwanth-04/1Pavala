import React, { useState } from 'react';
import { Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface DonutSegment {
  category: Category;
  amount: number;
  percentage: number;
}

interface CategoryDonutChartProps {
  segments: DonutSegment[];
  totalSpent: number;
  currencySymbol: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  segments,
  totalSpent,
  currencySymbol,
  onSelectCategory,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (segments.length === 0 || totalSpent === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <span className="text-slate-400 text-2xl font-bold">₹</span>
        </div>
        <p className="text-sm font-medium text-slate-600">No expenses recorded for this month</p>
        <p className="text-xs text-slate-400 mt-1">Add your first expense to see your spending breakdown</p>
      </div>
    );
  }

  // SVG Donut calculation
  const size = 220;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      {/* SVG Donut */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {segments.map((segment, index) => {
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += segment.percentage;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={segment.category.id}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={segment.category.color}
                strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectCategory && onSelectCategory(segment.category.id)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {hoveredIndex !== null ? (
            <>
              <span className="text-xs font-semibold text-slate-500 truncate max-w-[110px]">
                {segments[hoveredIndex].category.name}
              </span>
              <span className="text-lg font-bold text-slate-900 leading-tight">
                {formatCurrency(segments[hoveredIndex].amount, currencySymbol)}
              </span>
              <span className="text-xs font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full mt-0.5">
                {segments[hoveredIndex].percentage}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Total</span>
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(totalSpent, currencySymbol)}
              </span>
              <span className="text-[11px] text-slate-400">{segments.length} categories</span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
        {segments.map((segment, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={segment.category.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                isHovered ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectCategory && onSelectCategory(segment.category.id)}
            >
              <div className="flex items-center gap-2.5 truncate mr-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: segment.category.color }}
                />
                <span className="truncate text-slate-800">{segment.category.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 font-medium text-xs">{segment.percentage}%</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(segment.amount, currencySymbol)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
