import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Expense, Category, Budget, UserSettings, ActiveTab, MonthlyStats } from '../types';
import { StorageService, DEFAULT_SETTINGS } from '../services/storage';
import { getCurrentMonthKey, getPreviousMonthKey, getMonthLabel, generateId } from '../utils/formatters';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // State
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  settings: UserSettings;
  activeTab: ActiveTab;
  selectedMonth: string;
  isExpenseModalOpen: boolean;
  editingExpense: Expense | null;
  toasts: ToastItem[];
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;

  // Actions
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
  setBudget: (month: string, amount: number, categoryBudgets?: Record<string, number>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  resetAllData: () => void;
  loadSampleData: () => void;
  importData: (jsonStr: string) => boolean;
  exportData: (format: 'json' | 'csv') => void;
  showToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;

  // Computed data
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

  // Theme state – persisted in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('1pavala_theme_v1') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Apply theme class to <html> root whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('1pavala_theme_v1', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((o) => !o);

  // Initialize storage
  useEffect(() => {
    const initData = StorageService.initData();
    setExpenses(initData.expenses);
    setCategories(initData.categories);
    setBudgets(initData.budgets);
    setSettings(initData.settings);
  }, []);

  const showToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const categoryMap = useMemo(() => {
    return new Map<string, Category>(categories.map((c) => [c.id, c]));
  }, [categories]);

  // Actions
  const openAddExpenseModal = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const openEditExpenseModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const addExpense = (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    showToast(`Added ${settings.currencySymbol}${data.amount} for ${categoryMap.get(data.categoryId)?.name || 'expense'}!`, 'success');
  };

  const updateExpense = (id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const now = new Date().toISOString();
    const updated = expenses.map((exp) => {
      if (exp.id === id) {
        return {
          ...exp,
          ...data,
          updatedAt: now,
        };
      }
      return exp;
    });

    setExpenses(updated);
    StorageService.saveExpenses(updated);
    showToast('Expense updated successfully!', 'success');
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    showToast(target ? `Deleted expense of ${settings.currencySymbol}${target.amount}` : 'Expense deleted', 'info');
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...catData,
      id: 'cat_' + catData.name.toLowerCase().replace(/\s+/g, '_'),
      isCustom: true,
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    StorageService.saveCategories(updated);
    showToast(`Category "${newCategory.name}" created!`, 'success');
  };

  const setBudget = (month: string, amount: number, categoryBudgets?: Record<string, number>) => {
    const existingIndex = budgets.findIndex((b) => b.month === month);
    let updated: Budget[];

    if (existingIndex >= 0) {
      updated = [...budgets];
      updated[existingIndex] = {
        ...updated[existingIndex],
        amount,
        categoryBudgets: categoryBudgets ?? updated[existingIndex].categoryBudgets,
      };
    } else {
      updated = [
        ...budgets,
        {
          id: generateId(),
          month,
          amount,
          categoryBudgets,
        },
      ];
    }

    setBudgets(updated);
    StorageService.saveBudgets(updated);
    showToast(`Monthly budget set to ${settings.currencySymbol}${amount.toLocaleString()}`, 'success');
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    showToast('Preferences updated', 'success');
  };

  const resetAllData = () => {
    StorageService.resetAllData();
    setExpenses([]);
    setCategories(StorageService.getCategories());
    setBudgets([]);
    setSettings(DEFAULT_SETTINGS);
    showToast('All expense and budget data cleared.', 'warning');
  };

  const loadSampleData = () => {
    const res = StorageService.loadSampleData();
    setExpenses(res.expenses);
    setCategories(res.categories);
    setBudgets(res.budgets);
    setSettings(res.settings);
    showToast('Loaded demo transactions and budgets!', 'success');
  };

  const importData = (jsonStr: string): boolean => {
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
  };

  const exportData = (format: 'json' | 'csv') => {
    const content = format === 'json' ? StorageService.exportToJson() : StorageService.exportToCsv();
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const filename = `1Pavala_expenses_${getCurrentMonthKey()}.${format}`;

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${format.toUpperCase()} file`, 'success');
  };

  // Helper calculation for any month
  const getMonthlyStats = (monthKey: string): MonthlyStats => {
    const monthExpenses = expenses.filter((e) => e.date.startsWith(monthKey));
    const totalSpent = monthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const expenseCount = monthExpenses.length;
    const averageExpense = expenseCount > 0 ? Math.round(totalSpent / expenseCount) : 0;

    // Largest expense
    let largestExpense: Expense | null = null;
    if (monthExpenses.length > 0) {
      largestExpense = monthExpenses.reduce((max, curr) => (curr.amount > max.amount ? curr : max), monthExpenses[0]);
    }

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.amount;
    });

    let highestCatEntry: { category: Category; amount: number; percentage: number } | null = null;
    let highestAmount = 0;
    let highestCatId = '';

    for (const [catId, sum] of Object.entries(categoryTotals)) {
      if (sum > highestAmount) {
        highestAmount = sum;
        highestCatId = catId;
      }
    }

    if (highestCatId && totalSpent > 0) {
      const catObj = categoryMap.get(highestCatId) || {
        id: highestCatId,
        name: highestCatId,
        icon: 'MoreHorizontal',
        color: '#64748b',
        bgLight: '#f1f5f9',
      };
      highestCatEntry = {
        category: catObj,
        amount: highestAmount,
        percentage: Math.round((highestAmount / totalSpent) * 100),
      };
    }

    // Budget
    const monthBudgetObj = budgets.find((b) => b.month === monthKey);
    const budget = monthBudgetObj ? monthBudgetObj.amount : (budgets[0]?.amount || 25000);
    const remainingBudget = budget - totalSpent;
    const budgetPercentage = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

    // Previous month comparison
    const prevMonthKey = getPreviousMonthKey(monthKey);
    const prevMonthExpenses = expenses.filter((e) => e.date.startsWith(prevMonthKey));
    const prevMonthSpent = prevMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    const monthOverMonthDiff = totalSpent - prevMonthSpent;
    let monthOverMonthPercentChange: number | null = null;
    if (prevMonthSpent > 0) {
      monthOverMonthPercentChange = Math.round(((totalSpent - prevMonthSpent) / prevMonthSpent) * 100);
    }

    return {
      month: monthKey,
      monthLabel: getMonthLabel(monthKey),
      totalSpent,
      expenseCount,
      highestCategory: highestCatEntry,
      largestExpense,
      averageExpense,
      budget,
      remainingBudget,
      budgetPercentage,
      prevMonthSpent,
      monthOverMonthDiff,
      monthOverMonthPercentChange,
    };
  };

  const currentMonthStats = useMemo(() => {
    return getMonthlyStats(selectedMonth);
  }, [selectedMonth, expenses, budgets, categoryMap]);

  return (
    <AppContext.Provider
      value={{
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
        setBudget,
        updateSettings,
        resetAllData,
        loadSampleData,
        importData,
        exportData,
        showToast,
        removeToast,
        currentMonthKey,
        categoryMap,
        getMonthlyStats,
        currentMonthStats,
      }}
    >
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
