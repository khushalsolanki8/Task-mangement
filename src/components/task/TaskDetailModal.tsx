'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  MessageSquare,
  Plus,
  Tag,
  User,
  Shield,
  Send,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (updatedTask: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  if (!task) return null;

  const handlePriorityChange = (newPriority: TaskPriority) => {
    if (onUpdateTask) {
      onUpdateTask({ ...task, priority: newPriority });
    }
    setIsPriorityOpen(false);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onUpdateTask) {
      onUpdateTask({ ...task, status: newStatus });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onUpdateTask) return;
    const newComment = {
      id: `c_${Date.now()}`,
      user: task.members[0] || { id: 'u1', name: 'Dexter', email: 'dexter@gmail.com', initials: 'DX' },
      content: commentText.trim(),
      createdAt: 'Just now',
    };
    onUpdateTask({
      ...task,
      comments: [...(task.comments || []), newComment],
    });
    setCommentText('');
  };

  const priorityOptions: TaskPriority[] = ['no_priority', 'urgent', 'high', 'medium', 'low'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col lg:flex-row gap-6 -m-6 p-6">
        {/* Main Left Content Panel */}
        <div className="flex-1 space-y-6">
          {/* Header Title */}
          <div>
            <h2 className="text-xl font-bold text-main mb-2">{task.title}</h2>
            <p className="text-sm text-secondary leading-relaxed">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Tag Pills Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted uppercase">Labels:</span>
            {task.labels.map((lbl, idx) => (
              <Badge key={idx}>{lbl}</Badge>
            ))}
          </div>

          {/* External Links / Resources */}
          <div className="p-3 rounded-xl bg-surface-hover border border-theme flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Resources & Links</span>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add document or link...
            </Button>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-main flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-accent" />
                Subtasks
              </h3>
              <Button variant="ghost" size="sm" leftIcon={<Plus className="w-3 h-3" />}>
                Add Subtask
              </Button>
            </div>

            {task.subtasks && task.subtasks.length > 0 ? (
              <div className="border border-theme rounded-xl overflow-hidden divide-y divide-theme text-xs">
                {task.subtasks.map((st) => (
                  <div key={st.id} className="p-3 flex items-center justify-between bg-surface hover:bg-surface-hover/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" defaultChecked={st.completed} className="rounded border-theme text-accent cursor-pointer" />
                      <span className={`font-medium ${st.completed ? 'line-through text-muted' : 'text-main'}`}>
                        {st.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="priority" priority={st.priority} />
                      {st.dueDate && <span className="text-muted">{st.dueDate}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No subtasks added yet.</p>
            )}
          </div>

          {/* Comments & Activity Timeline */}
          <div className="space-y-4 pt-4 border-t border-theme">
            <h3 className="text-sm font-bold text-main flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              Activity & Comments
            </h3>

            {/* Comment List */}
            <div className="space-y-3">
              {task.comments?.map((c) => (
                <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-surface-hover/40 border border-theme/60">
                  <Avatar user={c.user} size="sm" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-main">{c.user.name}</span>
                      <span className="text-[10px] text-muted">{c.createdAt}</span>
                    </div>
                    <p className="text-secondary">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                placeholder="Leave a reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />}>
                Post
              </Button>
            </form>
          </div>
        </div>

        {/* Right Details Panel (Figma specs) */}
        <div className="w-full lg:w-72 bg-surface-hover/50 p-4 rounded-2xl border border-theme space-y-4 text-xs shrink-0">
          <h3 className="font-bold text-main uppercase text-[11px] tracking-wider text-muted">
            Properties
          </h3>

          {/* Status Dropdown */}
          <div className="flex items-center justify-between py-1.5 border-b border-theme/60">
            <span className="text-secondary font-medium">Status</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="bg-surface border border-theme rounded-lg px-2 py-1 text-xs font-semibold text-main focus:outline-none cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="user_feedback">User Feedback</option>
            </select>
          </div>

          {/* Priority Popover */}
          <div className="relative flex items-center justify-between py-1.5 border-b border-theme/60">
            <span className="text-secondary font-medium">Priority</span>
            <button
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <Badge variant="priority" priority={task.priority} />
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </button>

            {isPriorityOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsPriorityOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-surface border border-theme shadow-xl p-1.5 z-40 space-y-1">
                  {priorityOptions.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-hover cursor-pointer ${
                        task.priority === p ? 'bg-accent/10 font-bold' : ''
                      }`}
                    >
                      <Badge variant="priority" priority={p} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Members */}
          <div className="flex items-center justify-between py-1.5 border-b border-theme/60">
            <span className="text-secondary font-medium">Members</span>
            <AvatarGroup users={task.members} max={3} size="sm" />
          </div>

          {/* Dates */}
          <div className="relative flex items-center justify-between py-1.5 border-b border-theme/60">
            <span className="text-secondary font-medium">Due Date</span>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-1 text-main font-semibold hover:text-accent cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{task.dueDate || 'Set Date'}</span>
            </button>

            {/* Date Picker Popover */}
            {isDatePickerOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsDatePickerOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-60 rounded-2xl bg-surface border border-theme shadow-2xl p-3 z-40 text-center space-y-2">
                  <div className="text-xs font-bold text-main">Select Date</div>
                  <div className="grid grid-cols-7 gap-1 text-[10px] text-muted font-semibold">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        onClick={() => {
                          if (onUpdateTask) {
                            onUpdateTask({ ...task, dueDate: `${day} Sep 2026` });
                          }
                          setIsDatePickerOpen(false);
                        }}
                        className={`p-1.5 rounded-lg hover:bg-accent/20 cursor-pointer ${
                          day === 12 ? 'bg-accent text-white font-bold' : 'text-main'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Activity Audit Log */}
          <div className="pt-2">
            <h4 className="font-semibold text-main mb-2">Activity Log</h4>
            <div className="space-y-2 text-[11px] text-muted">
              <p>• <span className="font-medium text-main">Ankit Dutta</span> changed priority to Urgent</p>
              <p>• <span className="font-medium text-main">Dexter</span> created task</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
