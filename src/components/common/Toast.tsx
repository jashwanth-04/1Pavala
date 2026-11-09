import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2.5 sm:w-96 max-w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info size={18} className="text-emerald-200 shrink-0" />;

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />;
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} className="text-rose-300 shrink-0" />;
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} className="text-amber-300 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#214B30] text-white shadow-[0_12px_32px_-4px_rgba(19,43,28,0.5),0_4px_12px_rgba(0,0,0,0.15)] border border-white/20 text-xs sm:text-sm font-medium apple-toast-slide select-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <span className="text-white font-medium leading-snug break-words">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/75 hover:text-white p-1 rounded-lg hover:bg-white/10 active:scale-95 transition-all shrink-0 ml-1"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
