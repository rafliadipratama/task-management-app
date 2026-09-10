import React from 'react';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1 mr-4">
          <div className="h-5 bg-slate-200 rounded-md w-3/4" />
          <div className="h-4 bg-slate-100 rounded-md w-full" />
          <div className="h-4 bg-slate-100 rounded-md w-2/3" />
        </div>
        <div className="w-8 h-8 bg-slate-100 rounded-lg" />
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/6" />
        </div>
        <div className="h-2 bg-slate-100 rounded-full w-full" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-1.5">
          <div className="h-5 bg-slate-100 rounded-full w-14" />
          <div className="h-5 bg-slate-100 rounded-full w-14" />
        </div>
        <div className="h-4 bg-slate-100 rounded w-20" />
      </div>
    </div>
  );
};

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-slate-200 rounded-md w-1/2" />
            <div className="h-5 bg-slate-100 rounded-full w-16" />
          </div>
          <div className="h-4 bg-slate-100 rounded-md w-4/5" />
        </div>
        <div className="h-8 bg-slate-100 rounded-lg w-8" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="h-8 bg-slate-100 rounded-xl w-32" />
        <div className="h-3 bg-slate-100 rounded w-20" />
      </div>
    </div>
  );
};

export const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded w-32" />
        <div className="h-8 bg-slate-200 rounded-lg w-2/3" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
