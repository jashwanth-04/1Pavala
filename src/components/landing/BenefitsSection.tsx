import React from 'react';
import { Zap, ShieldCheck, Gauge, HardDriveDownload } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Zap size={18} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Instant logging',
      description: 'Record any purchase in three seconds with quick categories and keyboard shortcuts.',
      metric: '3 sec',
      metricLabel: 'Average log time',
    },
    {
      icon: <ShieldCheck size={18} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Total financial privacy',
      description: 'Your expenses and budget stay strictly inside your phone browser using IndexedDB.',
      metric: '0 KB',
      metricLabel: 'Server uploads',
    },
    {
      icon: <Gauge size={18} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Pacing at a glance',
      description: 'See your real time remaining allowance and monthly consumption before buying.',
      metric: '100%',
      metricLabel: 'Glanceable pacing',
    },
    {
      icon: <HardDriveDownload size={18} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Complete offline independence',
      description: 'Functions flawlessly in flight mode with instant one click CSV and JSON backup export.',
      metric: 'Offline',
      metricLabel: 'PWA certified',
    },
  ];

  return (
    <section id="benefits" className="py-12 sm:py-20 px-3 sm:px-4 max-w-5xl mx-auto scroll-mt-20">
      <div className="text-center mb-8 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
          Designed for Clarity
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
          Everything you need to control spending
        </h2>
        <p className="text-xs sm:text-sm text-[#8E8E93] max-w-sm sm:max-w-lg mx-auto mt-1.5">
          Built from the ground up to eliminate clutter, protect privacy, and make personal budgeting second nature.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#181818] border border-black/[0.06] dark:border-white/[0.08] hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 flex items-center justify-center mb-4">
                {b.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-white mb-1.5">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-black/[0.04] dark:border-white/[0.06] flex items-baseline justify-between">
              <span className="text-[11px] sm:text-xs text-[#8E8E93]">{b.metricLabel}</span>
              <span className="text-base sm:text-lg text-brand-700 dark:text-emerald-400 font-bold tabular-nums">
                {b.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
