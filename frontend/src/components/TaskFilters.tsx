'use client';

import React from 'react';
import { TaskPriority, TaskStatus } from '@/types';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  priority: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onReset: () => void;
  totalFiltered: number;
  totalTasks: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onReset,
  totalFiltered,
  totalTasks,
}) => {
  const hasActiveFilters = search !== '' || status !== 'all' || priority !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari task berdasarkan judul atau deskripsi..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Priority Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Prioritas:</span>
          </div>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          >
            <option value="all">Semua Prioritas</option>
            <option value="low">Prioritas Rendah</option>
            <option value="medium">Prioritas Sedang</option>
            <option value="high">Prioritas Tinggi</option>
          </select>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs Row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              status === 'all'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('todo')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              status === 'todo'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            To Do
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('in_progress')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              status === 'in_progress'
                ? 'bg-amber-500 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sedang Dikerjakan
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('done')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              status === 'done'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Selesai
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Menampilkan <span className="text-slate-700 font-semibold">{totalFiltered}</span> dari{' '}
          <span className="text-slate-700 font-semibold">{totalTasks}</span> task
        </div>
      </div>
    </div>
  );
};
