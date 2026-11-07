import React from 'react';
import { ShieldCheck, HardDrive, Download, FileSpreadsheet } from 'lucide-react';

export const PrivacyProofSection: React.FC = () => {
  return (
    <section id="privacy" className="py-20 sm:py-28 px-4 max-w-5xl mx-auto scroll-mt-24">
      <div className="rounded-3xl bg-brand-900 text-white p-8 sm:p-12 relative overflow-hidden border border-brand-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 caption-1 mb-6 border border-emerald-500/30">
            <ShieldCheck size={14} />
            <span>Our Non Negotiable Privacy Pledge</span>
          </div>

          <h2 className="heading-3 sm:heading-2 font-bold mb-4 tracking-tight">
            Your money data is yours alone
          </h2>
          <p className="body-2 text-emerald-100/80 mb-8">
            Unlike other apps that monetize through loans and behavioral targeting, 1Pavala has no servers to store your finances. Everything lives in your device browser storage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <HardDrive size={18} className="text-emerald-300 mb-2" />
              <p className="title-4 font-bold text-white mb-1">IndexedDB engine</p>
              <p className="caption-2 text-emerald-100/70">
                Persistent local database protected against browser cache wipes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <Download size={18} className="text-emerald-300 mb-2" />
              <p className="title-4 font-bold text-white mb-1">One click export</p>
              <p className="caption-2 text-emerald-100/70">
                Download your full ledger as JSON or CSV anytime. No lock in.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <FileSpreadsheet size={18} className="text-emerald-300 mb-2" />
              <p className="title-4 font-bold text-white mb-1">Zero trackers</p>
              <p className="caption-2 text-emerald-100/70">
                No third party analytics, no cookies, and no ad network scripts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
