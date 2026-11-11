import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useApp } from '../../context/AppContext';
import { formatCurrency, getTodayDateString, formatDateDisplay } from '../../utils/formatters';
import { PaymentMethod, Expense } from '../../types';
import { 
  Plus, 
  Clock, 
  X, 
  Check, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Building2,
  Receipt,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Zap,
  Briefcase,
  HelpCircle
} from 'lucide-react';

interface FloatingWindowViewProps {
  initialAction?: 'add' | 'recent';
}

const getCategoryIcon = (iconName: string) => {
  const map: Record<string, React.ReactNode> = {
    Utensils: <Utensils size={18} />,
    Car: <Car size={18} />,
    ShoppingBag: <ShoppingBag size={18} />,
    Film: <Film size={18} />,
    Zap: <Zap size={18} />,
    Briefcase: <Briefcase size={18} />,
  };
  return map[iconName] || <HelpCircle size={18} />;
};

export const FloatingWindowView: React.FC<FloatingWindowViewProps> = ({ initialAction }) => {
  const { expenses, categories, settings, addExpense, showToast } = useApp();
  
  const [currentTab, setCurrentTab] = useState<'add' | 'recent'>(() => {
    const urlAction = new URLSearchParams(window.location.search).get('action');
    return urlAction === 'recent' || initialAction === 'recent' ? 'recent' : 'add';
  });

  // Add Expense State
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'cat-1');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Close floating window and return to homescreen
  const handleDismiss = () => {
    if (Capacitor.isNativePlatform()) {
      CapApp.exitApp();
    } else {
      window.close();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(parseFloat(amount).toFixed(2));
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }

    setIsSubmitting(true);
    addExpense({
      amount: parsedAmount,
      categoryId,
      date,
      paymentMethod,
      note: note.trim() || undefined,
    });

    setIsSaved(true);
    showToast(`Recorded ${formatCurrency(parsedAmount, settings.currencySymbol)}`, 'success');

    // Auto close window after brief confirmation
    setTimeout(() => {
      handleDismiss();
    }, 600);
  };

  // Recent 6 transactions
  const recentExpenses = expenses.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={handleDismiss} />

      {/* Floating Modal Window */}
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-[28px] shadow-2xl border border-black/10 dark:border-white/15 overflow-hidden flex flex-col max-h-[90vh] z-10 transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/10 bg-slate-50/70 dark:bg-[#2C2C2E]/50">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="1Pavala" 
              className="w-8 h-8 rounded-full border border-black/10 shadow-xs object-cover" 
            />
            <div>
              <h2 className="text-base font-bold text-[#1C1C1E] dark:text-white leading-tight">
                {currentTab === 'add' ? 'Record Expense' : 'Recent Transactions'}
              </h2>
              <p className="text-[11px] text-[#8E8E93] font-medium leading-none mt-0.5">
                1Pavala Quick Floating Window
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tab Toggle */}
            <div className="flex bg-black/5 dark:bg-white/10 p-0.5 rounded-full mr-1">
              <button
                type="button"
                onClick={() => setCurrentTab('add')}
                className={`p-1.5 rounded-full transition-all ${
                  currentTab === 'add' 
                    ? 'bg-[#214B30] text-white shadow-xs' 
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
                }`}
                title="Record Expense"
              >
                <Plus size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('recent')}
                className={`p-1.5 rounded-full transition-all ${
                  currentTab === 'recent' 
                    ? 'bg-[#214B30] text-white shadow-xs' 
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
                }`}
                title="Recent Transactions"
              >
                <Clock size={15} />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#8E8E93] transition-colors"
              title="Close window"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto">
          {currentTab === 'add' ? (
            <form onSubmit={handleSave} className="space-y-4">
              {/* Amount Input with Paisa support */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider mb-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-[#8E8E93]">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 rounded-2xl text-2xl font-extrabold text-[#1C1C1E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#214B30]"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 6).map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all border ${
                          isSelected
                            ? 'bg-[#214B30]/10 border-[#214B30] text-[#214B30] dark:bg-[#34C759]/15 dark:border-[#34C759] dark:text-[#34C759] font-bold shadow-xs'
                            : 'bg-slate-50 dark:bg-white/[0.04] border-black/5 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <span className="text-xs truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method & Note */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider mb-1">
                    Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 rounded-xl text-xs font-semibold text-[#1C1C1E] dark:text-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 rounded-xl text-xs font-semibold text-[#1C1C1E] dark:text-white"
                  />
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note (optional, e.g. Lunch with friends)"
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 rounded-xl text-xs text-[#1C1C1E] dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSaved}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#214B30] to-[#2E5E3D] hover:from-[#1A3C26] hover:to-[#254C32] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSaved ? (
                  <>
                    <Check size={18} className="text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Save Expense</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Recent Transactions View */
            <div className="space-y-2.5">
              {recentExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No transactions recorded yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">Use the + button to record your first expense</p>
                </div>
              ) : (
                recentExpenses.map((exp: Expense) => {
                  const cat = categories.find((c) => c.id === exp.categoryId);
                  return (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat?.color || '#214B30'}20`, color: cat?.color || '#214B30' }}
                        >
                          {getCategoryIcon(cat?.icon || 'HelpCircle')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1C1C1E] dark:text-white truncate max-w-[170px]">
                            {exp.note || cat?.name || 'Expense'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatDateDisplay(exp.date)} • {exp.paymentMethod || 'UPI'}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {formatCurrency(exp.amount, settings.currencySymbol)}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Bottom Quick Action */}
              <button
                type="button"
                onClick={() => setCurrentTab('add')}
                className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-[#214B30]/40 text-[#214B30] dark:border-[#34C759]/40 dark:text-[#34C759] text-xs font-bold hover:bg-[#214B30]/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={15} />
                <span>Record New Expense</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingWindowView;
