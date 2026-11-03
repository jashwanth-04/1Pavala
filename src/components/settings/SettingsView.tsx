import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  DollarSign,
  User,
  Sliders,
  Plus,
  Lock,
  ExternalLink,
  Check,
} from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { AppLogo } from '../common/AppLogo';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    categories,
    addCategory,
    loadSampleData,
    resetAllData,
    exportData,
    importData,
    showToast,
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Settings &amp; Data
        </h2>
      </div>

      {/* 1. Privacy Pledge (PRD Requirement 5.9) */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock size={24} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                100% Privacy-First Architecture
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                Verified Local
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>1Pavala</strong> never asks for your bank credentials, UPI accounts, or credit card feeds.
              We do not track or transmit financial data to external cloud services or third-party brokers.
              All expense records, budget ceilings, and categories are stored strictly inside your browser's local sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Preferences & Alert Thresholds */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
          <Sliders size={20} className="text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">Preferences &amp; Thresholds</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Pavala"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Currency Symbol
              </label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500 cursor-pointer"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD - US Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="¥">¥ (JPY - Japanese Yen)</option>
                <option value="₨">₨ (PKR/NPR/LKR - Rupee)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Budget Warning Thresholds (%)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-yellow-700 font-semibold">Alert 1 (%)</span>
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={t1}
                  onChange={(e) => setT1(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 text-center"
                />
              </div>
              <div>
                <span className="text-[11px] text-amber-700 font-semibold">Alert 2 (%)</span>
                <input
                  type="number"
                  min="70"
                  max="99"
                  value={t2}
                  onChange={(e) => setT2(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 text-center"
                />
              </div>
              <div>
                <span className="text-[11px] text-red-700 font-semibold">Exhaustion (%)</span>
                <input
                  type="number"
                  min="90"
                  max="120"
                  value={t3}
                  onChange={(e) => setT3(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 text-center"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Warning badges and advice banners appear when your monthly spend reaches these thresholds.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-600/25 transition-all"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Category Management */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Expense Categories</h3>
            <p className="text-xs text-slate-500">Available classification tags for your spending</p>
          </div>
          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Plus size={14} />
            <span>Add Custom</span>
          </button>
        </div>

        {isAddingCategory && (
          <form
            onSubmit={handleCreateCategory}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Create New Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Pet Care, Fitness"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none"
                  />
                  <span className="text-xs font-mono text-slate-500">{newCatColor}</span>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <CategoryIcon category={cat} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{cat.name}</p>
                {cat.isCustom && (
                  <span className="text-[9px] uppercase font-semibold text-brand-600">Custom</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Data Management & Storage Operations (PRD Requirement 5.8) */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Database size={20} className="text-brand-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Data Management &amp; Storage</h3>
            <p className="text-xs text-slate-500">
              LocalStorage Browser Sandbox • No synchronization to external servers
            </p>
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">Important Notice About Local Storage:</p>
          <p className="mt-0.5 text-amber-800">
            Your expense records reside exclusively inside your current web browser. Clearing your browser cache or site data will erase these records.
            Use the <strong>Export JSON / CSV</strong> buttons below periodically to back up your data or transfer it to another device.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Load Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset current records and load realistic sample demo data?')) {
                loadSampleData();
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <RefreshCw size={15} />
            <span>Load Sample Data</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportData('json')}
            className="flex items-center justify-center gap-2 p-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl transition-colors"
          >
            <Download size={15} />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-2 p-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl transition-colors cursor-pointer">
            <Upload size={15} />
            <span>Restore Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Clear All Data */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to permanently clear ALL recorded expenses and budgets? This cannot be undone.'
                )
              ) {
                resetAllData();
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors"
          >
            <Trash2 size={15} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 5. Official App Branding & About */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <AppLogo size="xl" className="shrink-0" />
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">1Pavala</h4>
          <p className="text-xs text-slate-500 dark:text-[#8E8E93] leading-relaxed">
            Privacy-first personal expense tracking and budgeting. Inspired by the classic Pavala coin, engineered for simplicity, clarity, and complete financial sovereignty.
          </p>
          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400 dark:text-[#636366]">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Zero Cloud Tracking</span>
            <span>•</span>
            <span>100% On-Device</span>
          </div>
        </div>
      </div>
    </div>
  );
};
