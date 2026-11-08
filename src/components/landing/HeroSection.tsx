import React from 'react';
import { Plus, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  onStartTracking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTracking }) => {
  const { settings, theme } = useApp();

  return (
    <section className="relative pt-24 pb-14 sm:pt-36 sm:pb-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

        {/* Proof Badge Pill - Compact and clean on mobile */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-400/15 border border-brand-500/20 text-brand-700 dark:text-emerald-400 text-xs font-semibold mb-4 sm:mb-5">
          <ShieldCheck size={14} className="shrink-0" />
          <span className="sm:hidden">100% Private • Stays on your phone</span>
          <span className="hidden sm:inline">Zero cloud uploads • All data stays on your phone</span>
        </div>

        {/* B5 Hero Headline: Responsive scale so it never breaks into single-word lines on mobile */}
        <h1
          style={{ maxWidth: '640px' }}
          className={`text-[27px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] sm:leading-[1.15] mb-3.5 sm:mb-5 ${
            theme === 'dark' ? 'hero-gradient-text-dark' : 'hero-gradient-text-light'
          }`}
        >
          Master your monthly spending without giving up your privacy
        </h1>

        {/* Subheadline: Legible, uncluttered line wrapping */}
        <p
          style={{ maxWidth: '580px' }}
          className="text-xs sm:text-base text-[#8E8E93] dark:text-[#AEAEB2] leading-relaxed mb-6 sm:mb-8 px-1"
        >
          1Pavala is the clean, manual expense tracker that runs completely on your device. Zero bank credentials, zero advertisements, and zero monthly subscriptions.
        </p>

        {/* Single Primary CTA & Proof Line */}
        <div className="w-full max-w-xs sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-14">
          <button
            onClick={onStartTracking}
            className="w-full sm:w-auto bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white rounded-full text-sm sm:text-base font-semibold px-6 py-3.5 sm:px-8 sm:py-4 shadow-[0_4px_20px_rgba(33,75,48,0.35)] transition-all duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <span>Start tracking free</span>
            <ArrowRight size={17} />
          </button>

          <span className="text-[11px] sm:text-xs text-[#8E8E93]">
            No account needed • 100% offline ready
          </span>
        </div>

        {/* Hero Visual: Apple Squircle Interactive Card Preview */}
        <div className="w-full max-w-xl bg-white dark:bg-[#181818] rounded-2xl sm:rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-4 sm:p-7 text-left transition-all">
          
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.05] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
                Monthly budget status
              </span>
            </div>
            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              On track
            </span>
          </div>

          {/* Amount Balance */}
          <div className="my-3.5 sm:my-5 flex items-baseline justify-between gap-2">
            <div>
              <p className="text-[11px] sm:text-xs text-[#8E8E93]">Remaining balance</p>
              <h2 className="text-2xl sm:text-4xl text-[#1C1C1E] dark:text-white tabular-nums font-bold mt-0.5">
                {settings.currencySymbol}14,250
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[11px] sm:text-xs text-[#8E8E93]">Monthly target</p>
              <p className="text-sm sm:text-lg text-[#1C1C1E] dark:text-white tabular-nums font-semibold mt-0.5">
                {settings.currencySymbol}25,000
              </p>
            </div>
          </div>

          {/* Pacing Progress Bar */}
          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            <div className="h-2 sm:h-2.5 w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-700 dark:bg-emerald-500 transition-all duration-500"
                style={{ width: '43%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-[#8E8E93]">
              <span>43% consumed</span>
              <span>18 days remaining</span>
            </div>
          </div>

          {/* Live Action Row */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
            <button
              onClick={onStartTracking}
              className="bg-brand-700 text-white rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-brand-800 active:scale-98 transition-colors"
            >
              <Plus size={14} />
              <span>Record expense</span>
            </button>
            <div className="bg-black/[0.03] dark:bg-white/[0.06] rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-[#8E8E93]">Storage</span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#1C1C1E] dark:text-white">IndexedDB</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
