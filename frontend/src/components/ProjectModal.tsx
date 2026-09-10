'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '@/types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectPayload | UpdateProjectPayload) => Promise<void>;
  projectToEdit?: Project | null;
  isLoading?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setErrors({});
  }, [projectToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Judul project wajib diisi';
    } else if (title.trim().length > 150) {
      newErrors.title = 'Judul tidak boleh melebihi 150 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
    });
  };

  const isEditing = !!projectToEdit;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Buat Project Baru'}
      description={
        isEditing
          ? 'Perbarui informasi dan detail project Anda.'
          : 'Project membantu Anda mengelompokkan task dan memantau kemajuan pekerjaan.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Judul Project <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Redesain Website, Aplikasi Mobile v2"
            disabled={isLoading}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Deskripsi <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan tujuan atau ruang lingkup project ini..."
            rows={3}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isEditing ? 'Simpan Perubahan' : 'Buat Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
