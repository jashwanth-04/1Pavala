import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Sidebar } from './components/common/Sidebar';
import { AppLogo } from './components/common/AppLogo';
import { ToastContainer } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionListView } from './components/expenses/TransactionListView';
import { InsightsView } from './components/insights/InsightsView';
import { BudgetView } from './components/budget/BudgetView';
import { MonthlySummaryView } from './components/summary/MonthlySummaryView';
import { SettingsView } from './components/settings/SettingsView';
import { AddEditExpenseModal } from './components/expenses/AddEditExpenseModal';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, openAddExpenseModal } = useApp();

  // PWA shortcut listener: If app is opened with ?action=add, immediately launch Add Expense
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add') {
      openAddExpenseModal();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [openAddExpenseModal]);

  // Keyboard shortcut: Pressing 'n' or '+' opens Add Expense modal if not in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key === 'n' || e.key === 'N' || e.key === '+') {
        e.preventDefault();
        openAddExpenseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAddExpenseModal]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] text-[#1C1C1E] dark:text-white flex flex-col antialiased selection:bg-[#214B30] selection:text-white dark:selection:bg-[#34C759] dark:selection:text-[#0A170F] pb-24 md:pb-12 transition-colors duration-150 ease-out overflow-x-hidden">
      {/* Toast Feedback */}
      <ToastContainer />

      {/* Left Slide-in Sidebar */}
      <Sidebar />

      {/* Top Application Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard'    && <DashboardView />}
        {activeTab === 'transactions' && <TransactionListView />}
        {activeTab === 'insights'     && <InsightsView />}
        {activeTab === 'budgeting'    && <BudgetView />}
        {activeTab === 'summary'      && <MonthlySummaryView />}
        {activeTab === 'settings'     && <SettingsView />}
      </main>

      {/* Add / Edit Expense Dialog */}
      <AddEditExpenseModal />

      {/* Bottom Navigation — mobile & tablet only */}
      <BottomNav />

      {/* Footer — desktop only */}
      <footer className="hidden md:block border-t border-slate-200/70 dark:border-white/[0.06] mt-auto py-5 bg-white/50 dark:bg-[#1C1C1E]/50 text-xs text-slate-500 dark:text-[#8E8E93]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: brand name */}
          <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-[#8E8E93]">
            <AppLogo size="xs" showText={false} />
            <span>1Pavala — Personal Expense Tracker</span>
          </div>

          {/* Centre / Right: privacy badge */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 dark:text-[#48484A]">
              Manual money management • PC, Laptop, Mobile &amp; Tablet
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={13} />
              <span>100% Private &amp; On-Device Storage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
