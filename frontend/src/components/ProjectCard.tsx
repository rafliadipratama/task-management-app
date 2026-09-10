'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { ProgressBar } from './ProgressBar';
import { formatDate } from '@/lib/utils';
import {
  ArrowRight,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  FolderKanban,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
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

  const stats = project.taskStats || {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    progressPercentage: 0,
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {project.title}
            </Link>
          </div>

          {/* Action dropdown menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(project);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  Edit Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Hapus Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem] mb-4">
          {project.description || (
            <span className="italic text-slate-400">Tidak ada deskripsi</span>
          )}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Progress Bar */}
        <ProgressBar
          progress={stats.progressPercentage}
          total={stats.total}
          completed={stats.done}
        />

        {/* Task Counter Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
            {stats.todo} To Do
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-100">
            {stats.inProgress} Dikerjakan
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
            {stats.done} Selesai
          </span>
        </div>

        {/* Footer info & open link */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.createdAt)}</span>
          </div>

          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
          >
            Buka Project
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
