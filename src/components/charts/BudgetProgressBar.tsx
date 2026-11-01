import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BudgetProgressBarProps {
  budget: number;
  spent: number;
  currencySymbol: string;
  thresholds?: [number, number, number];
  showWarningBanner?: boolean;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  budget,
  spent,
  currencySymbol,
  thresholds = [75, 90, 100],
  showWarningBanner = true,
}) => {
  const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  // Threshold status
  const [t1, t2, t3] = thresholds;
  let statusColor = 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/20';
  let barColor = 'bg-[#34C759]';
  let statusText = 'On Track';
  let icon = <CheckCircle2 size={15} className="text-[#34C759] shrink-0" />;

  if (percentage >= t3) {
    statusColor = 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20';
    barColor = 'bg-[#FF3B30]';
    statusText = isOverBudget ? 'Budget Exceeded' : 'Limit Reached (100%)';
    icon = <AlertCircle size={15} className="text-[#FF3B30] shrink-0" />;
  } else if (percentage >= t2) {
    statusColor = 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/20';
    barColor = 'bg-[#FF9500]';
    statusText = `Warning (${percentage}%)`;
    icon = <AlertTriangle size={15} className="text-[#FF9500] shrink-0" />;
  } else if (percentage >= t1) {
    statusColor = 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/20';
    barColor = 'bg-[#FF9500]';
    statusText = `Caution (${percentage}%)`;
    icon = <AlertTriangle size={15} className="text-[#FF9500] shrink-0" />;
  }

  // Clamped bar width for UI
  const displayWidth = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-3.5">
      {/* Metrics Row */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
            Budget Utilization
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold text-[#1C1C1E] dark:text-white tabular-nums tracking-tight">
              {percentage}%
            </span>
            <span className="text-xs text-[#8E8E93] font-medium">
              of {formatCurrency(budget, currencySymbol)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
            {isOverBudget ? 'Over Budget' : 'Remaining'}
          </span>
          <p
            className={`text-xl font-bold mt-0.5 tabular-nums tracking-tight ${
              isOverBudget ? 'text-[#FF3B30]' : 'text-[#34C759]'
            }`}
          >
            {formatCurrency(Math.abs(remaining), currencySymbol)}
          </p>
        </div>
      </div>

      {/* Progress Track (Apple HIG continuous rounded pill) */}
      <div className="relative">
        <div className="h-2.5 w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${barColor}`}
            style={{ width: `${displayWidth}%` }}
          />
        </div>

        {/* Subtle threshold tick markers */}
        <div className="relative w-full h-2.5 -mt-2.5 pointer-events-none">
          <span
            className="absolute top-0 bottom-0 w-[1.5px] bg-black/15 dark:bg-white/25 z-10"
            style={{ left: `${t1}%` }}
            title={`Threshold 1: ${t1}%`}
          />
          <span
            className="absolute top-0 bottom-0 w-[1.5px] bg-black/25 dark:bg-white/40 z-10"
            style={{ left: `${t2}%` }}
            title={`Threshold 2: ${t2}%`}
          />
        </div>
      </div>

      {/* Threshold Labels */}
      <div className="flex justify-between text-[11px] text-[#8E8E93] font-medium px-0.5">
        <span>0%</span>
        <span>{t1}% caution</span>
        <span>{t2}% warning</span>
        <span>100% max</span>
      </div>

      {/* Warning Banner when >= 75% */}
      {showWarningBanner && percentage >= t1 && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs leading-relaxed ${statusColor}`}
        >
          {icon}
          <div>
            <p className="font-semibold">{statusText}</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              {percentage >= 100
                ? `You have exceeded your monthly limit by ${formatCurrency(
                    Math.abs(remaining),
                    currencySymbol
                  )}. You can continue recording transactions freely.`
                : `You have spent ${percentage}% of your ${formatCurrency(
                    budget,
                    currencySymbol
                  )} ceiling.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
