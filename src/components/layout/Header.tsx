'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Filter, Plus, LayoutGrid, List as ListIcon, Check } from 'lucide-react';
import { ViewMode } from '@/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddTask: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onAddTask,
  title = 'Tasks',
}) => {
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [fields, setFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    status: false,
    labels: false,
    reporter: false,
  });

  const toggleField = (key: keyof typeof fields) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <header className="w-full bg-surface border-b border-theme px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      {/* Title & View Switcher */}
      <div className="flex items-center justify-between md:justify-start gap-4">
        <h1 className="text-xl font-bold text-main">{title}</h1>

        {/* View Switcher Segmented Button Group (Figma specs) */}
        <div className="inline-flex p-1 rounded-lg bg-surface-hover border border-theme">
          <button
            onClick={() => setViewMode('board')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'board'
                ? 'bg-surface text-accent shadow-xs'
                : 'text-secondary hover:text-main'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-surface text-accent shadow-xs'
                : 'text-secondary hover:text-main'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Toolbar Controls: Search, Fields, Filter, Add Task */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Live Search Input */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-muted" />}
          />
        </div>

        {/* Fields Popover Button */}
        <div className="relative">
          <Button
            variant="outline"
            size="md"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setIsFieldsOpen(!isFieldsOpen)}
          >
            Fields
          </Button>

          {isFieldsOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsFieldsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface border border-theme shadow-2xl p-2 z-40 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-3 py-1.5 font-semibold text-muted uppercase tracking-wider text-[10px]">
                  Visible Fields
                </p>
                {Object.entries(fields).map(([key, isChecked]) => (
                  <button
                    key={key}
                    onClick={() => toggleField(key as keyof typeof fields)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-surface-hover text-main capitalize cursor-pointer"
                  >
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    {isChecked && <Check className="w-4 h-4 text-accent" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filter Button */}
        <Button variant="outline" size="md" leftIcon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>

        {/* Add Task Primary Action */}
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={onAddTask}>
          Add Task
        </Button>
      </div>
    </header>
  );
};
