import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Calendar,
  ChevronDown,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';
import { getMonthLabel, getPreviousMonthKey } from '../../utils/formatters';

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
    <header className="sticky top-0 z-40 apple-glass border-b border-black/[0.06] dark:border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">

          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-2.5">
            {/* Hamburger / Menu toggle */}
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.14] text-[#1C1C1E] dark:text-white transition-colors apple-pressable"
              aria-label="Toggle navigation menu"
            >
              <Menu size={17} />
            </button>

            {/* Brand logo */}
            <button
              onClick={() => {
                /* navigate to dashboard is handled by sidebar nav; logo just acts as visual anchor */
              }}
              className="flex items-center gap-2.5 group text-left apple-pressable focus:outline-hidden"
              aria-label="1Pavala"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs font-semibold tracking-tight text-sm sm:text-base transition-transform group-hover:scale-[1.03]">
                <span>1P</span>
              </div>
              <span className="text-[17px] sm:text-lg font-bold tracking-tight text-[#1C1C1E] dark:text-white hidden xs:block">
                1Pavala
              </span>
            </button>
          </div>

          {/* RIGHT: Month picker + Theme toggle + Add button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Month Picker Pill */}
            <div className="relative flex items-center">
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] active:bg-black/[0.1] text-[#1C1C1E] dark:text-white text-xs font-semibold py-1.5 sm:py-2 pl-7 pr-7 rounded-full border-none cursor-pointer focus:outline-hidden transition-colors"
                  title="Select Month"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {getMonthLabel(m)} {m === currentMonthKey ? '• Current' : ''}
                    </option>
                  ))}
                </select>
                <Calendar
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none"
                />
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none"
                />
              </div>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.14] text-[#1C1C1E] dark:text-white transition-colors apple-pressable"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Add Expense CTA */}
            <button
              onClick={openAddExpenseModal}
              className="flex items-center gap-1.5 bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0062C4] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-[0_2px_8px_rgba(0,122,255,0.25)] transition-all apple-pressable"
            >
              <Plus size={15} strokeWidth={2.4} />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
