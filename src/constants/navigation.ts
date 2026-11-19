import { ActiveTab } from '../types';

export interface AppNavItem {
  id: ActiveTab;
  label: string;
  description: string;
  iconName: 'Home' | 'ReceiptText' | 'PieChart' | 'Target' | 'CalendarDays' | 'Settings';
}

export const APP_NAV_ITEMS: AppNavItem[] = [
  { id: 'dashboard',    label: 'Home',     description: 'Dashboard & summary', iconName: 'Home' },
  { id: 'transactions', label: 'Expenses', description: 'All transactions',     iconName: 'ReceiptText' },
  { id: 'insights',     label: 'Insights', description: 'Spending patterns',    iconName: 'PieChart' },
  { id: 'budgeting',    label: 'Budget',   description: 'Budget goals',         iconName: 'Target' },
  { id: 'summary',      label: 'Summary',  description: 'Monthly reports',      iconName: 'CalendarDays' },
  { id: 'settings',     label: 'Settings', description: 'Preferences',          iconName: 'Settings' },
];
