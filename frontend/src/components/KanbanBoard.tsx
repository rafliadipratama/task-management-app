'use client';

import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types';
import { PriorityBadge } from './Badge';
import { formatDate } from '@/lib/utils';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAddTask: (initialStatus?: TaskStatus) => void;
}

interface ColumnConfig {
  status: TaskStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  headerColor: string;
  badgeColor: string;
  dropZoneColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'todo',
    title: 'Akan Dikerjakan',
    icon: Clock,
    headerColor: 'border-slate-300 text-slate-700',
    badgeColor: 'bg-slate-100 text-slate-700',
    dropZoneColor: 'bg-slate-100/70 border-slate-300',
  },
  {
    status: 'in_progress',
    title: 'Sedang Dikerjakan',
    icon: AlertCircle,
    headerColor: 'border-amber-400 text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-800',
    dropZoneColor: 'bg-amber-50/70 border-amber-300',
  },
  {
    status: 'done',
    title: 'Selesai',
    icon: CheckCircle2,
    headerColor: 'border-emerald-400 text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    dropZoneColor: 'bg-emerald-50/70 border-emerald-300',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      onStatusChange(task, targetStatus);
    }
    setDraggedTaskId(null);
  };

  // Status transitions helpers for quick arrow buttons
  const getPrevStatus = (status: TaskStatus): TaskStatus | null => {
    if (status === 'done') return 'in_progress';
    if (status === 'in_progress') return 'todo';
    return null;
  };

  const getNextStatus = (status: TaskStatus): TaskStatus | null => {
    if (status === 'todo') return 'in_progress';
    if (status === 'in_progress') return 'done';
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);
        const Icon = column.icon;
        const isTargeted = dragOverColumn === column.status;

        return (
          <div
            key={column.status}
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={(e) => handleDragLeave(e, column.status)}
            onDrop={(e) => handleDrop(e, column.status)}
            className={`flex flex-col bg-slate-100/70 rounded-3xl p-4 border-2 transition-all min-h-[480px] ${
              isTargeted
                ? `${column.dropZoneColor} border-dashed ring-2 ring-indigo-400 scale-[1.01]`
                : 'border-transparent hover:border-slate-200'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-white shadow-xs ${column.headerColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                  {column.title}
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${column.badgeColor}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAddTask(column.status)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                title={`Tambah task di kolom ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards in Column */}
            <div className="flex-1 space-y-3">
              {columnTasks.length === 0 ? (
                <div
                  className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition-colors ${
                    isTargeted
                      ? 'border-indigo-400 bg-white/80'
                      : 'border-slate-200/90 text-slate-400 bg-white/30'
                  }`}
                >
                  <p className="text-xs font-medium">
                    {isTargeted ? 'Lepas task di sini' : 'Belum ada task di kolom ini'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isTargeted ? 'Status akan otomatis diperbarui' : 'Tarik task ke sini'}
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isDragging = draggedTaskId === task.id;
                  const prevStatus = getPrevStatus(task.status);
                  const nextStatus = getNextStatus(task.status);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-40 scale-95 border-dashed border-indigo-400' : ''
                      } ${task.status === 'done' ? 'border-emerald-100 bg-emerald-50/20' : ''}`}
                    >
                      {/* Card Header: Drag icon & Priority */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                          <PriorityBadge priority={task.priority} size="sm" />
                        </div>

                        {/* Actions: Edit & Delete */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Task"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Hapus Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-sm font-semibold mb-1 leading-snug ${
                          task.status === 'done'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 group-hover:text-indigo-600 transition-colors'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p
                          className={`text-xs line-clamp-2 leading-relaxed mb-3 ${
                            task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-500'
                          }`}
                        >
                          {task.description}
                        </p>
                      )}

                      {/* Card Footer: Date & Quick Move Arrows */}
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.createdAt)}</span>
                        </div>

                        {/* Quick move buttons (great for touch & accessibility) */}
                        <div className="flex items-center gap-1">
                          {prevStatus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(task, prevStatus);
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-0.5"
                              title={`Pindahkan ke ${prevStatus}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {nextStatus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(task, nextStatus);
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-0.5"
                              title={`Pindahkan ke ${nextStatus}`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
