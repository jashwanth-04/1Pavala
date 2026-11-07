import React from 'react';
import { XCircle, CheckCircle2, ShieldAlert, Lock } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <span className="caption-3 text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
          The Problem and Solution
        </span>
        <h2 className="heading-3 sm:heading-2 font-bold text-[#1C1C1E] dark:text-white">
          Why traditional finance apps fail you
        </h2>
        <p className="body-3 text-[#8E8E93] max-w-xl mx-auto mt-2">
          Most expense trackers demand your banking SMS access, sell your financial habits to advertisers, or lock basic reports behind monthly paywalls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Old Way Card */}
        <div className="p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#181818] border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-5">
            <ShieldAlert size={20} />
          </div>
          <h3 className="title-1 text-[#1C1C1E] dark:text-white font-bold mb-4">
            Cloud trackers and SMS scrapers
          </h3>
          <ul className="space-y-3.5 body-5 text-[#8E8E93]">
            <li className="flex items-start gap-2.5">
              <XCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
              <span>Demands full access to read your private text messages and OTPs</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
              <span>Stores your financial net worth and purchases on third party servers</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
              <span>Constant ads, upsells for loans, and recurring monthly subscriptions</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
              <span>Stops functioning the second your phone loses internet connection</span>
            </li>
          </ul>
        </div>

        {/* The 1Pavala Way Card */}
        <div className="p-7 rounded-3xl bg-brand-50/50 dark:bg-[#1F1F1F] border border-brand-500/20 dark:border-brand-500/30 shadow-xs relative">
          <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center mb-5">
            <Lock size={18} />
          </div>
          <h3 className="title-1 text-brand-900 dark:text-white font-bold mb-4">
            The 1Pavala approach
          </h3>
          <ul className="space-y-3.5 body-5 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="text-brand-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Zero SMS permissions, zero bank links, and zero telemetry tracking</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="text-brand-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>100% on device IndexedDB storage that never leaves your browser</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="text-brand-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Free forever with zero ads, clean manual input in under three seconds</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="text-brand-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Certified offline Progressive Web App that works completely off grid</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};
