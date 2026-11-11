import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I download and install the Android APK on my mobile phone?',
      a: 'Scroll to the "Install on Android" section above and tap "Download APK (Direct)" or visit our GitHub Releases page. Once the 1Pavala.apk file finishes downloading, tap on it in your notification shade or Files/Downloads folder. If prompted to allow installations from your browser, toggle "Allow from this source" and tap "Install". The app will appear immediately on your device without requiring any Google Play account.',
    },
    {
      q: 'Why does Android show "File might be harmful" or "Install unknown apps"?',
      a: 'This is Android’s standard built-in security notice whenever an application package (.apk) is installed directly outside the official Google Play Store. Because 1Pavala is free and privacy-focused open source software that you download directly from our GitHub release repo, Google flags it as an "unknown source". 1Pavala contains zero advertising trackers, zero banking scrapers, and zero telemetry. It is completely safe to tap "Download anyway" and install.',
    },
    {
      q: 'How do I add the 1Pavala Quick Record widget to my home screen?',
      a: 'Once the APK is installed, go to your phone’s home screen. Touch and hold any empty area until the menu appears, then tap "Widgets". Scroll or search for "1Pavala", select the wide "Quick Record" capsule bar, and place it on your home screen. Tapping "Record" or "Recent" will open a fast, floating modal right over your wallpaper without having to open the full app.',
    },
    {
      q: 'Does 1Pavala connect to my bank account or read my SMS?',
      a: 'No. 1Pavala is strictly manual and private. It never asks for bank credentials, account numbers, or text message reading permissions.',
    },
    {
      q: 'Where is my financial data stored?',
      a: 'All your transactions, monthly targets, and settings are stored locally on your device using native on-device IndexedDB and Web Storage. No data is ever sent to any remote server.',
    },
    {
      q: 'Will 1Pavala work without an internet connection?',
      a: 'Yes. 1Pavala is built as an offline-first system. Both the Android APK and the Progressive Web App load instantly and function completely offline without any internet connection.',
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
      q: 'Can I install 1Pavala on my iPhone as well?',
      a: 'Yes. On Safari for iOS/iPadOS, tap the Share icon and select "Add to Home Screen". It installs as a standalone Progressive Web App with offline caching directly on your home screen.',
    },
    {
      q: 'Can I import my existing expenses from Excel or CSV?',
      a: 'Yes. You can import any previously exported CSV or JSON backup anytime directly from the Settings tab in seconds.',
    },
    {
      q: 'How does 1Pavala handle paise and decimals?',
      a: '1Pavala supports accurate decimal precision up to two decimal places (e.g., ₹65.52 or ₹120.75) while keeping clean whole integers (₹1,000) uncluttered without trailing zeroes.',
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
          Everything you need to know about APK installation, widgets, and our offline privacy guarantee.
        </p>
      </div>

      {/* Apple Inset Grouped Card Pattern */}
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
