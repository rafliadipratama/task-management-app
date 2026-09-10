'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ProjectCardSkeleton } from '@/components/LoadingSkeleton';
import { api } from '@/lib/api';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '@/types';
import toast from 'react-hot-toast';
import { Plus, FolderKanban, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog states
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('Gagal mengambil data project:', err);
      setError(err.message || 'Gagal memuat data project');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreateModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (
    data: CreateProjectPayload | UpdateProjectPayload
  ) => {
    setIsSubmitting(true);
    try {
      if (projectToEdit) {
        const updated = await api.updateProject(projectToEdit.id, data);
        setProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
        );
        toast.success('Project berhasil diperbarui!');
      } else {
        await api.createProject(data as CreateProjectPayload);
        // Refresh seluruh project untuk memperbarui statistik
        await fetchProjects();
        toast.success('Project baru berhasil dibuat!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      toast.success('Project berhasil dihapus!');
      setProjectToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter project berdasarkan kata kunci pencarian
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  // Statistik agregat global
  const totalProjects = projects.length;
  const totalTasks = projects.reduce(
    (acc, p) => acc + (p.taskStats?.total || 0),
    0
  );
  const totalDone = projects.reduce(
    (acc, p) => acc + (p.taskStats?.done || 0),
    0
  );
  const totalInProgress = projects.reduce(
    (acc, p) => acc + (p.taskStats?.inProgress || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNewProjectClick={handleOpenCreateModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Hero / Ringkasan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200 backdrop-blur-sm border border-white/10">
              <FolderKanban className="w-3.5 h-3.5" />
              Ringkasan Ruang Kerja
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Kelola Project & Task Anda
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Organisir, pantau progres, dan selesaikan pekerjaan dengan mudah melalui
              manajemen alur kerja terstruktur, update status cepat, dan label prioritas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="self-start md:self-center inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-white/50 shrink-0"
          >
            <Plus className="w-5 h-5 text-indigo-600" />
            Buat Project Baru
          </button>
        </div>

        {/* Card Statistik Global */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Project</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalProjects}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Task</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalTasks}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Sedang Dikerjakan</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalInProgress}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Telah Selesai</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalDone}</h3>
            </div>
          </div>
        </div>

        {/* Section Header & Pencarian */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daftar Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada project untuk melihat dan mengelola seluruh task di dalamnya
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama project..."
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Status UI: Loading / Error / Empty / Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Gagal memuat project"
            message={error}
            onRetry={fetchProjects}
          />
        ) : filteredProjects.length === 0 ? (
          searchQuery ? (
            <EmptyState
              title="Project tidak ditemukan"
              description={`Tidak ada project yang cocok dengan pencarian "${searchQuery}". Coba gunakan kata kunci lain.`}
              actionLabel="Reset Pencarian"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <EmptyState
              title="Belum ada project"
              description="Buat project pertama Anda untuk mulai mengatur task dan melacak progres pekerjaan."
              actionLabel="Buat Project Baru"
              onAction={handleOpenCreateModal}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleOpenEditModal}
                onDelete={(p) => setProjectToDelete(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Project (Buat / Edit) */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        projectToEdit={projectToEdit}
        isLoading={isSubmitting}
      />

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Hapus Project"
        message={`Apakah Anda yakin ingin menghapus project "${projectToDelete?.title}"? Semua task di dalam project ini akan dihapus secara permanen.`}
        confirmText="Hapus Project"
        cancelText="Batal"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
