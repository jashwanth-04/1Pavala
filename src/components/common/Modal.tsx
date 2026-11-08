import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Apple-style subtle dimming backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md apple-backdrop-fade"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Window Container (Never touches any edge on mobile or desktop) */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#1C1C1E] rounded-3xl sm:rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.9)] z-10 max-h-[85vh] sm:max-h-[88vh] flex flex-col overflow-hidden border border-black/[0.08] dark:border-white/[0.12] ring-1 ring-black/5 dark:ring-white/10 apple-window-pop`}
        role="dialog"
        aria-modal="true"
      >
        {/* Window Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] shrink-0">
          <div className="pr-3">
            <h3 className="text-base sm:text-lg font-extrabold text-[#1C1C1E] dark:text-white tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#8E8E93] mt-0.5 line-clamp-1 sm:line-clamp-none">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.16] rounded-full transition-all shrink-0 apple-pressable"
            aria-label="Close window"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        {/* Window Content Body (Scrollable with smooth feel) */}
        <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
};
