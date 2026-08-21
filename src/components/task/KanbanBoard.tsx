'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status?: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  dotColor: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick, onAddTask }) => {
  const columns: ColumnConfig[] = [
    { id: 'todo', title: 'To Do', dotColor: 'bg-blue-500' },
    { id: 'doing', title: 'Doing', dotColor: 'bg-amber-500' },
    { id: 'completed', title: 'Completed', dotColor: 'bg-emerald-500' },
    { id: 'on_hold', title: 'On Hold', dotColor: 'bg-purple-500' },
    { id: 'user_feedback', title: 'User Feedback', dotColor: 'bg-rose-500' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 h-full items-start select-none">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <div
            key={column.id}
            className="w-72 sm:w-80 shrink-0 bg-surface-hover/50 rounded-2xl border border-theme p-3 flex flex-col max-h-full"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                <h3 className="text-sm font-semibold text-main">{column.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface border border-theme text-muted">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddTask(column.id)}
                className="p-1 text-muted hover:text-main rounded-md hover:bg-surface transition-colors cursor-pointer"
                title="Add task to column"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards Container */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-[150px]">
              {columnTasks.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-theme rounded-xl text-xs text-muted">
                  No tasks in {column.title}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                ))
              )}
            </div>

            {/* Bottom Add Task Action */}
            <div className="mt-3 pt-2 border-t border-theme">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onAddTask(column.id)}
                className="text-xs text-muted hover:text-main justify-start"
              >
                Add Task
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
