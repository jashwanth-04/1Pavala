import { Expense, Category, Budget, UserSettings } from '../types';
import { PREDEFINED_CATEGORIES, DEFAULT_MONTHLY_BUDGET } from '../constants/categories';
import { getCurrentMonthKey, getPreviousMonthKey, generateId } from '../utils/formatters';
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

const STORAGE_KEYS = {
  EXPENSES: '1pavala_expenses_v1',
  CATEGORIES: '1pavala_categories_v1',
  BUDGETS: '1pavala_budgets_v1',
  SETTINGS: '1pavala_settings_v1',
  HAS_INITIALIZED: '1pavala_has_initialized_v1',
};

// Fallback legacy keys for smooth migration
const LEGACY_KEYS = {
  EXPENSES: '1pavan_expenses_v1',
  CATEGORIES: '1pavan_categories_v1',
  BUDGETS: '1pavan_budgets_v1',
  SETTINGS: '1pavan_settings_v1',
  HAS_INITIALIZED: '1pavan_has_initialized_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  thresholds: [75, 90, 100],
  userName: 'User',
};

export const StorageService = {
  // Initialize storage: starts with empty expenses (zero demo data)
  initData(): {
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    settings: UserSettings;
  } {
    // Check if new key exists
    let hasInit = localStorage.getItem(STORAGE_KEYS.HAS_INITIALIZED);

    // If legacy exists, migrate it
    if (!hasInit && localStorage.getItem(LEGACY_KEYS.HAS_INITIALIZED)) {
      const legExp = localStorage.getItem(LEGACY_KEYS.EXPENSES);
      const legCat = localStorage.getItem(LEGACY_KEYS.CATEGORIES);
      const legBud = localStorage.getItem(LEGACY_KEYS.BUDGETS);
      const legSet = localStorage.getItem(LEGACY_KEYS.SETTINGS);

      if (legExp) localStorage.setItem(STORAGE_KEYS.EXPENSES, legExp);
      if (legCat) localStorage.setItem(STORAGE_KEYS.CATEGORIES, legCat);
      if (legBud) localStorage.setItem(STORAGE_KEYS.BUDGETS, legBud);
      if (legSet) localStorage.setItem(STORAGE_KEYS.SETTINGS, legSet);
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      hasInit = 'true';
    }

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

    // Clean up any lingering sample/demo data from existing storage
    const storedExpenses = this.getExpenses();
    const cleanedExpenses = storedExpenses.filter((e) => !e.id.startsWith('sample_'));
    if (cleanedExpenses.length !== storedExpenses.length) {
      this.saveExpenses(cleanedExpenses);
    }

    // Clean up demo category budgets if still present
    const storedBudgets = this.getBudgets();
    let budgetsModified = false;
    const cleanedBudgets = storedBudgets.map((b) => {
      if (b.categoryBudgets && b.categoryBudgets.food === 6000 && b.categoryBudgets.groceries === 7000) {
        budgetsModified = true;
        return { ...b, categoryBudgets: {} };
      }
      return b;
    });
    if (budgetsModified) {
      this.saveBudgets(cleanedBudgets);
    }

    return {
      expenses: cleanedExpenses,
      categories: this.getCategories(),
      budgets: cleanedBudgets,
      settings: this.getSettings(),
    };
  },

  getExpenses(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    idbSaveExpenses(expenses).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write expenses to IndexedDB:', err);
    });
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : PREDEFINED_CATEGORIES;
    } catch {
      return PREDEFINED_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    idbSaveCategories(categories).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write categories to IndexedDB:', err);
    });
  },

  getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    idbSaveBudgets(budgets).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write budgets to IndexedDB:', err);
    });
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    idbSaveSettings(settings).catch((err) => {
      console.warn('[1Pavala Storage] Failed to write settings to IndexedDB:', err);
    });
  },

  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    Object.values(LEGACY_KEYS).forEach((k) => localStorage.removeItem(k));
    idbClearAll().catch((err) => {
      console.warn('[1Pavala Storage] Failed to clear IndexedDB:', err);
    });
  },

  /**
   * Two-way synchronization with IndexedDB:
   * 1. If localStorage was cleared (e.g. cache clear or reload), restores from IndexedDB!
   * 2. If IndexedDB is empty, seeds it from localStorage (seamless migration).
   */
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

      // SCENARIO 1: IndexedDB has records or was initialized, but localStorage is empty/wiped
      if (idbInitialized && (idbExpenses.length > 0 || !hasLocalInit)) {
        // Re-hydrate localStorage from persistent IndexedDB
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

      // SCENARIO 2: IndexedDB is empty, but localStorage has data (seed IndexedDB from localStorage)
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

      // SCENARIO 3: Both are fresh/empty
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
    const catMap = new Map(categories.map(c => [c.id, c.name]));

    const header = ['ID', 'Date', 'Category', 'Amount', 'Payment Method', 'Note', 'Created At'];
    const rows = expenses.map(exp => [
      exp.id,
      exp.date,
      `"${catMap.get(exp.categoryId) || exp.categoryId}"`,
      exp.amount,
      `"${exp.paymentMethod || 'Other'}"`,
      `"${(exp.note || '').replace(/"/g, '""')}"`,
      exp.createdAt,
    ]);

    return [header.join(','), ...rows.map(r => r.join(','))].join('\n');
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
      console.error('Failed to import JSON', e);
      return false;
    }
  },
};
