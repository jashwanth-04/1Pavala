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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Apple-style subtle dimming backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Sheet / Dialog Container */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#1C1C1E] rounded-t-[28px] sm:rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 max-h-[90vh] flex flex-col overflow-hidden transition-all border border-black/[0.05] dark:border-white/[0.08]`}
      >
        {/* Mobile iOS Sheet Grabber */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-9 h-1 rounded-full bg-black/20 dark:bg-white/20" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-3 sm:pt-5 pb-4 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-[#8E8E93] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.14] rounded-full transition-colors apple-pressable"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
