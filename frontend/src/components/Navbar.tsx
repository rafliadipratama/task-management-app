'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, FolderKanban, Plus } from 'lucide-react';

interface NavbarProps {
  onNewProjectClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewProjectClick }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  Spend<span className="text-indigo-600">Task</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Manager
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Semua Project
              </Link>
            </nav>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-3">
            {onNewProjectClick && (
              <button
                type="button"
                onClick={onNewProjectClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Project Baru</span>
                <span className="sm:hidden">Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
