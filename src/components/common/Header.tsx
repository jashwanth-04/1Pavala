import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppLogo } from './AppLogo';
import {
  Plus,
  Calendar,
  ChevronDown,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';
import { getMonthLabel, getShortMonthLabel, getPreviousMonthKey } from '../../utils/formatters';

export const Header: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    currentMonthKey,
    openAddExpenseModal,
    expenses,
    toggleSidebar,
    theme,
    toggleTheme,
  } = useApp();

  // Build list of months available (from expenses + current + previous)
  const availableMonths = React.useMemo(() => {
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

  return (
    <header className="sticky top-0 z-40 apple-glass border-b border-black/[0.06] dark:border-white/[0.08] transition-all w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3">

          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Hamburger / Menu toggle */}
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.14] text-[#1C1C1E] dark:text-white transition-colors apple-pressable shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu size={17} />
            </button>

            {/* Brand logo */}
            <button
              onClick={() => {}}
              className="flex items-center gap-2 group text-left apple-pressable focus:outline-hidden shrink-0"
              aria-label="1Pavala"
            >
              <AppLogo size="sm" showText={false} className="transition-transform group-hover:scale-[1.03]" />
              <span className="text-[17px] sm:text-lg font-bold tracking-tight text-[#1C1C1E] dark:text-white hidden md:block">
                1Pavala
              </span>
            </button>
          </div>

          {/* RIGHT: Month picker + Theme toggle + Add Expense button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
            {/* Sleek Apple-style Month Capsule (Compact on mobile, expanded on desktop) */}
            <div className="relative inline-flex items-center">
              <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-black/[0.03] dark:bg-white/[0.08] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] border border-black/[0.05] dark:border-white/[0.06] text-[#1C1C1E] dark:text-white rounded-full text-xs font-semibold transition-colors pointer-events-none shadow-2xs">
                <Calendar size={12} className="text-[#8E8E93] shrink-0" />
                {/* On mobile: compact 'Nov 2026' */}
                <span className="sm:hidden whitespace-nowrap">
                  {getShortMonthLabel(selectedMonth)}
                </span>
                {/* On larger screens: 'November 2026 • Current' */}
                <span className="hidden sm:inline whitespace-nowrap">
                  {getMonthLabel(selectedMonth)} {selectedMonth === currentMonthKey ? '• Current' : ''}
                </span>
                <ChevronDown size={11} className="text-[#8E8E93] shrink-0 ml-0.5" />
              </div>

              {/* Invisible native select overlays to trigger the native wheel/modal picker */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Select Month"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {getMonthLabel(m)} {m === currentMonthKey ? '• Current' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] border border-black/[0.04] dark:border-white/[0.06] text-[#1C1C1E] dark:text-white transition-colors apple-pressable shrink-0"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Add Expense CTA button - 1Pavala Sovereign Green & Silver */}
            <button
              onClick={openAddExpenseModal}
              className="flex items-center justify-center gap-1 bg-[#214B30] hover:bg-[#1A3B26] active:bg-[#132B1C] text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-[0_2px_10px_rgba(33,75,48,0.30)] dark:shadow-[0_2px_12px_rgba(33,75,48,0.40)] border border-white/10 transition-all apple-pressable shrink-0"
              aria-label="Add new expense"
            >
              <Plus size={14} strokeWidth={2.4} className="shrink-0" />
              <span>Add</span>
              <span className="hidden sm:inline">Expense</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
