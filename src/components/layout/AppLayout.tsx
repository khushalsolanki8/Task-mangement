'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';
import { ViewMode } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddTask: () => void;
  activeTab: 'tasks' | 'projects' | 'settings';
  setActiveTab: (tab: 'tasks' | 'projects' | 'settings') => void;
  onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onAddTask,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-main">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Navigation Header */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global Toolbar Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddTask={onAddTask}
          title={activeTab === 'tasks' ? 'Tasks' : activeTab === 'projects' ? 'Projects' : 'Settings'}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-main">
          {children}
        </main>
      </div>
    </div>
  );
};
