import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  CalendarDays,
  Settings,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // All 6 tabs: Symbol on top, label below
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard',    label: 'Overview',  icon: <LayoutDashboard size={19} /> },
    { id: 'transactions', label: 'Expenses',  icon: <ReceiptText    size={19} /> },
    { id: 'insights',     label: 'Insights',  icon: <PieChart       size={19} /> },
    { id: 'budgeting',    label: 'Budget',    icon: <Target         size={19} /> },
    { id: 'summary',      label: 'Summary',   icon: <CalendarDays   size={19} /> },
    { id: 'settings',     label: 'Settings',  icon: <Settings       size={19} /> },
  ];

  // Dynamic moving dock: hides on scroll down, appears on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show near top of screen
      if (currentScrollY < 40) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling down -> hide; Scrolling up -> reveal
      if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll active tab into center view in the horizontal scrollable bar
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  return (
    <nav
      className={`md:hidden fixed bottom-3 left-0 right-0 z-40 px-3 transition-all duration-300 ease-base pointer-events-none ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      aria-label="Main Mobile Navigation"
    >
      {/* Floating Apple Dock: Symbol on top, label below, horizontally scrollable */}
      <div className="pointer-events-auto max-w-fit mx-auto apple-glass bg-white/92 dark:bg-[#1C1C1E]/92 border border-black/[0.08] dark:border-white/[0.12] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.14)] p-1.5 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 touch-pan-x">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              className={`shrink-0 min-w-[62px] py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 select-none ${
                isActive
                  ? 'bg-[#214B30] text-white shadow-[0_2px_10px_rgba(33,75,48,0.30)]'
                  : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Symbol on top */}
              <span className={`shrink-0 transition-transform duration-150 ${isActive ? 'scale-105' : 'scale-100'}`}>
                {item.icon}
              </span>

              {/* Name of symbol below */}
              <span className={`text-[10px] mt-0.5 tracking-tight whitespace-nowrap leading-tight ${
                isActive ? 'font-bold text-white' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
