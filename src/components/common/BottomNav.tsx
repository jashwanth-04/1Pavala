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
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddExpenseModal } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Navigation items: Overview renamed to Home completely
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard',    label: 'Home',     icon: <Home size={18} /> },
    { id: 'transactions', label: 'Expenses', icon: <Wallet size={18} /> },
    { id: 'insights',     label: 'Insights', icon: <BarChart3 size={18} /> },
    { id: 'budgeting',    label: 'Budget',   icon: <Target size={18} /> },
    { id: 'summary',      label: 'Summary',  icon: <CalendarDays size={18} /> },
    { id: 'settings',     label: 'Settings', icon: <Settings size={18} /> },
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

  const homeItem = navItems[0]; // Home
  const otherItems = navItems.slice(1); // Expenses, Insights, Budget, Summary, Settings

  const renderTabButton = (item: { id: ActiveTab; label: string; icon: React.ReactNode }) => {
    const isActive = activeTab === item.id;

    if (isActive) {
      // Active state: expanding white pill with icon + label (matching reference image)
      return (
        <button
          key={item.id}
          ref={activeTabRef}
          onClick={() => setActiveTab(item.id)}
          aria-label={item.label}
          className="h-10 px-4 rounded-full bg-white text-[#121212] font-bold text-xs flex items-center gap-1.5 shadow-[0_2px_12px_rgba(255,255,255,0.25)] shrink-0 transition-all duration-300 ease-base active:scale-95 select-none"
          aria-current="page"
        >
          <span className="shrink-0 text-[#121212]">
            {item.icon}
          </span>
          <span className="whitespace-nowrap tracking-tight font-bold">
            {item.label}
          </span>
        </button>
      );
    }

    // Inactive state: circular dark button with icon only (no text, matching reference image)
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        aria-label={item.label}
        title={item.label}
        className="w-10 h-10 rounded-full bg-white/10 text-white/75 hover:text-white hover:bg-white/15 active:scale-90 flex items-center justify-center shrink-0 transition-all duration-200 select-none"
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
      {/* Floating Apple Capsule Dock: Exactly matching reference image */}
      <div className="pointer-events-auto max-w-fit mx-auto bg-[#141416]/95 dark:bg-[#121214]/95 backdrop-blur-xl border border-white/10 dark:border-white/12 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.65)] p-1.5 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 touch-pan-x">
        
        {/* 1. Home tab */}
        {renderTabButton(homeItem)}

        {/* 2. Plus Button: Placed just beside Home (no text, pure plus symbol) */}
        <button
          onClick={openAddExpenseModal}
          aria-label="Add expense"
          title="Add expense"
          className="w-10 h-10 rounded-full bg-[#214B30] hover:bg-[#1A3B26] active:scale-90 text-white flex items-center justify-center shrink-0 shadow-sm border border-white/15 transition-all duration-200"
        >
          <Plus size={19} strokeWidth={2.4} />
        </button>

        {/* 3. Remaining tabs (Expenses, Insights, Budget, Summary, Settings) */}
        {otherItems.map((item) => renderTabButton(item))}

      </div>
    </nav>
  );
};
