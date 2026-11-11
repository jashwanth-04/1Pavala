import React from 'react';
import { AppLogo } from '../common/AppLogo';
import { ShieldCheck, Heart } from 'lucide-react';

interface LandingFooterProps {
  onOpenApp: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenApp }) => {
  return (
    <footer className="py-10 px-4 bg-[#F2F2F7] dark:bg-[#131209] border-t border-black/[0.06] dark:border-white/[0.06] text-xs text-[#8E8E93] transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <AppLogo size="sm" showText={false} />
          <div>
            <p className="text-sm font-bold text-[#1C1C1E] dark:text-white">1Pavala</p>
            <p className="text-[11px] text-[#8E8E93]">Private personal expense tracker</p>
          </div>
        </div>

        {/* Semantic nav links */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-4 text-xs text-[#8E8E93]">
          <button
            onClick={onOpenApp}
            className="hover:text-[#1C1C1E] dark:hover:text-white transition-colors"
          >
            Launch Web App
          </button>
          <a href="#download" className="hover:text-[#1C1C1E] dark:hover:text-white transition-colors font-medium text-brand-700 dark:text-emerald-400">
            Download APK
          </a>
          <a href="#privacy" className="hover:text-[#1C1C1E] dark:hover:text-white transition-colors">
            Privacy Pledge
          </a>
          <a href="#how-it-works" className="hover:text-[#1C1C1E] dark:hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#faq" className="hover:text-[#1C1C1E] dark:hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Security badge & note */}
        <div className="flex items-center gap-1.5 text-brand-700 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>100% on device • No cloud servers</span>
        </div>

      </div>

      <div className="max-w-5xl mx-auto mt-6 pt-5 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8E8E93]">
        <p>© {new Date().getFullYear()} 1Pavala. Free and open personal money management.</p>
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={11} className="text-red-500 fill-red-500" />
            <span>for financial peace of mind</span>
          </p>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#1C1C1E] dark:text-white">
            <span>Made with</span>
            <span className="text-emerald-500">✨</span>
            <span>by JK</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
