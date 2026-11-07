import React from 'react';
import { AppLogo } from '../common/AppLogo';
import { ShieldCheck, Heart } from 'lucide-react';

interface LandingFooterProps {
  onOpenApp: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenApp }) => {
  return (
    <footer className="py-12 px-4 bg-[#F2F2F7] dark:bg-[#131209] border-t border-black/[0.06] dark:border-white/[0.06] text-xs text-[#8E8E93] transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <AppLogo size="sm" showText={false} />
          <div>
            <p className="title-4 text-[#1C1C1E] dark:text-white font-bold">1Pavala</p>
            <p className="caption-4 text-[#8E8E93]">Private personal expense tracker</p>
          </div>
        </div>

        {/* Semantic nav links */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-5 caption-2 text-[#8E8E93]">
          <button
            onClick={onOpenApp}
            className="hover:text-[#1C1C1E] dark:hover:text-white transition-colors"
          >
            Launch Web App
          </button>
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
        <div className="flex items-center gap-1.5 text-brand-700 dark:text-emerald-400 caption-3">
          <ShieldCheck size={14} />
          <span>100% on device • No cloud servers</span>
        </div>

      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 caption-5 text-[#8E8E93]/70">
        <p>© {new Date().getFullYear()} 1Pavala. Free and open personal money management.</p>
        <p className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart size={11} className="text-red-500 fill-red-500" />
          <span>for financial peace of mind</span>
        </p>
      </div>
    </footer>
  );
};
