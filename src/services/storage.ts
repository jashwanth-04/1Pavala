import { Expense, Category, Budget, UserSettings } from '../types';
import { PREDEFINED_CATEGORIES, DEFAULT_MONTHLY_BUDGET } from '../constants/categories';
import { getCurrentMonthKey, generateId } from '../utils/formatters';
import {
  idbGetExpenses,
  idbSaveExpenses,
  idbGetCategories,
  idbSaveCategories,
  idbGetBudgets,
  idbSaveBudgets,
  idbGetSettings,
  idbSaveSettings,
  idbClearAll,
  idbHasInitialized,
  idbSetInitialized,
} from './indexedDB';

export const STORAGE_KEYS = {
  EXPENSES: '1pavala_expenses_v1',
  CATEGORIES: '1pavala_categories_v1',
  BUDGETS: '1pavala_budgets_v1',
  SETTINGS: '1pavala_settings_v1',
  HAS_INITIALIZED: '1pavala_has_initialized_v1',
  THEME: '1pavala_theme_v1',
  TERMS_ACCEPTED: '1pavala_terms_accepted_v1',
  VIEW_MODE: '1pavala_view_mode',
} as const;

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  thresholds: [75, 90, 100],
  userName: 'User',
};

export const StorageService = {
  initData(): {
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    settings: UserSettings;
  } {
    const hasInit = localStorage.getItem(STORAGE_KEYS.HAS_INITIALIZED);

    if (!hasInit) {
      const initialExpenses: Expense[] = [];
      const currentMonth = getCurrentMonthKey();

      const initialBudgets: Budget[] = [
        {
          id: generateId(),
          month: currentMonth,
          amount: DEFAULT_MONTHLY_BUDGET,
          categoryBudgets: {},
        },
      ];

      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initialExpenses));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(PREDEFINED_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');

      return {
        expenses: initialExpenses,
        categories: PREDEFINED_CATEGORIES,
        budgets: initialBudgets,
        settings: DEFAULT_SETTINGS,
      };
    }

    return {
      expenses: this.getExpenses(),
      categories: this.getCategories(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
    };
  },

  getExpenses(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[1Pavala Storage] Failed to read expenses from localStorage:', e);
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('[1Pavala Storage] Failed to write expenses to localStorage:', e);
    }
    idbSaveExpenses(expenses).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write expenses to IndexedDB:', err);
    });
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : PREDEFINED_CATEGORIES;
    } catch (e) {
      console.error('[1Pavala Storage] Failed to read categories from localStorage:', e);
      return PREDEFINED_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('[1Pavala Storage] Failed to write categories to localStorage:', e);
    }
    idbSaveCategories(categories).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write categories to IndexedDB:', err);
    });
  },

  getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[1Pavala Storage] Failed to read budgets from localStorage:', e);
      return [];
    }
  },

  saveBudgets(budgets: Budget[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('[1Pavala Storage] Failed to write budgets to localStorage:', e);
    }
    idbSaveBudgets(budgets).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write budgets to IndexedDB:', err);
    });
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('[1Pavala Storage] Failed to read settings from localStorage:', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('[1Pavala Storage] Failed to write settings to localStorage:', e);
    }
    idbSaveSettings(settings).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write settings to IndexedDB:', err);
    });
  },

  getTheme(): 'light' | 'dark' {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  },

  setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('[1Pavala Storage] Failed to save theme:', e);
    }
  },

  getTermsAccepted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED) === 'true';
    } catch {
      return false;
    }
  },

  setTermsAccepted(accepted: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TERMS_ACCEPTED, accepted ? 'true' : 'false');
    } catch (e) {
      console.error('[1Pavala Storage] Failed to save terms accepted state:', e);
    }
  },

  getViewMode(): 'landing' | 'app' | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      return saved === 'app' || saved === 'landing' ? saved : null;
    } catch {
      return null;
    }
  },

  setViewMode(mode: 'landing' | 'app'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    } catch (e) {
      console.error('[1Pavala Storage] Failed to save view mode:', e);
    }
  },

  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    idbClearAll().catch((err) => {
      console.warn('[1Pavala Storage] Failed to clear IndexedDB:', err);
    });
  },

  async syncWithIndexedDB(): Promise<{
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    settings: UserSettings;
    restoredFromIndexedDB: boolean;
  }> {
    try {
      const [idbExpenses, idbCategories, idbBudgets, idbSettings, idbInitialized] = await Promise.all([
        idbGetExpenses(),
        idbGetCategories(),
        idbGetBudgets(),
        idbGetSettings(),
        idbHasInitialized(),
      ]);

      const localExpenses = this.getExpenses();
      const localCategories = this.getCategories();
      const localBudgets = this.getBudgets();
      const localSettings = this.getSettings();
      const hasLocalInit = localStorage.getItem(STORAGE_KEYS.HAS_INITIALIZED) === 'true';

      if (idbInitialized && (idbExpenses.length > 0 || !hasLocalInit)) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(idbExpenses));
        localStorage.setItem(
          STORAGE_KEYS.CATEGORIES,
          JSON.stringify(idbCategories.length > 0 ? idbCategories : PREDEFINED_CATEGORIES)
        );
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(idbBudgets));
        localStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(idbSettings || DEFAULT_SETTINGS)
        );
        localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');

        return {
          expenses: idbExpenses,
          categories: idbCategories.length > 0 ? idbCategories : PREDEFINED_CATEGORIES,
          budgets: idbBudgets,
          settings: idbSettings || DEFAULT_SETTINGS,
          restoredFromIndexedDB: true,
        };
      }

      if (hasLocalInit || localExpenses.length > 0) {
        await Promise.all([
          idbSaveExpenses(localExpenses),
          idbSaveCategories(localCategories),
          idbSaveBudgets(localBudgets),
          idbSaveSettings(localSettings),
          idbSetInitialized(),
        ]);

        return {
          expenses: localExpenses,
          categories: localCategories,
          budgets: localBudgets,
          settings: localSettings,
          restoredFromIndexedDB: false,
        };
      }

      const initialData = this.initData();
      await Promise.all([
        idbSaveExpenses(initialData.expenses),
        idbSaveCategories(initialData.categories),
        idbSaveBudgets(initialData.budgets),
        idbSaveSettings(initialData.settings),
        idbSetInitialized(),
      ]);

      return {
        ...initialData,
        restoredFromIndexedDB: false,
      };
    } catch (err) {
      console.warn('[1Pavala Storage] IndexedDB sync error, falling back to localStorage:', err);
      return {
        expenses: this.getExpenses(),
        categories: this.getCategories(),
        budgets: this.getBudgets(),
        settings: this.getSettings(),
        restoredFromIndexedDB: false,
      };
    }
  },

  exportToJson(): string {
    const data = {
      version: '1.0',
      appName: '1Pavala',
      exportedAt: new Date().toISOString(),
      expenses: this.getExpenses(),
      categories: this.getCategories(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  exportToCsv(): string {
    const expenses = this.getExpenses();
    const categories = this.getCategories();
    const catMap = new Map(categories.map((c) => [c.id, c.name]));

    const header = ['ID', 'Date', 'Category', 'Amount', 'Payment Method', 'Note', 'Created At'];
    const rows = expenses.map((exp) => [
      exp.id,
      exp.date,
      `"${catMap.get(exp.categoryId) || exp.categoryId}"`,
      exp.amount,
      `"${exp.paymentMethod || 'Other'}"`,
      `"${(exp.note || '').replace(/"/g, '""')}"`,
      exp.createdAt,
    ]);

    return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  importFromJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.expenses && Array.isArray(parsed.expenses)) {
        this.saveExpenses(parsed.expenses);
        if (parsed.categories && Array.isArray(parsed.categories)) {
          this.saveCategories(parsed.categories);
        }
        if (parsed.budgets && Array.isArray(parsed.budgets)) {
          this.saveBudgets(parsed.budgets);
        }
        if (parsed.settings) {
          this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        }
        localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.error('[1Pavala Storage] Failed to import JSON:', e);
      return false;
    }
  },
};
