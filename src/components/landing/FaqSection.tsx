import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does 1Pavala connect to my bank account or read my SMS?',
      a: 'No. 1Pavala is strictly manual and private. It never asks for bank credentials, account numbers, or text message reading permissions.',
    },
    {
      q: 'Where is my financial data stored?',
      a: 'All your transactions, monthly targets, and settings are stored locally on your device using native browser IndexedDB and Web Storage. No data is ever sent to any remote server.',
    },
    {
      q: 'Will 1Pavala work without an internet connection?',
      a: 'Yes. 1Pavala is a certified Progressive Web App. It loads instantly and functions completely offline without any internet connection.',
    },
    {
      q: 'What happens if I clear my browser cache?',
      a: '1Pavala automatically requests persistent browser storage to shield your database from cache evictions. Additionally, you can export a complete JSON or CSV backup anytime with one tap.',
    },
    {
      q: 'Is there any subscription fee or hidden cost?',
      a: 'No. 1Pavala is free and open with zero recurring subscriptions, paywalls, or hidden charges.',
    },
    {
      q: 'Can I install 1Pavala on my Android or iPhone?',
      a: 'Yes. In Safari on iOS, tap Share and select "Add to Home Screen". On Chrome for Android, tap the three dots and select "Install app". It runs as a standalone app on your home screen.',
    },
    {
      q: 'Can I import my existing expenses from Excel or CSV?',
      a: 'Yes. You can import any previously exported CSV or JSON backup anytime directly from the Settings tab in seconds.',
    },
    {
      q: 'How does 1Pavala handle multiple currencies?',
      a: '1Pavala supports Indian Rupees, US Dollars, Euros, British Pounds, and custom currency symbols configurable in Settings.',
    },
  ];

  return (
    <section id="faq" className="py-12 sm:py-20 px-3 sm:px-4 max-w-3xl mx-auto scroll-mt-20">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-400/15 text-brand-700 dark:text-emerald-400 text-xs font-semibold mb-2.5">
          <HelpCircle size={13} />
          <span>Clear Answers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-xs sm:text-sm text-[#8E8E93] max-w-sm sm:max-w-md mx-auto mt-1.5">
          Everything you need to know about our privacy architecture and offline reliability.
        </p>
      </div>

      {/* Apple Inset Grouped Card Pattern: Unified, serene, and mobile-friendly */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#181818] border border-black/[0.06] dark:border-white/[0.08] divide-y divide-black/[0.05] dark:divide-white/[0.06] shadow-xs overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.q} className="transition-colors">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 text-left flex items-center justify-between gap-3 focus-visible:outline-hidden focus-visible:bg-black/[0.02] dark:focus-visible:bg-white/[0.04]"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm md:text-base font-semibold text-[#1C1C1E] dark:text-white leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#8E8E93] shrink-0 transition-transform duration-300 ease-base ${
                    isOpen ? 'rotate-180 text-brand-700 dark:text-emerald-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-4 pt-0.5 text-xs sm:text-sm text-[#8E8E93] dark:text-[#AEAEB2] leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
