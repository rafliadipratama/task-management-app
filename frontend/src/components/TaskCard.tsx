'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { PriorityBadge, StatusBadge } from './Badge';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDone = task.status === 'done';

  return (
    <div
      className={`group bg-white rounded-2xl border p-5 shadow-sm hover:shadow transition-all ${
        isDone
          ? 'border-emerald-100 bg-emerald-50/20'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Top badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} size="sm" />
            <StatusBadge status={task.status} size="sm" />
          </div>

          {/* Title */}
          <h4
            className={`text-base font-semibold transition-colors ${
              isDone
                ? 'line-through text-slate-400'
                : 'text-slate-900 group-hover:text-indigo-600'
            }`}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm leading-relaxed ${
                isDone ? 'text-slate-400 line-through' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                Edit Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Hapus Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Status quick selector & created date */}
      <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Ubah Status:</span>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => onStatusChange(task, 'todo')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                task.status === 'todo'
                  ? 'bg-white text-slate-800 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3 h-3" />
              To Do
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(task, 'in_progress')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                task.status === 'in_progress'
                  ? 'bg-white text-amber-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-amber-700'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              Dikerjakan
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(task, 'done')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                task.status === 'done'
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Selesai
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
