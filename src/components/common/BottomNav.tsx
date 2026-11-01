import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Settings,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={21} /> },
    { id: 'transactions', label: 'Expenses', icon: <ReceiptText size={21} /> },
    { id: 'insights', label: 'Insights', icon: <PieChart size={21} /> },
    { id: 'budgeting', label: 'Budget', icon: <Target size={21} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={21} /> },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 apple-glass border-t border-black/[0.07] dark:border-white/[0.08] safe-area-pb transition-all"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around h-14 sm:h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all apple-pressable ${
                isActive
                  ? 'text-[#007AFF]'
                  : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`transition-transform duration-150 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-semibold text-[#007AFF]' : 'font-normal text-[#8E8E93]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
