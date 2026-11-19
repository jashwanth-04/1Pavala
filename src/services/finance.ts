import { Expense, Category, MonthlyStats } from '../types';
import { getMonthLabel, getPreviousMonthKey } from '../utils/formatters';
import { DEFAULT_MONTHLY_BUDGET } from '../constants/categories';

const FALLBACK_CATEGORY_ICON = 'MoreHorizontal';
const FALLBACK_CATEGORY_COLOR = '#64748b';
const FALLBACK_CATEGORY_BG = '#f1f5f9';

function getFallbackCategory(catId: string): Category {
  return {
    id: catId,
    name: catId,
    icon: FALLBACK_CATEGORY_ICON,
    color: FALLBACK_CATEGORY_COLOR,
    bgLight: FALLBACK_CATEGORY_BG,
  };
}

export function getAvailableMonths(expenses: Expense[], currentMonthKey: string): string[] {
  const monthSet = new Set<string>();
  monthSet.add(currentMonthKey);
  monthSet.add(getPreviousMonthKey(currentMonthKey));

  for (const exp of expenses) {
    if (exp.date && exp.date.length >= 7) {
      monthSet.add(exp.date.substring(0, 7));
    }
  }

  return Array.from(monthSet).sort().reverse();
}

export interface CategoryAggregate {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export function aggregateCategoryTotals(
  expenses: Expense[],
  categoryMap: Map<string, Category>,
  totalSpent?: number
): CategoryAggregate[] {
  const totals: Record<string, number> = {};
  const counts: Record<string, number> = {};

  let computedTotal = 0;
  for (const exp of expenses) {
    totals[exp.categoryId] = Number(((totals[exp.categoryId] || 0) + exp.amount).toFixed(2));
    counts[exp.categoryId] = (counts[exp.categoryId] || 0) + 1;
    computedTotal += exp.amount;
  }

  const effectiveTotal = typeof totalSpent === 'number' ? totalSpent : Number(computedTotal.toFixed(2));

  return Object.entries(totals)
    .map(([catId, amount]) => {
      const category = categoryMap.get(catId) || getFallbackCategory(catId);
      const percentage = effectiveTotal > 0 ? Math.round((amount / effectiveTotal) * 100) : 0;
      return {
        category,
        amount: Number(amount.toFixed(2)),
        percentage,
        count: counts[catId] || 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function computeMonthlyStats(
  expenses: Expense[],
  monthKey: string,
  budgetAmount: number,
  categoryMap: Map<string, Category>
): MonthlyStats {
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthKey));
  const totalSpent = Number(monthExpenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2));
  const expenseCount = monthExpenses.length;
  const averageExpense = expenseCount > 0 ? Number((totalSpent / expenseCount).toFixed(2)) : 0;

  let largestExpense: Expense | null = null;
  if (monthExpenses.length > 0) {
    largestExpense = monthExpenses.reduce(
      (max, curr) => (curr.amount > max.amount ? curr : max),
      monthExpenses[0]
    );
  }

  const aggregates = aggregateCategoryTotals(monthExpenses, categoryMap, totalSpent);
  const highestCategory = aggregates.length > 0
    ? {
        category: aggregates[0].category,
        amount: aggregates[0].amount,
        percentage: aggregates[0].percentage,
      }
    : null;

  const budget = budgetAmount > 0 ? budgetAmount : DEFAULT_MONTHLY_BUDGET;
  const remainingBudget = Number((budget - totalSpent).toFixed(2));
  const budgetPercentage = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  const prevMonthKey = getPreviousMonthKey(monthKey);
  const prevMonthExpenses = expenses.filter((e) => e.date.startsWith(prevMonthKey));
  const prevMonthSpent = Number(
    prevMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)
  );

  const monthOverMonthDiff = Number((totalSpent - prevMonthSpent).toFixed(2));
  let monthOverMonthPercentChange: number | null = null;
  if (prevMonthSpent > 0) {
    monthOverMonthPercentChange = Math.round(
      ((totalSpent - prevMonthSpent) / prevMonthSpent) * 100
    );
  }

  return {
    month: monthKey,
    monthLabel: getMonthLabel(monthKey),
    totalSpent,
    expenseCount,
    highestCategory,
    largestExpense,
    averageExpense,
    budget,
    remainingBudget,
    budgetPercentage,
    prevMonthSpent,
    monthOverMonthDiff,
    monthOverMonthPercentChange,
  };
}
