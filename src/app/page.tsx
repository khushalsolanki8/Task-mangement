'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/components/auth/LoginPage';
import { KanbanBoard } from '@/components/task/KanbanBoard';
import { ListView } from '@/components/task/ListView';
import { TaskDetailModal } from '@/components/task/TaskDetailModal';
import { AddTaskModal } from '@/components/task/AddTaskModal';
import { ProjectsView } from '@/components/project/ProjectsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { MOCK_PROJECTS } from '@/data/mockData';
import { CreateTaskPayload, Task, TaskStatus, ViewMode } from '@/types';

export default function Home() {
  const { user, isAuthenticated, isAuthenticating, loginAsGuest, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects' | 'settings'>('tasks');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    tasks,
    isLoading,
    error,
    successMessage,
    createTask,
    updateTask,
    clearNotifications,
  } = useTasks();

  const [projects] = useState(MOCK_PROJECTS);

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState<TaskStatus>('todo');

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.labels.some((l) => l.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleOpenAddTask = (status: TaskStatus = 'todo') => {
    setNewTaskInitialStatus(status);
    setIsAddTaskOpen(true);
  };

  const handleAddNewTask = async (taskPayload: CreateTaskPayload) => {
    await createTask(taskPayload);
    setIsAddTaskOpen(false);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const payload = {
      title: updatedTask.title,
      description: updatedTask.description || undefined,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate || undefined,
      labels: updatedTask.labels,
    };
    await updateTask(updatedTask.id, payload);
    setSelectedTask(updatedTask);
  };

  // Render auth loading state
  if (isAuthenticating) {
    return <LoadingState message="Authenticating session..." type="spinner" />;
  }

  // Render Login screen if user is not authenticated
  if (!isAuthenticated) {
    return <LoginPage onGuestLogin={loginAsGuest} isLoading={isAuthenticating} />;
  }

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onAddTask={() => handleOpenAddTask('todo')}
      onLogout={logout}
    >
      <Toast
        type={error ? 'error' : 'success'}
        message={error || successMessage}
        onClose={clearNotifications}
      />

      {isLoading ? (
        <LoadingState message="Fetching workspace data..." type="skeleton" />
      ) : (
        <>
          {activeTab === 'tasks' && (
            <div className="h-full">
              {filteredTasks.length === 0 ? (
                <EmptyState
                  title="No tasks found"
                  description={
                    searchQuery
                      ? `No tasks matched "${searchQuery}".`
                      : 'Create your first task to get started.'
                  }
                  actionLabel={searchQuery ? 'Clear Search' : 'Add Task'}
                  onAction={() => {
                    if (searchQuery) setSearchQuery('');
                    else handleOpenAddTask('todo');
                  }}
                />
              ) : viewMode === 'board' ? (
                <KanbanBoard
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleOpenAddTask}
                />
              ) : (
                <ListView
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleOpenAddTask}
                />
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onSelectProject={() => setActiveTab('tasks')}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </>
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        onUpdateTask={handleUpdateTask}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={(task) => {
          handleAddNewTask({
            title: task.title,
            description: task.description || undefined,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate || undefined,
            labels: task.labels,
          });
        }}
        initialStatus={newTaskInitialStatus}
      />
    </AppLayout>
  );
}
