'use client';

import React from 'react';
import { Calendar, CheckSquare, MessageSquare } from 'lucide-react';
import { Task } from '@/types';
import { Badge } from '../ui/Badge';
import { AvatarGroup } from '../ui/Avatar';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div
      onClick={() => onClick(task)}
      className="group p-4 rounded-xl border border-theme bg-surface hover:border-accent/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-3"
    >
      {/* Header Tags & Priority */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Badge variant="priority" priority={task.priority} />
        {task.labels.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {task.labels.map((label, idx) => (
              <Badge key={idx}>{label}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-main group-hover:text-accent transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Optional Description snippet */}
      {task.description && (
        <p className="text-xs text-muted line-clamp-2">{task.description}</p>
      )}

      {/* Footer Info: Subtask/Comment indicators, Due Date, Avatar Stack */}
      <div className="flex items-center justify-between pt-2 border-t border-theme/60 text-xs text-muted">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              {task.dueDate}
            </span>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <CheckSquare className="w-3.5 h-3.5 text-muted" />
              {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
            </span>
          )}
          {task.comments && task.comments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <MessageSquare className="w-3.5 h-3.5 text-muted" />
              {task.comments.length}
            </span>
          )}
        </div>

        {/* Member Avatars */}
        <AvatarGroup users={task.members} max={3} size="sm" />
      </div>
    </div>
  );
};
