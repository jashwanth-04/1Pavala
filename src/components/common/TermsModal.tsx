import React, { useState } from 'react';
import { AppLogo } from './AppLogo';
import { ShieldCheck, HardDrive, Smartphone, FileSpreadsheet, CheckCircle2, ChevronRight, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onAccept,
  canDismiss = false,
  onClose,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAgreeAndProceed = () => {
    onAccept();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      <div className="apple-window-pop relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Hero */}
        <div className="p-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] text-center bg-black/[0.01] dark:bg-white/[0.02] shrink-0">
          <div className="flex justify-center mb-3">
            <AppLogo size="lg" showText={false} />
          </div>
          <h2 id="terms-title" className="text-xl sm:text-2xl font-black text-[#1C1C1E] dark:text-white tracking-tight">
            Terms &amp; Privacy Notice
          </h2>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-medium">
            Please review and accept our zero-trust commitments before using 1Pavala.
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* Card 1: 100% On-Device */}
          <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <HardDrive size={16} />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E] dark:text-white text-xs sm:text-sm">
                100% Local &amp; Private Storage
              </h4>
              <p className="text-[11px] sm:text-xs text-[#8E8E93] mt-0.5 leading-relaxed">
                All transactions, budgets, categories, and settings exist strictly on this device's internal IndexedDB storage. No data is ever transmitted to an external server.
              </p>
            </div>
          </div>

          {/* Card 2: No Bank Sync or SMS Scraping */}
          <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E] dark:text-white text-xs sm:text-sm">
                No Bank Feeds, PINs, or SMS Scraping
              </h4>
              <p className="text-[11px] sm:text-xs text-[#8E8E93] mt-0.5 leading-relaxed">
                1Pavala will never ask for your net banking credentials, OTPs, or SMS read permissions. You have complete manual autonomy over what you record.
              </p>
            </div>
          </div>

          {/* Card 3: User Responsibility & Backups */}
          <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileSpreadsheet size={16} />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E] dark:text-white text-xs sm:text-sm">
                Backup Responsibility
              </h4>
              <p className="text-[11px] sm:text-xs text-[#8E8E93] mt-0.5 leading-relaxed">
                Because there is zero cloud backup, your data is tied to this device. Please use the built-in <strong>JSON/CSV Export</strong> in Settings to take periodic offline backups.
              </p>
            </div>
          </div>

          {/* Card 4: Zero Tracking */}
          <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone size={16} />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E] dark:text-white text-xs sm:text-sm">
                Zero Ads &amp; Zero Behavioral Telemetry
              </h4>
              <p className="text-[11px] sm:text-xs text-[#8E8E93] mt-0.5 leading-relaxed">
                No advertising identifiers, no behavioral analytics scripts, and no monetized tracking pixels. 1Pavala is clean, open, and sovereign.
              </p>
            </div>
          </div>

          {/* Interactive Consent Checkbox (for first-time acceptance) */}
          {!canDismiss && (
            <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-md text-[#214B30] dark:text-[#34C759] border-black/20 dark:border-white/20 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[#1C1C1E] dark:text-white font-medium leading-tight">
                I understand that 1Pavala is a 100% offline, on-device app and I accept the Terms of Service and Privacy Notice.
              </span>
            </label>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
          {canDismiss ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-black/[0.06] dark:bg-white/[0.1] text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-white hover:bg-black/[0.1] transition-all apple-pressable"
            >
              Close
            </button>
          ) : (
            <button
              onClick={handleAgreeAndProceed}
              disabled={!hasAgreed}
              className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all apple-pressable shadow-sm ${
                hasAgreed
                  ? 'bg-[#214B30] dark:bg-[#34C759] text-white dark:text-[#061A0C] shadow-[#214B30]/30 cursor-pointer active:scale-98'
                  : 'bg-black/[0.08] dark:bg-white/[0.1] text-[#8E8E93] cursor-not-allowed opacity-60'
              }`}
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Agree &amp; Get Started</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
