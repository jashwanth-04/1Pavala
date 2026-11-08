import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { SpendingTrendChart } from '../charts/SpendingTrendChart';
import { MonthComparisonChart } from '../charts/MonthComparisonChart';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, getMonthLabel, getPreviousMonthKey } from '../../utils/formatters';
import {
  PieChart,
  TrendingUp,
  Scale,
  CreditCard,
  Calendar,
  CalendarDays,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
} from 'lucide-react';

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const InsightsView: React.FC = () => {
  const {
    expenses,
    categories,
    categoryMap,
    selectedMonth,
    settings,
    currentMonthStats,
  } = useApp();

  const [timeframe, setTimeframe] = useState<Timeframe>('daily');

  const [currentYear] = selectedMonth.split('-');
  const prevMonthKey = getPreviousMonthKey(selectedMonth);

  // 1. FILTERED EXPENSES BASED ON SELECTED TIMEFRAME
  const filteredExpenses = useMemo(() => {
    switch (timeframe) {
      case 'daily':
      case 'weekly':
        return expenses.filter((e) => e.date.startsWith(selectedMonth));
      case 'monthly':
        return expenses.filter((e) => e.date.startsWith(currentYear));
      case 'yearly':
        return expenses;
    }
  }, [expenses, selectedMonth, currentYear, timeframe]);

  const totalPeriodSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // 2. TIMEFRAME-SPECIFIC AGGREGATIONS

  // A. Daily Aggregation (Days of Month)
  const daysInMonth = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    return new Date(y, m, 0).getDate();
  }, [selectedMonth]);

  const dailyAverage = useMemo(() => {
    return daysInMonth > 0 ? Math.round(totalPeriodSpent / daysInMonth) : 0;
  }, [totalPeriodSpent, daysInMonth]);

  // B. Weekly Aggregation (Weeks of Selected Month: Week 1 to 5)
  const weeklyStats = useMemo(() => {
    const weeks = [
      { name: 'Week 1', label: 'Days 1–7',   amount: 0, count: 0 },
      { name: 'Week 2', label: 'Days 8–14',  amount: 0, count: 0 },
      { name: 'Week 3', label: 'Days 15–21', amount: 0, count: 0 },
      { name: 'Week 4', label: 'Days 22–28', amount: 0, count: 0 },
      { name: 'Week 5', label: 'Days 29–31', amount: 0, count: 0 },
    ];

    expenses
      .filter((e) => e.date.startsWith(selectedMonth))
      .forEach((exp) => {
        const day = parseInt(exp.date.split('-')[2], 10);
        if (day <= 7)       { weeks[0].amount += exp.amount; weeks[0].count += 1; }
        else if (day <= 14) { weeks[1].amount += exp.amount; weeks[1].count += 1; }
        else if (day <= 21) { weeks[2].amount += exp.amount; weeks[2].count += 1; }
        else if (day <= 28) { weeks[3].amount += exp.amount; weeks[3].count += 1; }
        else                { weeks[4].amount += exp.amount; weeks[4].count += 1; }
      });

    const activeWeeks = weeks.filter((w, idx) => idx < 4 || daysInMonth > 28);
    const maxWeekAmount = Math.max(...activeWeeks.map((w) => w.amount), 500);
    const avgWeekAmount = Math.round(totalPeriodSpent / activeWeeks.length);

    return {
      weeks: activeWeeks,
      maxWeekAmount,
      avgWeekAmount,
      highestWeek: [...activeWeeks].sort((a, b) => b.amount - a.amount)[0],
    };
  }, [expenses, selectedMonth, daysInMonth, totalPeriodSpent]);

  // C. Monthly Aggregation (12 Months of Current Year)
  const monthlyStats = useMemo(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthsData = monthNames.map((name, idx) => {
      const monthNum = String(idx + 1).padStart(2, '0');
      const key = `${currentYear}-${monthNum}`;
      return {
        key,
        name,
        amount: 0,
        count: 0,
        isCurrent: key === selectedMonth,
      };
    });

    expenses
      .filter((e) => e.date.startsWith(currentYear))
      .forEach((exp) => {
        const monthIdx = parseInt(exp.date.split('-')[1], 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          monthsData[monthIdx].amount += exp.amount;
          monthsData[monthIdx].count += 1;
        }
      });

    const maxMonthAmount = Math.max(...monthsData.map((m) => m.amount), 1000);
    const monthsWithSpend = monthsData.filter((m) => m.amount > 0).length || 1;
    const avgMonthAmount = Math.round(totalPeriodSpent / monthsWithSpend);
    const peakMonth = [...monthsData].sort((a, b) => b.amount - a.amount)[0];

    return {
      months: monthsData,
      maxMonthAmount,
      avgMonthAmount,
      peakMonth,
    };
  }, [expenses, currentYear, selectedMonth, totalPeriodSpent]);

  // D. Yearly Aggregation (Multi-Year)
  const yearlyStats = useMemo(() => {
    const yearMap: Record<string, { year: string; amount: number; count: number }> = {};

    expenses.forEach((exp) => {
      const y = exp.date.substring(0, 4);
      if (!yearMap[y]) {
        yearMap[y] = { year: y, amount: 0, count: 0 };
      }
      yearMap[y].amount += exp.amount;
      yearMap[y].count += 1;
    });

    const yearsList = Object.values(yearMap).sort((a, b) => a.year.localeCompare(b.year));
    if (yearsList.length === 0) {
      yearsList.push({ year: currentYear, amount: 0, count: 0 });
    }

    const maxYearAmount = Math.max(...yearsList.map((y) => y.amount), 5000);
    const avgYearAmount = Math.round(totalPeriodSpent / yearsList.length);
    const peakYear = [...yearsList].sort((a, b) => b.amount - a.amount)[0];

    return {
      years: yearsList,
      maxYearAmount,
      avgYearAmount,
      peakYear,
    };
  }, [expenses, currentYear, totalPeriodSpent]);

  // 3. CATEGORY BREAKDOWN FOR THE CHOSEN TIMEFRAME
  const categorySegments = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.amount;
    });

    if (totalPeriodSpent === 0) return [];

    return Object.entries(categoryTotals)
      .map(([catId, amount]) => {
        const cat = categoryMap.get(catId) || {
          id: catId,
          name: catId,
          icon: 'MoreHorizontal',
          color: '#64748b',
          bgLight: '#f1f5f9',
        };
        const percentage = Math.round((amount / totalPeriodSpent) * 100);
        return { category: cat, amount, percentage };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, totalPeriodSpent, categoryMap]);

  // 4. PAYMENT METHOD BREAKDOWN FOR THE CHOSEN TIMEFRAME
  const paymentMethodStats = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      const method = exp.paymentMethod || 'Other';
      totals[method] = (totals[method] || 0) + exp.amount;
    });

    return Object.entries(totals)
      .map(([method, amount]) => ({
        method,
        amount,
        percentage: totalPeriodSpent > 0 ? Math.round((amount / totalPeriodSpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, totalPeriodSpent]);

  // 5. DAY OF WEEK DISTRIBUTION (for Daily/Weekly)
  const dayOfWeekStats = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totals = [0, 0, 0, 0, 0, 0, 0];

    filteredExpenses.forEach((exp) => {
      const d = new Date(exp.date);
      const dayIdx = d.getDay();
      totals[dayIdx] += exp.amount;
    });

    const maxDayAmount = Math.max(...totals, 100);

    return dayNames.map((name, idx) => ({
      name,
      amount: totals[idx],
      percentOfMax: (totals[idx] / maxDayAmount) * 100,
      isWeekend: idx === 0 || idx === 6,
    }));
  }, [filteredExpenses]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* ========================================================
          1. HEADER WITH APPLE SEGMENTED TIMEFRAME SWITCHER
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1C1E] dark:text-white tracking-tight">
            Financial Insights
          </h2>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-0.5">
            Spending rhythm, velocity, and multi-period analytics
          </p>
        </div>

        {/* Timeframe Switcher: Daily, Weekly, Monthly, Yearly */}
        <div className="inline-flex p-1 rounded-2xl bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.04] dark:border-white/[0.06] overflow-x-auto no-scrollbar max-w-full">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTimeframe(mode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 capitalize whitespace-nowrap select-none ${
                timeframe === mode
                  ? 'bg-[#214B30] dark:bg-[#34C759] text-white dark:text-[#061A0C] shadow-sm'
                  : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          2. DYNAMIC EXECUTIVE METRICS STRIP (Adapts to Timeframe)
          ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Spent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            {timeframe === 'daily'   && `${getMonthLabel(selectedMonth)} Total`}
            {timeframe === 'weekly'  && `${getMonthLabel(selectedMonth)} Weekly Total`}
            {timeframe === 'monthly' && `${currentYear} Year-to-Date`}
            {timeframe === 'yearly'  && 'Lifetime Total'}
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-[#1C1C1E] dark:text-white mt-1 tabular-nums">
            {formatCurrency(totalPeriodSpent, settings.currencySymbol)}
          </p>
          <p className="text-[10px] sm:text-xs text-[#8E8E93] mt-0.5">
            {filteredExpenses.length} transactions
          </p>
        </div>

        {/* Metric 2: Burn Rate Average */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            {timeframe === 'daily'   && 'Daily Average'}
            {timeframe === 'weekly'  && 'Weekly Average'}
            {timeframe === 'monthly' && 'Monthly Average'}
            {timeframe === 'yearly'  && 'Annual Average'}
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-[#1C1C1E] dark:text-white mt-1 tabular-nums">
            {timeframe === 'daily'   && formatCurrency(dailyAverage, settings.currencySymbol)}
            {timeframe === 'weekly'  && formatCurrency(weeklyStats.avgWeekAmount, settings.currencySymbol)}
            {timeframe === 'monthly' && formatCurrency(monthlyStats.avgMonthAmount, settings.currencySymbol)}
            {timeframe === 'yearly'  && formatCurrency(yearlyStats.avgYearAmount, settings.currencySymbol)}
          </p>
          <p className="text-[10px] sm:text-xs text-[#8E8E93] mt-0.5">
            Estimated velocity
          </p>
        </div>

        {/* Metric 3: Peak Outflow */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            {timeframe === 'daily'   && 'Active Days'}
            {timeframe === 'weekly'  && 'Peak Week'}
            {timeframe === 'monthly' && 'Highest Month'}
            {timeframe === 'yearly'  && 'Peak Year'}
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-[#1C1C1E] dark:text-white mt-1 tabular-nums">
            {timeframe === 'daily'   && `${new Set(filteredExpenses.map((e) => e.date)).size} days`}
            {timeframe === 'weekly'  && (weeklyStats.highestWeek ? weeklyStats.highestWeek.name : '—')}
            {timeframe === 'monthly' && (monthlyStats.peakMonth ? monthlyStats.peakMonth.name : '—')}
            {timeframe === 'yearly'  && (yearlyStats.peakYear ? yearlyStats.peakYear.year : '—')}
          </p>
          <p className="text-[10px] sm:text-xs text-[#8E8E93] mt-0.5 truncate">
            {timeframe === 'weekly'  && formatCurrency(weeklyStats.highestWeek?.amount || 0, settings.currencySymbol)}
            {timeframe === 'monthly' && formatCurrency(monthlyStats.peakMonth?.amount || 0, settings.currencySymbol)}
            {timeframe === 'yearly'  && formatCurrency(yearlyStats.peakYear?.amount || 0, settings.currencySymbol)}
            {timeframe === 'daily'   && 'With recorded purchases'}
          </p>
        </div>

        {/* Metric 4: Lead Category or Pacing */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            Top Category
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-[#1C1C1E] dark:text-white mt-1 truncate">
            {categorySegments[0] ? categorySegments[0].category.name : '—'}
          </p>
          <p className="text-[10px] sm:text-xs text-[#8E8E93] mt-0.5">
            {categorySegments[0]
              ? `${categorySegments[0].percentage}% of total outflow`
              : 'No expenses'}
          </p>
        </div>
      </div>

      {/* ========================================================
          3. PRIMARY INTERACTIVE TREND CHART (Adapts to Timeframe)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart A: Dynamic Timeframe Trajectory */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-xs border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-brand-500/10 dark:bg-emerald-500/15 text-[#214B30] dark:text-[#34C759]">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white">
                  {timeframe === 'daily'   && 'Daily Spending Trajectory'}
                  {timeframe === 'weekly'  && 'Weekly Pacing & Breakdown'}
                  {timeframe === 'monthly' && `${currentYear} Monthly Trajectory`}
                  {timeframe === 'yearly'  && 'Annual Spending History'}
                </h3>
                <p className="text-xs text-[#8E8E93]">
                  {timeframe === 'daily'   && `Day-by-day rhythm for ${getMonthLabel(selectedMonth)}`}
                  {timeframe === 'weekly'  && `Week-by-week analysis for ${getMonthLabel(selectedMonth)}`}
                  {timeframe === 'monthly' && `12-month calendar progression for ${currentYear}`}
                  {timeframe === 'yearly'  && 'Multi-year financial comparison'}
                </p>
              </div>
            </div>

            {/* DAILY MODE: Day-by-Day Chart */}
            {timeframe === 'daily' && (
              <SpendingTrendChart
                expenses={expenses}
                monthKey={selectedMonth}
                currencySymbol={settings.currencySymbol}
              />
            )}

            {/* WEEKLY MODE: 5-Week Column Bars */}
            {timeframe === 'weekly' && (
              <div className="pt-2">
                <div className="h-44 w-full flex items-end justify-between gap-3 bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-4 border border-black/[0.04] dark:border-white/[0.06]">
                  {weeklyStats.weeks.map((w) => {
                    const heightPercent = weeklyStats.maxWeekAmount > 0
                      ? Math.max(8, (w.amount / weeklyStats.maxWeekAmount) * 100)
                      : 8;
                    const isZero = w.amount === 0;

                    return (
                      <div key={w.name} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div
                          className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                            isZero
                              ? 'bg-black/[0.06] dark:bg-white/[0.08] h-1.5'
                              : 'bg-[#214B30] dark:bg-[#34C759] group-hover:brightness-110 shadow-xs'
                          }`}
                          style={{ height: isZero ? '6px' : `${heightPercent}%` }}
                          title={`${w.name}: ${formatCurrency(w.amount, settings.currencySymbol)}`}
                        />
                        <span className="text-[11px] font-semibold text-[#1C1C1E] dark:text-white mt-2">
                          {w.name}
                        </span>
                        <span className="text-[10px] text-[#8E8E93] tabular-nums">
                          {formatCurrency(w.amount, settings.currencySymbol)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MONTHLY MODE: 12-Month Column Bars */}
            {timeframe === 'monthly' && (
              <div className="pt-2">
                <div className="h-44 w-full flex items-end justify-between gap-1.5 sm:gap-2 bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-3 sm:p-4 border border-black/[0.04] dark:border-white/[0.06] overflow-x-auto no-scrollbar">
                  {monthlyStats.months.map((m) => {
                    const heightPercent = monthlyStats.maxMonthAmount > 0
                      ? Math.max(6, (m.amount / monthlyStats.maxMonthAmount) * 100)
                      : 6;
                    const isZero = m.amount === 0;

                    return (
                      <div key={m.key} className="flex-1 min-w-[20px] flex flex-col items-center h-full justify-end group">
                        <div
                          className={`w-full max-w-[18px] rounded-t-lg transition-all duration-300 ${
                            m.isCurrent
                              ? 'bg-[#214B30] dark:bg-[#34C759] shadow-sm'
                              : isZero
                              ? 'bg-black/[0.05] dark:bg-white/[0.08] h-1'
                              : 'bg-black/30 dark:bg-white/30 group-hover:bg-[#214B30] dark:group-hover:bg-[#34C759]'
                          }`}
                          style={{ height: isZero ? '4px' : `${heightPercent}%` }}
                          title={`${m.name}: ${formatCurrency(m.amount, settings.currencySymbol)}`}
                        />
                        <span className={`text-[10px] sm:text-[11px] mt-2 font-medium ${
                          m.isCurrent
                            ? 'font-bold text-[#214B30] dark:text-[#34C759]'
                            : 'text-[#8E8E93]'
                        }`}>
                          {m.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* YEARLY MODE: Multi-Year Comparison */}
            {timeframe === 'yearly' && (
              <div className="pt-2">
                <div className="h-44 w-full flex items-end justify-around gap-4 bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-4 border border-black/[0.04] dark:border-white/[0.06]">
                  {yearlyStats.years.map((y) => {
                    const heightPercent = yearlyStats.maxYearAmount > 0
                      ? Math.max(10, (y.amount / yearlyStats.maxYearAmount) * 100)
                      : 10;

                    return (
                      <div key={y.year} className="flex-1 max-w-[70px] flex flex-col items-center h-full justify-end group">
                        <div
                          className="w-full rounded-t-xl bg-[#214B30] dark:bg-[#34C759] group-hover:brightness-110 shadow-sm transition-all duration-300"
                          style={{ height: `${heightPercent}%` }}
                          title={`${y.year}: ${formatCurrency(y.amount, settings.currencySymbol)}`}
                        />
                        <span className="text-xs font-bold text-[#1C1C1E] dark:text-white mt-2">
                          {y.year}
                        </span>
                        <span className="text-[10px] text-[#8E8E93] tabular-nums">
                          {formatCurrency(y.amount, settings.currencySymbol)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart B: Category Donut Chart (Adapts to Timeframe) */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-xs border border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white">
                Category Distribution
              </h3>
              <p className="text-xs text-[#8E8E93]">
                {timeframe === 'daily'   && `Categorized outflow for ${getMonthLabel(selectedMonth)}`}
                {timeframe === 'weekly'  && `Weekly category mix for ${getMonthLabel(selectedMonth)}`}
                {timeframe === 'monthly' && `Annual category distribution for ${currentYear}`}
                {timeframe === 'yearly'  && 'Lifetime category distribution'}
              </p>
            </div>
          </div>

          <CategoryDonutChart
            segments={categorySegments}
            totalSpent={totalPeriodSpent}
            currencySymbol={settings.currencySymbol}
          />
        </div>

      </div>

      {/* ========================================================
          4. SECONDARY ANALYTICS (Day of Week & Payment Channels)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Contextual Card A: Month-over-Month Comparison OR Day of Week */}
        {timeframe === 'monthly' ? (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-xs border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Scale size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white">
                  Month-over-Month Comparison
                </h3>
                <p className="text-xs text-[#8E8E93]">
                  Comparing {getMonthLabel(selectedMonth)} with {getMonthLabel(prevMonthKey)}
                </p>
              </div>
            </div>

            <MonthComparisonChart
              currentMonthKey={selectedMonth}
              previousMonthKey={prevMonthKey}
              expenses={expenses}
              categories={categories}
              currencySymbol={settings.currencySymbol}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-xs border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white">
                  Spending by Day of Week
                </h3>
                <p className="text-xs text-[#8E8E93]">Weekday vs weekend outflow flow</p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-4">
              {dayOfWeekStats.map((item) => (
                <div key={item.name} className="flex flex-col items-center">
                  <div className="h-28 w-full flex items-end justify-center bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-1 border border-black/[0.04] dark:border-white/[0.06]">
                    <div
                      className={`w-full rounded-lg transition-all duration-300 ${
                        item.isWeekend
                          ? 'bg-amber-500'
                          : 'bg-[#214B30] dark:bg-[#34C759]'
                      }`}
                      style={{
                        height: `${Math.max(8, item.percentOfMax)}%`,
                      }}
                      title={`${item.name}: ${formatCurrency(item.amount, settings.currencySymbol)}`}
                    />
                  </div>
                  <span
                    className={`text-xs mt-2 font-semibold ${
                      item.isWeekend
                        ? 'text-amber-600 font-bold'
                        : 'text-[#1C1C1E] dark:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#8E8E93] font-medium tabular-nums truncate max-w-[42px]">
                    {formatCurrency(item.amount, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card B: Payment Channel Breakdown (Adapts to Timeframe) */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-xs border border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-white">
                Payment Channel Breakdown
              </h3>
              <p className="text-xs text-[#8E8E93]">UPI, Cards, and Cash distribution</p>
            </div>
          </div>

          {paymentMethodStats.length === 0 ? (
            <p className="text-xs text-[#8E8E93] py-8 text-center">No payment data recorded</p>
          ) : (
            <div className="space-y-3.5 pt-1">
              {paymentMethodStats.map((item) => (
                <div key={item.method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-[#1C1C1E] dark:text-white">{item.method}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8E8E93] font-medium">{item.percentage}%</span>
                      <span className="font-bold text-[#1C1C1E] dark:text-white tabular-nums">
                        {formatCurrency(item.amount, settings.currencySymbol)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-black/[0.04] dark:bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#214B30] dark:bg-[#34C759] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
