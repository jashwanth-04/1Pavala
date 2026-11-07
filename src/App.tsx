import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionListView } from './components/expenses/TransactionListView';
import { InsightsView } from './components/insights/InsightsView';
import { BudgetView } from './components/budget/BudgetView';
import { MonthlySummaryView } from './components/summary/MonthlySummaryView';
import { SettingsView } from './components/settings/SettingsView';
import { AddEditExpenseModal } from './components/expenses/AddEditExpenseModal';
import { LandingPageView } from './components/landing/LandingPageView';
import { ShieldCheck, Globe } from 'lucide-react';

interface AppContentProps {
  onShowLanding: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ onShowLanding }) => {
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
      <footer className="hidden md:block border-t border-black/[0.06] dark:border-white/[0.06] mt-auto py-5 bg-white/60 dark:bg-[#181818]/60 text-xs text-[#8E8E93]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: brand name & Landing Page toggle */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#1C1C1E] dark:text-white">
              1Pavala — Personal Expense Tracker
            </span>
            <button
              onClick={onShowLanding}
              className="inline-flex items-center gap-1 text-brand-700 dark:text-emerald-400 hover:underline font-medium caption-2"
            >
              <Globe size={12} />
              <span>Product Page &amp; FAQ</span>
            </button>
          </div>

          {/* Centre / Right: privacy badge */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 dark:text-[#48484A]">
              Manual money management • PC, Laptop, Mobile &amp; Tablet
            </span>
            <div className="flex items-center gap-1.5 text-brand-700 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={14} />
              <span>100% Private On-Device IndexedDB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    // If standalone PWA, open app directly
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      return 'app';
    }
    // If explicit query parameter (?app=true or ?action=add)
    const params = new URLSearchParams(window.location.search);
    if (params.get('app') === 'true' || params.get('action')) {
      return 'app';
    }
    // Check saved view preference
    const saved = localStorage.getItem('1pavala_view_mode');
    if (saved === 'app' || saved === 'landing') {
      return saved;
    }
    // Default to landing page for new visitors
    return 'landing';
  });

  const handleOpenApp = () => {
    setViewMode('app');
    localStorage.setItem('1pavala_view_mode', 'app');
  };

  const handleShowLanding = () => {
    setViewMode('landing');
    localStorage.setItem('1pavala_view_mode', 'landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppProvider>
      {viewMode === 'landing' ? (
        <LandingPageView onOpenApp={handleOpenApp} />
      ) : (
        <AppContent onShowLanding={handleShowLanding} />
      )}
    </AppProvider>
  );
}

export default App;
