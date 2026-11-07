import React from 'react';
import { Plus, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  onStartTracking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTracking }) => {
  const { currentMonthStats, settings, theme } = useApp();

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

        {/* Proof Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-400/15 border border-brand-500/20 text-brand-700 dark:text-emerald-400 caption-1 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ShieldCheck size={14} className="shrink-0" />
          <span>Zero cloud uploads • All data stays on your phone</span>
        </div>

        {/* B5 Hero Headline: Max 680px with meaningful line breaks & gradient text */}
        <h1
          style={{ maxWidth: '680px' }}
          className={`heading-2 sm:heading-1 font-bold tracking-tight mb-5 ${
            theme === 'dark' ? 'hero-gradient-text-dark' : 'hero-gradient-text-light'
          }`}
        >
          Master your monthly spending without giving up your privacy
        </h1>

        {/* Subheadline: Max 680px */}
        <p
          style={{ maxWidth: '640px' }}
          className="body-2 sm:body-1 text-[#8E8E93] dark:text-[#AEAEB2] mb-8"
        >
          1Pavala is the clean, manual expense tracker that runs completely on your device. Zero bank credentials, zero advertisements, and zero monthly subscriptions.
        </p>

        {/* Single Primary CTA & Proof Line */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-14">
          <button
            onClick={onStartTracking}
            className="button-lg bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white rounded-full px-7 py-3.5 shadow-[0_4px_20px_rgba(33,75,48,0.35)] transition-all duration-200 flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <span>Start tracking free</span>
            <ArrowRight size={18} />
          </button>

          <span className="caption-2 text-[#8E8E93]">
            No account required • Instant offline setup
          </span>
        </div>

        {/* Hero Visual: Apple Squircle Interactive Card Preview */}
        <div className="w-full max-w-2xl bg-white dark:bg-[#181818] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 text-left transition-all">
          
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="caption-3 text-[#8E8E93] uppercase tracking-wider">
                Monthly budget status
              </span>
            </div>
            <span className="caption-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              On track
            </span>
          </div>

          {/* Amount Balance */}
          <div className="my-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <p className="caption-4 text-[#8E8E93]">Remaining balance</p>
              <h2 className="heading-3 sm:heading-2 text-[#1C1C1E] dark:text-white tabular-nums font-bold">
                {settings.currencySymbol}14,250
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="caption-4 text-[#8E8E93]">Monthly target</p>
              <p className="title-3 text-[#1C1C1E] dark:text-white tabular-nums font-semibold">
                {settings.currencySymbol}25,000
              </p>
            </div>
          </div>

          {/* Pacing Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="h-2.5 w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-700 dark:bg-emerald-500 transition-all duration-500"
                style={{ width: '43%' }}
              />
            </div>
            <div className="flex justify-between caption-4 text-[#8E8E93]">
              <span>43% consumed</span>
              <span>18 days remaining</span>
            </div>
          </div>

          {/* Live Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
            <button
              onClick={onStartTracking}
              className="button-sm bg-brand-700 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-sm hover:bg-brand-800 transition-colors"
            >
              <Plus size={15} />
              <span>Record expense</span>
            </button>
            <div className="bg-black/[0.03] dark:bg-white/[0.06] rounded-xl px-3 py-2 flex items-center justify-between">
              <span className="caption-2 text-[#8E8E93]">Storage</span>
              <span className="caption-3 text-[#1C1C1E] dark:text-white">IndexedDB (Local)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
