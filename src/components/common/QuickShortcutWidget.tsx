import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency, getTodayDateString } from '../../utils/formatters';

interface QuickShortcutWidgetProps {
  className?: string;
  onClick?: () => void;
}

/**
 * QuickShortcutWidget
 * Apple-grade stadium/capsule widget with an oval-capped rectangular silhouette.
 * Thin profile featuring an elevated '+' action button on the left with live
 * glanceable financial pulse intelligence in the center and quick action affordances.
 */
export const QuickShortcutWidget: React.FC<QuickShortcutWidgetProps> = ({
  className = '',
  onClick,
}) => {
  const { openAddExpenseModal, expenses, currentMonthStats, settings } = useApp();

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Compute today's spending metrics
  const todayExpenses = useMemo(() => {
    return expenses.filter((e) => e.date === todayStr);
  }, [expenses, todayStr]);

  const todaySpent = useMemo(() => {
    return todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [todayExpenses]);

  const isOverBudget = currentMonthStats.remainingBudget < 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openAddExpenseModal();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Quick shortcut: Add new expense"
      className={`group w-full max-w-xl mx-auto h-11 sm:h-12 px-2.5 sm:px-3 rounded-full apple-glass border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-2px_rgba(0,0,0,0.45)] hover:border-black/[0.14] dark:hover:border-white/[0.2] hover:shadow-[0_6px_28px_-2px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_32px_-2px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2.5 cursor-pointer apple-pressable select-none transition-all duration-150 ${className}`}
    >
      {/* LEFT: Elevated Circular Plus Button */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#214B30] to-[#153421] dark:from-[#34C759] dark:to-[#248A3D] text-white dark:text-[#0A170F] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(33,75,48,0.30)] dark:shadow-[0_2px_10px_rgba(52,199,89,0.35)] group-hover:scale-105 active:scale-90 transition-transform duration-150"
          title="Add Expense"
        >
          <Plus size={15} strokeWidth={2.8} className="shrink-0" />
        </div>

        {/* Hairline Divider */}
        <div className="h-4.5 w-px bg-black/[0.08] dark:bg-white/[0.1] shrink-0" />

        {/* CENTER: Glanceable Intelligence Text */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xs sm:text-[13px] font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              Add Expense
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-black/20 dark:bg-white/30" />
            <span className="hidden sm:inline text-[11px] font-semibold text-[#8E8E93]">
              Quick Log
            </span>
          </div>

          <div className="text-[10px] sm:text-[11px] text-[#8E8E93] leading-none mt-1 truncate tabular-nums">
            {todayExpenses.length > 0 ? (
              <span>
                Today: <strong className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(todaySpent, settings.currencySymbol)}</strong> ({todayExpenses.length} {todayExpenses.length === 1 ? 'record' : 'records'})
              </span>
            ) : (
              <span>
                Runway: <strong className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(currentMonthStats.remainingBudget, settings.currencySymbol)}</strong> remaining
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Quick Action Cue + Budget Pulse + Keyboard Shortcut */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Budget Health Dot */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-tight border ${
            isOverBudget
              ? 'bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-900/40'
              : 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isOverBudget ? 'bg-[#FF3B30] animate-pulse' : 'bg-[#34C759]'
            }`}
          />
          <span className="tabular-nums">
            {isOverBudget ? 'Over' : `${Math.round(100 - Math.min(100, Math.max(0, (currentMonthStats.totalSpent / (currentMonthStats.budget || 1)) * 100)))}% left`}
          </span>
        </div>

        {/* Keyboard shortcut hint on desktop */}
        <kbd className="hidden md:inline-flex items-center justify-center h-5 px-1.5 rounded-md font-mono text-[9px] font-bold text-slate-500 dark:text-[#8E8E93] bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.05] dark:border-white/[0.08] shadow-2xs">
          N
        </kbd>

        {/* Quick Launch Arrow */}
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#8E8E93] group-hover:text-[#1C1C1E] dark:group-hover:text-white transition-colors">
          <ArrowUpRight size={14} strokeWidth={2.2} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
        </div>
      </div>
    </div>
  );
};
