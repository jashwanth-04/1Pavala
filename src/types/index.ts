export type PaymentMethod = 'UPI' | 'Credit card' | 'Debit card' | 'Cash' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  note?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  isCustom?: boolean;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  amount: number;
  categoryBudgets?: Record<string, number>;
}

export interface UserSettings {
  currency: string;
  currencySymbol: string;
  thresholds: [number, number, number]; // e.g. [75, 90, 100]
  userName: string;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'insights' | 'budgeting' | 'summary' | 'settings';

export type SortField = 'date' | 'amount' | 'category';
export type SortOrder = 'asc' | 'desc';

export interface ExpenseFilter {
  searchQuery: string;
  categoryId: string;
  month: string; // YYYY-MM or 'ALL'
  paymentMethod: string; // PaymentMethod or 'ALL'
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface MonthlyStats {
  month: string;
  monthLabel: string;
  totalSpent: number;
  expenseCount: number;
  highestCategory: {
    category: Category;
    amount: number;
    percentage: number;
  } | null;
  largestExpense: Expense | null;
  averageExpense: number;
  budget: number;
  remainingBudget: number;
  budgetPercentage: number;
  prevMonthSpent: number;
  monthOverMonthDiff: number;
  monthOverMonthPercentChange: number | null;
}
