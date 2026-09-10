import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  total?: number;
  completed?: number;
  showText?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  completed,
  showText = true,
  className,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {showText && (
        <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>
            {completed !== undefined && total !== undefined
              ? `${completed} dari ${total} task selesai`
              : 'Progres Penyelesaian'}
          </span>
          <span className="font-semibold text-slate-700">{clampedProgress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            clampedProgress === 100
              ? 'bg-emerald-500'
              : clampedProgress > 40
              ? 'bg-indigo-600'
              : 'bg-amber-500'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
