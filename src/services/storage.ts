import { Expense, Category, Budget, UserSettings } from '../types';
import { PREDEFINED_CATEGORIES, DEFAULT_MONTHLY_BUDGET } from '../constants/categories';
import { getCurrentMonthKey, getPreviousMonthKey, generateId } from '../utils/formatters';

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

// Realistic sample transactions for demonstration
export function generateSampleExpenses(): Expense[] {
  const currentMonth = getCurrentMonthKey();
  const prevMonth = getPreviousMonthKey(currentMonth);

  const sampleItems: Array<{
    amount: number;
    categoryId: string;
    dayOffset: number; // day of month
    isCurrentMonth: boolean;
    method: Expense['paymentMethod'];
    note: string;
  }> = [
    // Current month expenses
    { amount: 1450, categoryId: 'groceries', dayOffset: 1, isCurrentMonth: true, method: 'UPI', note: 'Weekly veggies & essentials from Blinkit' },
    { amount: 480, categoryId: 'food', dayOffset: 2, isCurrentMonth: true, method: 'UPI', note: 'Lunch with colleagues at Andhra Mess' },
    { amount: 220, categoryId: 'transportation', dayOffset: 3, isCurrentMonth: true, method: 'UPI', note: 'Metro card recharge' },
    { amount: 3500, categoryId: 'shopping', dayOffset: 4, isCurrentMonth: true, method: 'Credit card', note: 'Sneakers from Myntra Sale' },
    { amount: 650, categoryId: 'entertainment', dayOffset: 5, isCurrentMonth: true, method: 'UPI', note: 'Weekend movie tickets at PVR' },
    { amount: 1850, categoryId: 'bills', dayOffset: 6, isCurrentMonth: true, method: 'UPI', note: 'Electricity Bill (BESCOM)' },
    { amount: 850, categoryId: 'groceries', dayOffset: 7, isCurrentMonth: true, method: 'Debit card', note: 'Supermarket dairy & fruits' },
    { amount: 550, categoryId: 'healthcare', dayOffset: 8, isCurrentMonth: true, method: 'UPI', note: 'Apollo Pharmacy vitamins & cough syrup' },
    { amount: 320, categoryId: 'food', dayOffset: 9, isCurrentMonth: true, method: 'UPI', note: 'Dinner via Swiggy' },
    { amount: 1200, categoryId: 'transportation', dayOffset: 10, isCurrentMonth: true, method: 'Credit card', note: 'Petrol fill up at Indian Oil' },
    { amount: 999, categoryId: 'bills', dayOffset: 11, isCurrentMonth: true, method: 'UPI', note: 'Airtel Xstream Fiber Broadband' },
    { amount: 240, categoryId: 'food', dayOffset: 12, isCurrentMonth: true, method: 'Cash', note: 'Irani chai & snacks with friends' },
    { amount: 1750, categoryId: 'groceries', dayOffset: 13, isCurrentMonth: true, method: 'UPI', note: 'Monthly pantry staples & cooking oil' },
    { amount: 699, categoryId: 'entertainment', dayOffset: 14, isCurrentMonth: true, method: 'Credit card', note: 'OTT subscriptions bundle' },
    { amount: 150, categoryId: 'transportation', dayOffset: 15, isCurrentMonth: true, method: 'UPI', note: 'Auto rickshaw ride to station' },

    // Previous month expenses for rich month-over-month comparison
    { amount: 1800, categoryId: 'groceries', dayOffset: 2, isCurrentMonth: false, method: 'UPI', note: 'Monthly groceries' },
    { amount: 4200, categoryId: 'travel', dayOffset: 5, isCurrentMonth: false, method: 'Credit card', note: 'Train ticket booking IRCTC' },
    { amount: 890, categoryId: 'food', dayOffset: 8, isCurrentMonth: false, method: 'UPI', note: 'Family weekend dinner' },
    { amount: 1600, categoryId: 'bills', dayOffset: 10, isCurrentMonth: false, method: 'UPI', note: 'Electricity & water bill' },
    { amount: 2500, categoryId: 'shopping', dayOffset: 14, isCurrentMonth: false, method: 'Debit card', note: 'Festival clothing' },
    { amount: 1100, categoryId: 'transportation', dayOffset: 18, isCurrentMonth: false, method: 'Cash', note: 'Cab fares and fuel' },
    { amount: 600, categoryId: 'healthcare', dayOffset: 21, isCurrentMonth: false, method: 'UPI', note: 'Doctor consultation' },
    { amount: 1500, categoryId: 'education', dayOffset: 24, isCurrentMonth: false, method: 'Credit card', note: 'Online course enrollment' },
    { amount: 450, categoryId: 'entertainment', dayOffset: 27, isCurrentMonth: false, method: 'UPI', note: 'Movie outing' },
  ];

  return sampleItems.map((item, idx) => {
    const monthKey = item.isCurrentMonth ? currentMonth : prevMonth;
    const dayStr = String(item.dayOffset).padStart(2, '0');
    const dateStr = `${monthKey}-${dayStr}`;
    const nowIso = new Date().toISOString();

    return {
      id: `sample_${idx + 1}`,
      amount: item.amount,
      categoryId: item.categoryId,
      date: dateStr,
      paymentMethod: item.method,
      note: item.note,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  });
}

export const StorageService = {
  // Check if first time run, seed sample data
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
      const initialExpenses = generateSampleExpenses();
      const currentMonth = getCurrentMonthKey();
      const prevMonth = getPreviousMonthKey(currentMonth);

      const initialBudgets: Budget[] = [
        {
          id: generateId(),
          month: currentMonth,
          amount: DEFAULT_MONTHLY_BUDGET,
          categoryBudgets: {
            food: 6000,
            groceries: 7000,
            bills: 3500,
            shopping: 4000,
            transportation: 3000,
          },
        },
        {
          id: generateId(),
          month: prevMonth,
          amount: DEFAULT_MONTHLY_BUDGET,
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
    } catch {
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
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
  },

  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    Object.values(LEGACY_KEYS).forEach((k) => localStorage.removeItem(k));
  },

  loadSampleData(): {
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    settings: UserSettings;
  } {
    this.resetAllData();
    return this.initData();
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
