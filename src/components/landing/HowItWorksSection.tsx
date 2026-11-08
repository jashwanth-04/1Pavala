import React from 'react';
import { Target, PlusCircle, PieChart } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Set your monthly target',
      description: 'Enter your monthly budget limit in seconds. No bank logins, no KYC verification, and no card details needed.',
      icon: <Target size={20} className="text-brand-700 dark:text-emerald-400" />,
    },
    {
      step: '02',
      title: 'Log purchases in three seconds',
      description: 'Tap the quick record button or press N on your keyboard to record amount, category, and payment mode with zero friction.',
      icon: <PlusCircle size={20} className="text-brand-700 dark:text-emerald-400" />,
    },
    {
      step: '03',
      title: 'Keep your money on track',
      description: 'Review your glanceable remaining budget, category distributions, and daily burn rate with instant on device reports.',
      icon: <PieChart size={20} className="text-brand-700 dark:text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-20 px-3 sm:px-4 bg-white dark:bg-[#181818] border-y border-black/[0.04] dark:border-white/[0.06] scroll-mt-20 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
            Simplicity by Design
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
            Three steps to financial calm
          </h2>
          <p className="text-xs sm:text-sm text-[#8E8E93] max-w-sm sm:max-w-md mx-auto mt-1.5">
            No steep learning curves or complicated setup rituals. Start tracking in under thirty seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#F2F2F7] dark:bg-[#1F1F1F] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-white dark:bg-[#272727] flex items-center justify-center shadow-2xs">
                    {s.icon}
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#8E8E93]/40 tabular-nums">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-black/[0.05] dark:border-white/[0.08]">
                <span className="text-xs font-semibold text-brand-700 dark:text-emerald-400">
                  Ready instantly
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
