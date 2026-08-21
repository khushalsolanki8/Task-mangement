'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MOCK_USERS } from '@/data/mockData';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  initialStatus?: TaskStatus;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  initialStatus = 'todo',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [dueDate, setDueDate] = useState('15 Sep 2026');
  const [labels, setLabels] = useState('Deployment, Admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      members: [MOCK_USERS[0]],
      labels: labels.split(',').map((l) => l.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: [],
      comments: [],
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g., Implement OAuth authentication"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-theme bg-surface text-main p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-ring focus:border-accent"
            rows={3}
            placeholder="Detailed description of the task objectives..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-lg border border-theme bg-surface text-main p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-ring"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="user_feedback">User Feedback</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-lg border border-theme bg-surface text-main p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-ring"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="no_priority">No Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            placeholder="e.g., 29 Jul 2026"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Input
            label="Labels (comma separated)"
            placeholder="Admin, Deployment"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
