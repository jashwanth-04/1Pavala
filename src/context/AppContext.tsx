import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Expense, Category, Budget, UserSettings, ActiveTab, MonthlyStats } from '../types';
import { StorageService, DEFAULT_SETTINGS } from '../services/storage';
import { computeMonthlyStats, getAvailableMonths } from '../services/finance';
import { DEFAULT_MONTHLY_BUDGET } from '../constants/categories';
import { getCurrentMonthKey, generateId } from '../utils/formatters';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  settings: UserSettings;
  activeTab: ActiveTab;
  selectedMonth: string;
  availableMonths: string[];
  isExpenseModalOpen: boolean;
  editingExpense: Expense | null;
  toasts: ToastItem[];
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;

  setActiveTab: (tab: ActiveTab) => void;
  setSelectedMonth: (month: string) => void;
  openAddExpenseModal: () => void;
  openEditExpenseModal: (expense: Expense) => void;
  closeExpenseModal: () => void;
  toggleTheme: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteExpense: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  setBudget: (month: string, amount: number, categoryBudgets?: Record<string, number>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;

  resetAllData: () => void;
  importData: (jsonStr: string) => boolean;
  exportData: (format: 'json' | 'csv') => void;
  showToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;

  currentMonthKey: string;
  categoryMap: Map<string, Category>;
  getMonthlyStats: (monthKey: string) => MonthlyStats;
  currentMonthStats: MonthlyStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getTheme());

  const applyThemeToDOM = useCallback((currentTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', currentTheme === 'dark' ? '#000000' : '#214B30');
    }
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme);
    StorageService.setTheme(theme);
  }, [theme, applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyThemeToDOM(next);
      return next;
    });
  }, [applyThemeToDOM]);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((o) => !o), []);

  useEffect(() => {
    const initData = StorageService.initData();
    setExpenses(initData.expenses);
    setCategories(initData.categories);
    setBudgets(initData.budgets);
    setSettings(initData.settings);

    StorageService.syncWithIndexedDB().then((synced) => {
      if (synced) {
        setExpenses(synced.expenses);
        setCategories(synced.categories);
        setBudgets(synced.budgets);
        setSettings(synced.settings);
      }
    });
  }, []);

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const categoryMap = useMemo(() => {
    return new Map<string, Category>(categories.map((c) => [c.id, c]));
  }, [categories]);

  const openAddExpenseModal = useCallback(() => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  }, []);

  const openEditExpenseModal = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  }, []);

  const closeExpenseModal = useCallback(() => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  }, []);

  const addExpense = useCallback((data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    setExpenses((prev) => {
      const updated = [newExpense, ...prev];
      StorageService.saveExpenses(updated);
      return updated;
    });
    showToast(`Added ${settings.currencySymbol}${data.amount} for ${categoryMap.get(data.categoryId)?.name || 'expense'}!`, 'success');
  }, [categoryMap, settings.currencySymbol, showToast]);

  const updateExpense = useCallback((id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const now = new Date().toISOString();
    setExpenses((prev) => {
      const updated = prev.map((exp) => {
        if (exp.id === id) {
          return { ...exp, ...data, updatedAt: now };
        }
        return exp;
      });
      StorageService.saveExpenses(updated);
      return updated;
    });
    showToast('Expense updated successfully!', 'success');
  }, [showToast]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const target = prev.find((e) => e.id === id);
      const updated = prev.filter((exp) => exp.id !== id);
      StorageService.saveExpenses(updated);
      showToast(target ? `Deleted expense of ${settings.currencySymbol}${target.amount}` : 'Expense deleted', 'info');
      return updated;
    });
  }, [settings.currencySymbol, showToast]);

  const addCategory = useCallback((catData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...catData,
      id: 'cat_' + catData.name.toLowerCase().replace(/\s+/g, '_'),
      isCustom: true,
    };
    setCategories((prev) => {
      const updated = [...prev, newCategory];
      StorageService.saveCategories(updated);
      return updated;
    });
    showToast(`Category "${newCategory.name}" created!`, 'success');
  }, [showToast]);

  const updateCategory = useCallback((id: string, catData: Partial<Omit<Category, 'id'>>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...catData,
            bgLight: catData.color ? `${catData.color}20` : c.bgLight,
          };
        }
        return c;
      });
      StorageService.saveCategories(updated);
      return updated;
    });
    showToast('Category updated successfully!', 'success');
  }, [showToast]);

  const deleteCategory = useCallback((id: string) => {
    const targetCat = categories.find((c) => c.id === id);
    if (!targetCat) return;

    const fallbackCatId = categories.find((c) => c.id === 'other')?.id || categories[0]?.id || 'other';

    const updatedCategories = categories.filter((c) => c.id !== id);
    setCategories(updatedCategories);
    StorageService.saveCategories(updatedCategories);

    let remappedCount = 0;
    const now = new Date().toISOString();
    const updatedExpenses = expenses.map((e) => {
      if (e.categoryId === id) {
        remappedCount++;
        return { ...e, categoryId: fallbackCatId, updatedAt: now };
      }
      return e;
    });

    if (remappedCount > 0) {
      setExpenses(updatedExpenses);
      StorageService.saveExpenses(updatedExpenses);
    }

    const updatedBudgets = budgets.map((b) => {
      if (b.categoryBudgets && b.categoryBudgets[id]) {
        const newCatBudgets = { ...b.categoryBudgets };
        delete newCatBudgets[id];
        return { ...b, categoryBudgets: newCatBudgets };
      }
      return b;
    });
    setBudgets(updatedBudgets);
    StorageService.saveBudgets(updatedBudgets);

    showToast(
      remappedCount > 0
        ? `Deleted "${targetCat.name}" (${remappedCount} expense${remappedCount > 1 ? 's' : ''} moved)`
        : `Category "${targetCat.name}" deleted`,
      'success'
    );
  }, [categories, expenses, budgets, showToast]);

  const setBudget = useCallback((month: string, amount: number, categoryBudgets?: Record<string, number>) => {
    setBudgets((prev) => {
      const existingIndex = prev.findIndex((b) => b.month === month);
      let updated: Budget[];

      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount,
          categoryBudgets: categoryBudgets ?? updated[existingIndex].categoryBudgets,
        };
      } else {
        updated = [
          ...prev,
          {
            id: generateId(),
            month,
            amount,
            categoryBudgets,
          },
        ];
      }

      StorageService.saveBudgets(updated);
      return updated;
    });
    showToast(`Monthly budget set to ${settings.currencySymbol}${amount.toLocaleString()}`, 'success');
  }, [settings.currencySymbol, showToast]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
    showToast('Preferences updated', 'success');
  }, [showToast]);

  const resetAllData = useCallback(() => {
    StorageService.resetAllData();
    setExpenses([]);
    setCategories(StorageService.getCategories());
    setBudgets([]);
    setSettings(DEFAULT_SETTINGS);
    showToast('All expense and budget data cleared.', 'warning');
  }, [showToast]);

  const importData = useCallback((jsonStr: string): boolean => {
    const success = StorageService.importFromJson(jsonStr);
    if (success) {
      setExpenses(StorageService.getExpenses());
      setCategories(StorageService.getCategories());
      setBudgets(StorageService.getBudgets());
      setSettings(StorageService.getSettings());
      showToast('Data imported successfully!', 'success');
      return true;
    } else {
      showToast('Failed to import: Invalid JSON file format', 'error');
      return false;
    }
  }, [showToast]);

  const exportData = useCallback(async (format: 'json' | 'csv') => {
    const content = format === 'json' ? StorageService.exportToJson() : StorageService.exportToCsv();
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const filename = `1Pavala_expenses_${getCurrentMonthKey()}.${format}`;

    if (
      typeof (window as any).AndroidExportBridge !== 'undefined' &&
      typeof (window as any).AndroidExportBridge.exportFile === 'function'
    ) {
      try {
        const savedPath = (window as any).AndroidExportBridge.exportFile(filename, content, mime);
        if (savedPath) {
          showToast(`Saved to ${savedPath}`, 'success');
          return;
        }
      } catch (e) {
        console.error('[1Pavala Export] AndroidExportBridge error:', e);
      }
    }

    if (navigator.canShare && typeof navigator.share === 'function') {
      try {
        const file = new File([content], filename, { type: mime });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: `1Pavala ${format.toUpperCase()} Backup`,
          });
          showToast(`Exported ${format.toUpperCase()} file`, 'success');
          return;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('[1Pavala Export] Web Share API failed:', err);
      }
    }

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: format === 'json' ? 'JSON Backup' : 'CSV Spreadsheet',
              accept: { [mime]: [`.${format}`] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        showToast(`Saved ${filename}`, 'success');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('[1Pavala Export] FilePicker failed:', err);
      }
    }

    try {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.requestAnimationFrame(() => URL.revokeObjectURL(url));
      showToast(`Exported ${format.toUpperCase()} file`, 'success');
    } catch (err) {
      console.error('[1Pavala Export] Blob download failed:', err);
      showToast('Export failed. Please check permissions.', 'error');
    }
  }, [showToast]);

  const availableMonths = useMemo(() => {
    return getAvailableMonths(expenses, getCurrentMonthKey());
  }, [expenses]);

  const getMonthlyStats = useCallback((monthKey: string): MonthlyStats => {
    const monthBudgetObj = budgets.find((b) => b.month === monthKey);
    const budget = monthBudgetObj ? monthBudgetObj.amount : (budgets[0]?.amount || DEFAULT_MONTHLY_BUDGET);
    return computeMonthlyStats(expenses, monthKey, budget, categoryMap);
  }, [budgets, expenses, categoryMap]);

  const currentMonthStats = useMemo(() => {
    return getMonthlyStats(selectedMonth);
  }, [getMonthlyStats, selectedMonth]);

  const contextValue = useMemo<AppContextType>(() => ({
    expenses,
    categories,
    budgets,
    settings,
    activeTab,
    selectedMonth,
    availableMonths,
    isExpenseModalOpen,
    editingExpense,
    toasts,
    theme,
    isSidebarOpen,
    setActiveTab,
    setSelectedMonth,
    openAddExpenseModal,
    openEditExpenseModal,
    closeExpenseModal,
    toggleTheme,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    setBudget,
    updateSettings,
    resetAllData,
    importData,
    exportData,
    showToast,
    removeToast,
    currentMonthKey,
    categoryMap,
    getMonthlyStats,
    currentMonthStats,
  }), [
    expenses,
    categories,
    budgets,
    settings,
    activeTab,
    selectedMonth,
    isExpenseModalOpen,
    editingExpense,
    toasts,
    theme,
    isSidebarOpen,
    setActiveTab,
    setSelectedMonth,
    openAddExpenseModal,
    openEditExpenseModal,
    closeExpenseModal,
    toggleTheme,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    setBudget,
    updateSettings,
    resetAllData,
    importData,
    exportData,
    showToast,
    removeToast,
    currentMonthKey,
    categoryMap,
    getMonthlyStats,
    currentMonthStats,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
