import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartTracking: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartTracking }) => {
  return (
    <section className="py-24 sm:py-32 px-4 bg-white dark:bg-[#181818] border-t border-black/[0.04] dark:border-white/[0.06] text-center transition-colors">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-emerald-400 flex items-center justify-center mb-6">
          <ShieldCheck size={24} />
        </div>

        <h2 className="heading-3 sm:heading-2 font-bold text-[#1C1C1E] dark:text-white mb-4">
          Take back control of your spending today
        </h2>

        <p className="body-2 text-[#8E8E93] max-w-lg mb-8">
          Join thousands who manage their money with total privacy. No accounts to create, no bank logins, and no fees.
        </p>

        <button
          onClick={onStartTracking}
          className="button-lg bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white rounded-full px-8 py-4 shadow-[0_4px_24px_rgba(33,75,48,0.35)] transition-all duration-200 flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <span>Start tracking free</span>
          <ArrowRight size={18} />
        </button>

        <p className="caption-2 text-[#8E8E93] mt-4">
          Runs on all devices • Instantly offline ready • Free forever
        </p>
      </div>
    </section>
  );
};
