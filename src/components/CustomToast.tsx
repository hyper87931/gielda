import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from '../types';

interface CustomToastProps {
  toasts: ToastMessage[];
}

export const CustomToast: React.FC<CustomToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const border = t.type === 'success' ? 'border-success' : t.type === 'error' ? 'border-danger' : 'border-primary';
        const Icon = t.type === 'success' ? CheckCircle : t.type === 'error' ? AlertCircle : Info;
        const color = t.type === 'success' ? 'text-success' : t.type === 'error' ? 'text-danger' : 'text-primary';
        return (
          <div
            key={t.id}
            className={`bg-cardSec border-l-4 ${border} text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto transition transform`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-sm font-semibold">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
