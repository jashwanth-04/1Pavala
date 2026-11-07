import React from 'react';
import { Target, PlusCircle, PieChart } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Set your monthly target',
      description: 'Enter your monthly budget limit in seconds. No bank logins, no KYC verification, and no card details needed.',
      icon: <Target size={22} className="text-brand-700 dark:text-emerald-400" />,
    },
    {
      step: '02',
      title: 'Log purchases in three seconds',
      description: 'Tap the quick record button or press N on your keyboard to record amount, category, and payment mode with zero friction.',
      icon: <PlusCircle size={22} className="text-brand-700 dark:text-emerald-400" />,
    },
    {
      step: '03',
      title: 'Keep your money on track',
      description: 'Review your glanceable remaining budget, category distributions, and daily burn rate with instant on device reports.',
      icon: <PieChart size={22} className="text-brand-700 dark:text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-white dark:bg-[#181818] border-y border-black/[0.04] dark:border-white/[0.06] scroll-mt-24 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="caption-3 text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
            Simplicity by Design
          </span>
          <h2 className="heading-3 sm:heading-2 font-bold text-[#1C1C1E] dark:text-white">
            Three steps to financial calm
          </h2>
          <p className="body-3 text-[#8E8E93] max-w-md mx-auto mt-2">
            No steep learning curves or complicated setup rituals. Start tracking in under thirty seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-7 rounded-3xl bg-[#F2F2F7] dark:bg-[#1F1F1F] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#272727] flex items-center justify-center shadow-2xs">
                    {s.icon}
                  </div>
                  <span className="heading-4 font-bold text-[#8E8E93]/40 tabular-nums">
                    {s.step}
                  </span>
                </div>
                <h3 className="title-1 text-[#1C1C1E] dark:text-white font-bold mb-2.5">
                  {s.title}
                </h3>
                <p className="body-5 text-[#8E8E93]">
                  {s.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/[0.05] dark:border-white/[0.08]">
                <span className="caption-3 text-brand-700 dark:text-emerald-400">
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
