import { Category } from '../types';

export const PREDEFINED_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food',
    icon: 'UtensilsCrossed',
    color: '#f97316', // Orange
    bgLight: '#ffedd5',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: 'ShoppingCart',
    color: '#10b981', // Emerald
    bgLight: '#d1fae5',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: 'Car',
    color: '#0284c7', // Sky blue
    bgLight: '#e0f2fe',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#8b5cf6', // Purple
    bgLight: '#ede9fe',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Film',
    color: '#ec4899', // Pink
    bgLight: '#fce7f3',
  },
  {
    id: 'bills',
    name: 'Bills',
    icon: 'Zap',
    color: '#eab308', // Amber
    bgLight: '#fef3c7',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'HeartPulse',
    color: '#ef4444', // Red
    bgLight: '#fee2e2',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#6366f1', // Indigo
    bgLight: '#e0e7ff',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'Plane',
    color: '#14b8a6', // Teal
    bgLight: '#ccfbf1',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'MoreHorizontal',
    color: '#64748b', // Slate
    bgLight: '#f1f5f9',
  },
];

export const PAYMENT_METHODS = [
  'UPI',
  'Credit card',
  'Debit card',
  'Cash',
  'Other',
] as const;

export const DEFAULT_MONTHLY_BUDGET = 25000; // ₹25,000 default INR budget
