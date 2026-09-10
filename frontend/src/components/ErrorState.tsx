import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 bg-rose-50/50 text-rose-900 ${className}`}
    >
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-rose-100 text-rose-600 mb-3">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold mb-1 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-slate-300"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          Try Again
        </button>
      )}
    </div>
  );
};
