import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  Home,
  Plus,
  Wallet,
  BarChart3,
  Target,
  CalendarDays,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface BottomNavProps {
  onShowLanding?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onShowLanding }) => {
  const { activeTab, setActiveTab, openAddExpenseModal } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Navigation items: Home is the first item
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard',    label: 'Home',     icon: <Home size={15} /> },
    { id: 'transactions', label: 'Expenses', icon: <Wallet size={15} /> },
    { id: 'insights',     label: 'Insights', icon: <BarChart3 size={15} /> },
    { id: 'budgeting',    label: 'Budget',   icon: <Target size={15} /> },
    { id: 'summary',      label: 'Summary',  icon: <CalendarDays size={15} /> },
    { id: 'settings',     label: 'Settings', icon: <Settings size={15} /> },
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

  const renderTabButton = (item: { id: ActiveTab; label: string; icon: React.ReactNode }) => {
    const isActive = activeTab === item.id;

    if (isActive) {
      // Active state: compact expanding pill highlighted with 1Pavala theme green in both light & dark modes
      return (
        <button
          key={item.id}
          ref={activeTabRef}
          onClick={() => setActiveTab(item.id)}
          aria-label={item.label}
          className="h-9 px-3 rounded-full bg-[#214B30] dark:bg-[#34C759] text-white dark:text-[#061A0C] font-bold text-[11px] flex items-center gap-1 shadow-[0_2px_10px_rgba(33,75,48,0.30)] dark:shadow-[0_2px_12px_rgba(52,199,89,0.40)] shrink-0 transition-all duration-200 active:scale-95 select-none"
          aria-current="page"
        >
          <span className="shrink-0">
            {item.icon}
          </span>
          <span className="whitespace-nowrap tracking-tight font-bold">
            {item.label}
          </span>
        </button>
      );
    }

    // Inactive state: compact circular button with icon only
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        aria-label={item.label}
        title={item.label}
        className="w-9 h-9 rounded-full bg-black/[0.05] dark:bg-white/[0.09] text-[#8E8E93] dark:text-[#AEAEB2] hover:text-[#1C1C1E] dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.16] active:scale-90 flex items-center justify-center shrink-0 transition-all duration-150 select-none"
      >
        <span className="shrink-0">
          {item.icon}
        </span>
      </button>
    );
  };

  return (
    <nav
      className={`md:hidden fixed bottom-3 left-0 right-0 z-40 px-3 transition-all duration-300 ease-base pointer-events-none ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      aria-label="Main Mobile Navigation"
    >
      <div className="pointer-events-auto flex items-center justify-center gap-2 max-w-full mx-auto">
        
        {/* 1. SEPARATE ENTITY: Standalone Plus Button on the LEFT side of the navigation bar */}
        <button
          onClick={openAddExpenseModal}
          aria-label="Add expense"
          title="Add expense"
          className="w-10 h-10 rounded-full bg-[#214B30] dark:bg-[#34C759] hover:bg-[#1A3B26] dark:hover:bg-[#2db850] active:scale-90 text-white dark:text-[#061A0C] flex items-center justify-center shrink-0 shadow-[0_3px_14px_rgba(33,75,48,0.35)] dark:shadow-[0_3px_16px_rgba(52,199,89,0.40)] border border-white/20 dark:border-black/15 transition-transform duration-150"
        >
          <Plus size={18} strokeWidth={2.6} />
        </button>

        {/* 2. COMPACT SCROLLABLE NAVIGATION DOCK: Noticeably shorter, sleek Apple pill */}
        <div className="apple-glass bg-white/92 dark:bg-[#1C1C1E]/95 border border-black/[0.08] dark:border-white/[0.14] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1 touch-pan-x w-[210px] max-w-[215px] shrink-0">
          {navItems.map((item) => renderTabButton(item))}
        </div>

        {/* 3. SEPARATE ENTITY: FAQ & App Guide Button on the RIGHT side of the navigation bar */}
        <button
          onClick={() => {
            if (onShowLanding) {
              onShowLanding();
              setTimeout(() => {
                const el = document.getElementById('faq');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }
          }}
          aria-label="FAQ & App Guide"
          title="FAQ & App Guide"
          className="w-10 h-10 rounded-full apple-glass bg-white/92 dark:bg-[#1C1C1E]/95 hover:bg-black/[0.05] dark:hover:bg-white/[0.1] active:scale-90 text-brand-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_3px_12px_rgba(0,0,0,0.10)] dark:shadow-[0_3px_14px_rgba(0,0,0,0.5)] border border-black/[0.08] dark:border-white/[0.14] transition-transform duration-150"
        >
          <HelpCircle size={18} strokeWidth={2.2} />
        </button>

      </div>
    </nav>
  );
};
