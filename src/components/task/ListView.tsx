'use client';

import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { Badge } from '../ui/Badge';
import { AvatarGroup } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status?: TaskStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({ tasks, onTaskClick, onAddTask }) => {
  const groups: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'completed', title: 'Completed' },
    { id: 'on_hold', title: 'On Hold' },
    { id: 'user_feedback', title: 'User Feedback' },
  ];

  return (
    <div className="w-full space-y-6">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.id);
        if (groupTasks.length === 0) return null;

        return (
          <div key={group.id} className="w-full bg-surface border border-theme rounded-2xl overflow-hidden shadow-xs">
            {/* Group Title Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-surface-hover/60 border-b border-theme">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-main">{group.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface border border-theme text-muted">
                  {groupTasks.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onAddTask(group.id)}
                className="text-xs"
              >
                Add Task
              </Button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface-hover/30 text-muted uppercase text-[11px] font-semibold border-b border-theme">
                  <tr>
                    <th className="px-6 py-3">Task</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Members</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme">
                  {groupTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="hover:bg-surface-hover/50 transition-colors cursor-pointer"
                    >
                      {/* Task Title & Labels */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-main hover:text-accent transition-colors">
                            {task.title}
                          </span>
                          {task.labels.length > 0 && (
                            <div className="flex items-center gap-1">
                              {task.labels.map((lbl, idx) => (
                                <Badge key={idx}>{lbl}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="priority" priority={task.priority} />
                      </td>

                      {/* Members */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AvatarGroup users={task.members} max={3} size="sm" />
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-secondary font-medium">
                        {task.dueDate || '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1.5 text-muted hover:text-main rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
