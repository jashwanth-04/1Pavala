import React from 'react';
import { ArrowRight, ShieldCheck, Download } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartTracking: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartTracking }) => {
  const APK_DIRECT_URL = 'https://github.com/jashwanth-04/1Pavala/releases/latest/download/1Pavala.apk';

  return (
    <section className="py-14 sm:py-24 px-4 bg-white dark:bg-[#181818] border-t border-black/[0.04] dark:border-white/[0.06] text-center transition-colors">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-emerald-400 flex items-center justify-center mb-4 sm:mb-5">
          <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] dark:text-white mb-3 tracking-tight">
          Take back control of your spending today
        </h2>

        <p className="text-xs sm:text-base text-[#8E8E93] max-w-sm sm:max-w-lg mb-6 sm:mb-8 leading-relaxed">
          Join thousands who manage their money with total privacy. No accounts to create, no bank logins, and no fees.
        </p>

        {/* Action Pair: Launch Web App & Download Android APK */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartTracking}
            className="w-full sm:w-auto bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white rounded-full text-sm sm:text-base font-semibold px-7 py-3.5 sm:px-8 sm:py-4 shadow-[0_4px_24px_rgba(33,75,48,0.35)] transition-all duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <span>Launch Web App</span>
            <ArrowRight size={17} />
          </button>

          <a
            href="#download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] active:scale-[0.98] text-sm sm:text-base font-semibold text-[#1C1C1E] dark:text-white border border-black/[0.06] dark:border-white/[0.08] transition-all"
          >
            <Download size={16} />
            <span>Download Android APK</span>
          </a>
        </div>

        <p className="text-[11px] sm:text-xs text-[#8E8E93] mt-3 sm:mt-4">
          Runs on all devices • Instantly offline ready • Free forever
        </p>
      </div>
    </section>
  );
};
