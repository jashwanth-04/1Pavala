import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <section id="faq" className="py-20 sm:py-28 px-4 max-w-3xl mx-auto scroll-mt-24">
      <div className="text-center mb-14">
        <span className="caption-3 text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
          Clear Answers
        </span>
        <h2 className="heading-3 sm:heading-2 font-bold text-[#1C1C1E] dark:text-white">
          Frequently asked questions
        </h2>
        <p className="body-3 text-[#8E8E93] max-w-md mx-auto mt-2">
          Everything you need to know about our privacy architecture and offline reliability.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="rounded-2xl bg-white dark:bg-[#181818] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700"
                aria-expanded={isOpen}
              >
                <span className="title-3 text-[#1C1C1E] dark:text-white font-semibold">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[#8E8E93] shrink-0 transition-transform duration-300 ease-base ${
                    isOpen ? 'rotate-180 text-brand-700 dark:text-emerald-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-[#8E8E93] body-5 border-t border-black/[0.04] dark:border-white/[0.06] animate-in fade-in duration-200">
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
