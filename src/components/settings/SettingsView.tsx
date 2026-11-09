import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import {
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  DollarSign,
  User,
  Sliders,
  Plus,
  Check,
  ChevronRight,
  Shield,
  Coins,
  Sparkles,
  Smartphone,
  Database,
  Pencil,
  X,
} from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { AppLogo } from '../common/AppLogo';
import { TermsModal } from '../common/TermsModal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetAllData,
    exportData,
    importData,
  } = useApp();

  const [userName, setUserName] = useState(settings.userName || '');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || '₹');
  const [t1, setT1] = useState(String(settings.thresholds[0]));
  const [t2, setT2] = useState(String(settings.thresholds[1]));
  const [t3, setT3] = useState(String(settings.thresholds[2]));

  // Custom Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [newCatIcon, setNewCatIcon] = useState('Tag');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Edit & Delete Custom Category State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatColor, setEditCatColor] = useState('#3b82f6');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    if (editingCategory) {
      setEditCatName(editingCategory.name);
      setEditCatColor(editingCategory.color || '#3b82f6');
    }
  }, [editingCategory]);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  React.useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert(
        'To install 1Pavala:\n• iOS: Tap the Share button in Safari, then choose "Add to Home Screen".\n• Android / Chrome / Edge: Click the Install icon in the browser address bar or menu.'
      );
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim(),
      currencySymbol,
      thresholds: [
        parseInt(t1, 10) || 75,
        parseInt(t2, 10) || 90,
        parseInt(t3, 10) || 100,
      ],
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor,
      bgLight: `${newCatColor}20`,
    });

    setNewCatName('');
    setIsAddingCategory(false);
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    updateCategory(editingCategory.id, {
      name: editCatName.trim(),
      color: editCatColor,
      bgLight: `${editCatColor}20`,
    });

    setEditingCategory(null);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const userInitial = userName.trim() ? userName.trim().charAt(0).toUpperCase() : 'P';

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* Title */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h2>
        </div>
      </div>

      {/* 1. Apple Account / Identity Card */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 aspect-square rounded-full bg-gradient-to-br from-[#214B30] to-[#3D7D5E] text-white flex items-center justify-center font-black text-lg sm:text-2xl shadow-sm shrink-0">
            {userInitial}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg truncate">
              {userName.trim() ? userName : 'Personal Ledger'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8E8E93] truncate">
              IndexedDB Persistent Storage • Sovereign Ledger
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-semibold">
          <Shield size={12} className="stroke-[2.5]" />
          <span>Private</span>
        </div>
      </div>

      {/* 2. Grouped Section: PREFERENCES */}
      <div>
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8E8E93] px-3.5 mb-2">
          Preferences
        </p>

        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs divide-y divide-slate-100 dark:divide-white/[0.06] overflow-hidden">
          {/* Row: Display Name */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#007AFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <User size={15} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                Display Name
              </span>
            </div>
            <div className="shrink-0">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Pavala"
                className="text-right text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 bg-transparent focus:outline-hidden placeholder:text-slate-400 w-32 sm:w-48"
              />
            </div>
          </div>

          {/* Row: Currency Symbol */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#34C759] text-white flex items-center justify-center shrink-0 shadow-xs">
                <DollarSign size={15} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                Currency
              </span>
            </div>
            <div className="shrink-0">
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="text-right text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-transparent cursor-pointer focus:outline-hidden"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD - US Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="¥">¥ (JPY - Japanese Yen)</option>
                <option value="₨">₨ (PKR / NPR - Rupee)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
          </div>

          {/* Row: Budget Warning Thresholds */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FF9500] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sliders size={15} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Warning Thresholds (%)
                </span>
                <p className="text-[10px] text-slate-400 dark:text-[#8E8E93]">
                  Budget pacing alerts at 3 percentage tiers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200/70 dark:border-yellow-800/40 text-yellow-800 dark:text-yellow-400">
                <span className="text-[10px] font-bold">T1:</span>
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={t1}
                  onChange={(e) => setT1(e.target.value)}
                  className="w-8 text-center text-xs font-bold bg-transparent focus:outline-hidden"
                />
                <span className="text-[10px]">%</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 text-amber-800 dark:text-amber-400">
                <span className="text-[10px] font-bold">T2:</span>
                <input
                  type="number"
                  min="70"
                  max="99"
                  value={t2}
                  onChange={(e) => setT2(e.target.value)}
                  className="w-8 text-center text-xs font-bold bg-transparent focus:outline-hidden"
                />
                <span className="text-[10px]">%</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/70 dark:border-red-800/40 text-red-800 dark:text-red-400">
                <span className="text-[10px] font-bold">Max:</span>
                <input
                  type="number"
                  min="90"
                  max="120"
                  value={t3}
                  onChange={(e) => setT3(e.target.value)}
                  className="w-8 text-center text-xs font-bold bg-transparent focus:outline-hidden"
                />
                <span className="text-[10px]">%</span>
              </div>
            </div>
          </div>

          {/* Save Action Footer */}
          <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-white/[0.02] flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#214B30] hover:bg-[#1A3B26] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
        <p className="text-[11px] text-slate-400 dark:text-[#8E8E93] px-3.5 mt-1.5">
          Changes will apply instantly across all dashboard calculations and charts.
        </p>
      </div>

      {/* 3. Grouped Section: CATEGORIES */}
      <div>
        <div className="flex items-center justify-between px-3.5 mb-2">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8E8E93]">
            Categories ({categories.length})
          </p>
          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#214B30] dark:text-[#34C759] hover:underline"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>{isAddingCategory ? 'Close' : 'Add Category'}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs p-3.5 sm:p-4 space-y-3">
          {/* Add Category Form Sheet */}
          {isAddingCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="p-3.5 bg-slate-50 dark:bg-white/[0.04] rounded-xl border border-slate-200/80 dark:border-white/[0.08] space-y-3"
            >
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                New Custom Category
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Subscriptions, Hobbies"
                    className="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-500">{newCatColor}</span>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#214B30] hover:bg-[#1A3B26] text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-white/[0.1] text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.04] hover:border-slate-200 dark:hover:border-white/[0.08] transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CategoryIcon category={cat} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {cat.name}
                    </p>
                    {cat.isCustom && (
                      <span className="text-[9px] uppercase font-bold text-[#214B30] dark:text-[#34C759]">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                {cat.isCustom && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(cat)}
                      className="p-1 rounded-lg text-slate-400 hover:text-[#214B30] dark:hover:text-[#34C759] hover:bg-slate-200/60 dark:hover:bg-white/[0.08] active:scale-95 transition-all"
                      title={`Edit ${cat.name}`}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition-all"
                      title={`Delete ${cat.name}`}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Grouped Section: DATA & STORAGE */}
      <div>
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8E8E93] px-3.5 mb-2">
          Data &amp; Storage
        </p>

        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs divide-y divide-slate-100 dark:divide-white/[0.06] overflow-hidden">
          {/* Row: Storage Engine Status */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Database size={15} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Persistent Storage Engine
                </p>
                <p className="text-[10px] text-slate-400 dark:text-[#8E8E93]">
                  High-capacity IndexedDB with automatic cache-clear resilience
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
              IndexedDB Active
            </span>
          </div>

          {/* Row: PWA Installation / Standalone Status */}
          {isStandalone ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Smartphone size={15} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                    Standalone PWA Active
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    Full offline support enabled with instant native launch
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                Installed
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallApp}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#214B30] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Smartphone size={15} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Install 1Pavala App
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-[#8E8E93]">
                    Add to your Home Screen or Desktop for offline-first experience
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </button>
          )}

          {/* Row: Export Backup (JSON) */}
          <button
            type="button"
            onClick={() => exportData('json')}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Download size={15} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Export JSON Backup
                </p>
                <p className="text-[10px] text-slate-400 dark:text-[#8E8E93]">
                  Download a full offline JSON snapshot of your data
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 shrink-0" />
          </button>

          {/* Row: Restore Backup (JSON) */}
          <label className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors cursor-pointer text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Upload size={15} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Restore from JSON Backup
                </p>
                <p className="text-[10px] text-slate-400 dark:text-[#8E8E93]">
                  Import expenses and category data from a backup file
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 shrink-0" />
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Row: Clear All Data */}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to permanently clear ALL recorded expenses and budgets? This cannot be undone.'
                )
              ) {
                resetAllData();
              }
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FF3B30] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Trash2 size={15} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#FF3B30]">
                  Erase All Data
                </p>
                <p className="text-[10px] text-slate-400 dark:text-[#8E8E93]">
                  Permanently delete all expenses, custom categories, and budgets
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-red-400 shrink-0" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-[#8E8E93] px-3.5 mt-1.5">
          Your data lives strictly inside your browser's local sandbox. Keep periodic JSON exports to prevent data loss.
        </p>
      </div>

      {/* 5. Grouped Section: PRIVACY PLEDGE */}
      <div>
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8E8E93] px-3.5 mb-2">
          Privacy
        </p>
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck size={16} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              100% On-Device &amp; Private
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8E8E93] leading-relaxed">
            1Pavala operates entirely offline. No tracking telemetry, no third-party cloud brokers, and no bank credential requests. Financial data never leaves your device.
          </p>
          <button
            type="button"
            onClick={() => setIsTermsModalOpen(true)}
            className="w-full mt-2 pt-2.5 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#214B30] dark:text-[#34C759] hover:underline cursor-pointer"
          >
            <span>Read Terms of Service &amp; Privacy Notice</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 6. Apple About Card */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex items-center gap-3.5">
        <AppLogo size="md" className="shrink-0" />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">1Pavala</h4>
          <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] truncate">
            Version 1.0.0 • Sovereign Personal Expense Tracker
          </p>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs apple-backdrop-fade">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/80 dark:border-white/[0.1] shadow-2xl p-5 space-y-4 apple-window-pop">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Edit Custom Category
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryEdit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#214B30]"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={editCatColor}
                    onChange={(e) => setEditCatColor(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                    {editCatColor}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.14] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#214B30] hover:bg-[#1A3B26] text-white shadow-xs transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Dialog */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs apple-backdrop-fade">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/80 dark:border-white/[0.1] shadow-2xl p-5 space-y-4 apple-window-pop">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete "{categoryToDelete.name}"?
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Any existing expenses assigned to this category will be preserved and reassigned to "Other".
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.14] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all active:scale-95"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      <TermsModal
        isOpen={isTermsModalOpen}
        canDismiss={true}
        onAccept={() => setIsTermsModalOpen(false)}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
};
