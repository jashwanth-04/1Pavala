import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { APP_NAV_ITEMS } from '../../constants/navigation';
import {
  Home,
  ReceiptText,
  PieChart,
  Target,
  CalendarDays,
  Settings,
  Plus,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  Home,
  ReceiptText,
  PieChart,
  Target,
  CalendarDays,
  Settings,
};

interface BottomNavProps {
  onShowLanding?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onShowLanding }) => {
  const { activeTab, setActiveTab, openAddExpenseModal } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 40) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

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

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  const handleFaqClick = () => {
    if (onShowLanding) {
      onShowLanding();
      requestAnimationFrame(() => {
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  const renderTabButton = (item: { id: ActiveTab; label: string; iconName: string }) => {
    const isActive = activeTab === item.id;
    const IconComponent = NAV_ICON_MAP[item.iconName] || Home;

    if (isActive) {
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
            <IconComponent size={15} />
          </span>
          <span className="whitespace-nowrap tracking-tight font-bold">
            {item.label}
          </span>
        </button>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        aria-label={item.label}
        title={item.label}
        className="w-9 h-9 rounded-full bg-black/[0.05] dark:bg-white/[0.09] text-[#8E8E93] dark:text-[#AEAEB2] hover:text-[#1C1C1E] dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.16] active:scale-90 flex items-center justify-center shrink-0 transition-all duration-150 select-none"
      >
        <span className="shrink-0">
          <IconComponent size={15} />
        </span>
      </button>
    );
  };

  return (
    <nav
      className={`md:hidden fixed left-0 right-0 z-40 px-3 transition-all duration-300 ease-base pointer-events-none ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
      style={{ bottom: 'calc(var(--safe-area-bottom, 0px) + 0.75rem)' }}
      aria-label="Main Mobile Navigation"
    >
      <div className="pointer-events-auto flex items-center justify-center gap-2 max-w-full mx-auto">
        <button
          onClick={openAddExpenseModal}
          aria-label="Add expense"
          title="Add expense"
          className="w-10 h-10 rounded-full bg-[#214B30] dark:bg-[#34C759] hover:bg-[#1A3B26] dark:hover:bg-[#2db850] active:scale-90 text-white dark:text-[#061A0C] flex items-center justify-center shrink-0 shadow-[0_3px_14px_rgba(33,75,48,0.35)] dark:shadow-[0_3px_16px_rgba(52,199,89,0.40)] border border-white/20 dark:border-black/15 transition-transform duration-150"
        >
          <Plus size={18} strokeWidth={2.6} />
        </button>

        <div className="apple-glass bg-white/92 dark:bg-[#1C1C1E]/95 border border-black/[0.08] dark:border-white/[0.14] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1 touch-pan-x w-[210px] max-w-[215px] shrink-0">
          {APP_NAV_ITEMS.map((item) => renderTabButton(item))}
        </div>

        {!Capacitor.isNativePlatform() && (
          <button
            onClick={handleFaqClick}
            aria-label="FAQ & App Guide"
            title="FAQ & App Guide"
            className="w-10 h-10 rounded-full apple-glass bg-white/92 dark:bg-[#1C1C1E]/95 hover:bg-black/[0.05] dark:hover:bg-white/[0.1] active:scale-90 text-brand-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_3px_12px_rgba(0,0,0,0.10)] dark:shadow-[0_3px_14px_rgba(0,0,0,0.5)] border border-black/[0.08] dark:border-white/[0.14] transition-transform duration-150"
          >
            <HelpCircle size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </nav>
  );
};
