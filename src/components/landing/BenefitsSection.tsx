import React from 'react';
import { Zap, ShieldCheck, Gauge, HardDriveDownload } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Zap size={20} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Instant logging',
      description: 'Record any purchase in three seconds with quick categories and keyboard shortcuts.',
      metric: '3 sec',
      metricLabel: 'Average time to log',
    },
    {
      icon: <ShieldCheck size={20} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Total financial privacy',
      description: 'Your expenses and budget stay strictly inside your phone browser using IndexedDB.',
      metric: '0 KB',
      metricLabel: 'Data sent to servers',
    },
    {
      icon: <Gauge size={20} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Pacing at a glance',
      description: 'See your real time remaining allowance and monthly consumption before buying.',
      metric: '100%',
      metricLabel: 'Glanceable pacing',
    },
    {
      icon: <HardDriveDownload size={20} className="text-brand-700 dark:text-emerald-400" />,
      title: 'Complete offline independence',
      description: 'Functions flawlessly in flight mode with instant one click CSV and JSON backup export.',
      metric: 'Offline',
      metricLabel: 'Fully PWA certified',
    },
  ];

  return (
    <section id="benefits" className="py-20 sm:py-28 px-4 max-w-5xl mx-auto scroll-mt-24">
      <div className="text-center mb-14">
        <span className="caption-3 text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
          Designed for Clarity
        </span>
        <h2 className="heading-3 sm:heading-2 font-bold text-[#1C1C1E] dark:text-white">
          Everything you need to control spending
        </h2>
        <p className="body-3 text-[#8E8E93] max-w-lg mx-auto mt-2">
          Built from the ground up to eliminate clutter, protect privacy, and make personal budgeting second nature.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#181818] border border-black/[0.06] dark:border-white/[0.08] hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="title-2 text-[#1C1C1E] dark:text-white font-bold mb-2">
                {b.title}
              </h3>
              <p className="body-5 text-[#8E8E93]">
                {b.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/[0.04] dark:border-white/[0.06] flex items-baseline justify-between">
              <span className="caption-2 text-[#8E8E93]">{b.metricLabel}</span>
              <span className="title-2 text-brand-700 dark:text-emerald-400 font-bold tabular-nums">
                {b.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
