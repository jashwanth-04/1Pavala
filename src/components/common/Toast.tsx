import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let icon = <Info size={18} className="text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-slate-900 text-white border-l-4 border-emerald-500';
          icon = <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-slate-900 text-white border-l-4 border-red-500';
          icon = <AlertCircle size={18} className="text-red-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-slate-900 text-white border-l-4 border-amber-500';
          icon = <AlertTriangle size={18} className="text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl text-xs sm:text-sm font-medium transition-all transform animate-fade-in ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
