'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { ProjectModal } from '@/components/ProjectModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { TaskFilters } from '@/components/TaskFilters';
import { ProgressBar } from '@/components/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ProjectDetailSkeleton } from '@/components/LoadingSkeleton';
import { api } from '@/lib/api';
import {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
  CreateTaskPayload,
  UpdateTaskPayload,
  UpdateProjectPayload,
} from '@/types';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  // Task Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Project Edit Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Delete Task states
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Delete Project states
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const fetchProjectAndTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [projectData, tasksData] = await Promise.all([
        api.getProjectById(projectId),
        api.getTasks({ projectId }),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (err: any) {
      console.error('Gagal memuat detail project:', err);
      setError(err.message || 'Gagal memuat detail project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [fetchProjectAndTasks]);

  // Hitung task terfilter secara instan di sisi klien
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Pencarian judul atau deskripsi
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description
          ? task.description.toLowerCase().includes(q)
          : false;
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Filter status
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // Filter prioritas
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  // Statistik task dihitung dari state terkini
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const progressPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, todo, inProgress, done, progressPercentage };
  }, [tasks]);

  // --- Aksi Task ---
  const handleOpenCreateTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (
    data: CreateTaskPayload | UpdateTaskPayload
  ) => {
    setIsSubmittingTask(true);
    try {
      if (taskToEdit) {
        const updated = await api.updateTask(taskToEdit.id, data);
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
        );
        toast.success('Task berhasil diperbarui!');
      } else {
        const created = await api.createTask(data as CreateTaskPayload);
        setTasks((prev) => [created, ...prev]);
        toast.success('Task baru berhasil ditambahkan!');
      }
      setIsTaskModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan task');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;

    // Pembaruan UI optimistik
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    const statusLabel =
      newStatus === 'in_progress'
        ? 'Sedang Dikerjakan'
        : newStatus === 'done'
        ? 'Selesai'
        : 'Akan Dikerjakan';

    try {
      await api.updateTask(task.id, { status: newStatus });
      toast.success(`Status task diubah menjadi "${statusLabel}"`);
    } catch (err: any) {
      // Revert jika gagal
      setTasks(previousTasks);
      toast.error(err.message || 'Gagal memperbarui status task');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeletingTask(true);
    try {
      await api.deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      toast.success('Task berhasil dihapus!');
      setTaskToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus task');
    } finally {
      setIsDeletingTask(false);
    }
  };

  // --- Aksi Project ---
  const handleProjectSubmit = async (data: UpdateProjectPayload) => {
    if (!project) return;
    setIsSubmittingProject(true);
    try {
      const updated = await api.updateProject(project.id, data);
      setProject((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success('Informasi project berhasil diperbarui!');
      setIsProjectModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui project');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    setIsDeletingProject(true);
    try {
      await api.deleteProject(project.id);
      toast.success('Project berhasil dihapus!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus project');
      setIsDeletingProject(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigasi Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Project
          </Link>
        </div>

        {/* UI State: Loading atau Error */}
        {isLoading ? (
          <ProjectDetailSkeleton />
        ) : error || !project ? (
          <ErrorState
            title="Tidak dapat memuat project"
            message={error || 'Project tidak ditemukan'}
            onRetry={fetchProjectAndTasks}
          />
        ) : (
          <>
            {/* Header Banner Project */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    <span>Detail Project</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-400 font-normal normal-case">
                      <Calendar className="w-3.5 h-3.5" />
                      Dibuat {formatDate(project.createdAt)}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {project.title}
                  </h1>
                  <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
                    {project.description || (
                      <span className="italic text-slate-400">
                        Tidak ada deskripsi untuk project ini.
                      </span>
                    )}
                  </p>
                </div>

                {/* Tombol Aksi Project & Tambah Task */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(true)}
                    className="p-2.5 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    title="Edit Informasi Project"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteProjectOpen(true)}
                    className="p-2.5 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Hapus Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCreateTask}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Task
                  </button>
                </div>
              </div>

              {/* Progress Bar & Row Statistik */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <ProgressBar
                  progress={stats.progressPercentage}
                  total={stats.total}
                  completed={stats.done}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600">
                      <ListTodo className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Total Task</span>
                      <span className="text-lg font-bold text-slate-800">{stats.total}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">To Do</span>
                      <span className="text-lg font-bold text-slate-800">{stats.todo}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-amber-700 block font-medium">Dikerjakan</span>
                      <span className="text-lg font-bold text-amber-800">{stats.inProgress}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-emerald-700 block font-medium">Selesai</span>
                      <span className="text-lg font-bold text-emerald-800">{stats.done}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter dan Pencarian Task */}
            <TaskFilters
              search={search}
              onSearchChange={setSearch}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              priority={priorityFilter}
              onPriorityChange={setPriorityFilter}
              onReset={handleResetFilters}
              totalFiltered={filteredTasks.length}
              totalTasks={tasks.length}
            />

            {/* Daftar Task / Kondisi Kosong */}
            {filteredTasks.length === 0 ? (
              tasks.length === 0 ? (
                <EmptyState
                  title="Belum ada task di project ini"
                  description="Tambahkan item pekerjaan pertama Anda untuk mulai mengatur alur kerja dan memantau progres."
                  actionLabel="Tambah Task Pertama"
                  onAction={handleOpenCreateTask}
                />
              ) : (
                <EmptyState
                  title="Tidak ada task yang sesuai"
                  description="Coba sesuaikan kata kunci pencarian, filter status, atau prioritas Anda."
                  actionLabel="Reset Semua Filter"
                  onAction={handleResetFilters}
                />
              )
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onEdit={handleOpenEditTask}
                    onDelete={(t) => setTaskToDelete(t)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Task (Tambah / Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        taskToEdit={taskToEdit}
        projectId={projectId}
        isLoading={isSubmittingTask}
      />

      {/* Modal Edit Project */}
      {project && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSubmit={handleProjectSubmit}
          projectToEdit={project}
          isLoading={isSubmittingProject}
        />
      )}

      {/* Dialog Konfirmasi Hapus Task */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Hapus Task"
        message={`Apakah Anda yakin ingin menghapus task "${taskToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Task"
        cancelText="Batal"
        isLoading={isDeletingTask}
        variant="danger"
      />

      {/* Dialog Konfirmasi Hapus Project */}
      <ConfirmDialog
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleDeleteProject}
        title="Hapus Project"
        message={`Apakah Anda yakin ingin menghapus project "${project?.title}" beserta seluruh task di dalamnya? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Project"
        cancelText="Batal"
        isLoading={isDeletingProject}
        variant="danger"
      />
    </div>
  );
}
