import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { AppLogo } from './AppLogo';
import { APP_NAV_ITEMS } from '../../constants/navigation';
import {
  Home,
  ReceiptText,
  PieChart,
  Target,
  CalendarDays,
  Settings,
  X,
  ShieldCheck,
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

interface SidebarProps {
  onShowLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onShowLanding }) => {
  const { activeTab, setActiveTab, isSidebarOpen, closeSidebar } = useApp();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) closeSidebar();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSidebarOpen, closeSidebar]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  const handleFaqClick = () => {
    closeSidebar();
    if (onShowLanding) {
      onShowLanding();
      requestAnimationFrame(() => {
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-50 w-72 flex flex-col
          apple-glass dark:bg-[#1C1C1E]/95 border-r border-black/[0.06] dark:border-white/[0.08]
          shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          paddingTop: 'var(--safe-area-top)',
          paddingBottom: 'var(--safe-area-bottom)',
        }}
        aria-label="Navigation sidebar"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <AppLogo size="sm" showText={true} subtitle="Personal Finance" />

          <button
            onClick={closeSidebar}
            className="w-8 h-8 rounded-full bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-colors apple-pressable"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1" aria-label="Main navigation">
          {APP_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = NAV_ICON_MAP[item.iconName] || Home;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-left transition-all duration-150 apple-pressable group ${
                  isActive
                    ? 'bg-[#214B30] text-white shadow-[0_3px_12px_rgba(33,75,48,0.28)] border border-brand-600/30 dark:border-white/10'
                    : 'text-[#1C1C1E] dark:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#8E8E93] group-hover:text-[#214B30] dark:group-hover:text-emerald-400'
                  }`}
                >
                  <IconComponent size={20} />
                </span>

                <div className="flex flex-col min-w-0">
                  <span className={`text-[14px] font-semibold leading-tight ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                  <span className={`text-[11px] leading-tight mt-0.5 ${
                    isActive ? 'text-emerald-100/80' : 'text-[#8E8E93]'
                  }`}>
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}

          {!Capacitor.isNativePlatform() && (
            <div className="pt-2 mt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
              <button
                onClick={handleFaqClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-left transition-all duration-150 apple-pressable group text-brand-700 dark:text-emerald-400 hover:bg-brand-500/10 dark:hover:bg-emerald-500/15"
              >
                <span className="flex-shrink-0 text-brand-700 dark:text-emerald-400">
                  <HelpCircle size={20} />
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold leading-tight">
                    FAQ &amp; Product Guide
                  </span>
                  <span className="text-[11px] leading-tight mt-0.5 text-[#8E8E93] dark:text-[#AEAEB2]">
                    How to download &amp; use
                  </span>
                </div>
              </button>
            </div>
          )}
        </nav>

        <div className="px-5 py-4 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2 text-[11px] text-[#8E8E93]">
            <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
            <span className="font-medium">100% Private &amp; On-Device Storage</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mt-1.5">
            <span>Your data never leaves this device</span>
            <span className="font-semibold text-[#1C1C1E] dark:text-white">Made with ✨ by JK</span>
          </div>
        </div>
      </aside>
    </>
  );
};
