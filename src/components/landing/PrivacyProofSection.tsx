import React from 'react';
import { ShieldCheck, HardDrive, Download, FileSpreadsheet } from 'lucide-react';

export const PrivacyProofSection: React.FC = () => {
  return (
    <section id="privacy" className="py-12 sm:py-20 px-3 sm:px-4 max-w-5xl mx-auto scroll-mt-20">
      <div className="rounded-2xl sm:rounded-3xl bg-brand-900 text-white p-6 sm:p-10 relative overflow-hidden border border-brand-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 sm:mb-5 border border-emerald-500/30">
            <ShieldCheck size={13} />
            <span>Our Non Negotiable Privacy Pledge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
            Your money data is yours alone
          </h2>
          <p className="text-xs sm:text-base text-emerald-100/80 mb-6 sm:mb-8 leading-relaxed">
            Unlike other apps that monetize through loans and behavioral targeting, 1Pavala has no servers to store your finances. Everything lives in your device browser storage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <HardDrive size={16} className="text-emerald-300 mb-2" />
              <p className="text-xs sm:text-sm font-bold text-white mb-0.5">IndexedDB engine</p>
              <p className="text-[11px] sm:text-xs text-emerald-100/70 leading-relaxed">
                Persistent local database protected against browser cache wipes.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <Download size={16} className="text-emerald-300 mb-2" />
              <p className="text-xs sm:text-sm font-bold text-white mb-0.5">One click export</p>
              <p className="text-[11px] sm:text-xs text-emerald-100/70 leading-relaxed">
                Download your full ledger as JSON or CSV anytime. No lock in.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <FileSpreadsheet size={16} className="text-emerald-300 mb-2" />
              <p className="text-xs sm:text-sm font-bold text-white mb-0.5">Zero trackers</p>
              <p className="text-[11px] sm:text-xs text-emerald-100/70 leading-relaxed">
                No third party analytics, no cookies, and no ad network scripts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
