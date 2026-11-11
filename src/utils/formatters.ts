export function formatCurrency(amount: number, symbol: string = '₹', forceDecimals: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Round to nearest 2 decimal places to avoid IEEE 754 precision issues
  const rounded = Number(absAmount.toFixed(2));
  // Show 2 decimal places if there is a decimal portion (paise) or if forceDecimals is explicitly requested
  const hasDecimals = !Number.isInteger(rounded);
  const fractionDigits = (hasDecimals || forceDecimals) ? 2 : 0;

  // Format with commas, handling Indian numbering system if currency is ₹
  const locale = symbol === '₹' ? 'en-IN' : 'en-US';
  const formattedNumber = rounded.toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  });

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
}

export function getCurrentMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getPreviousMonthKey(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);

  month -= 1;
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  return `${year}-${String(month).padStart(2, '0')}`;
}

export function getMonthLabel(monthKey: string): string {
  if (!monthKey || !monthKey.includes('-')) return '';
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getShortMonthLabel(monthKey: string): string {
  if (!monthKey || !monthKey.includes('-')) return '';
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(y, m - 1, d);
  compareDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - compareDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateId(): string {
  return 'exp_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
