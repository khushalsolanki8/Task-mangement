'use client';

import React, { useState } from 'react';
import { LayoutGrid, FolderKanban, Settings, Sun, Moon, Palette, ChevronRight, Check, LogOut } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { AccentColor } from '@/types';
import { Avatar } from '../ui/Avatar';
import { MOCK_USERS } from '@/data/mockData';

interface SidebarProps {
  activeTab: 'tasks' | 'projects' | 'settings';
  setActiveTab: (tab: 'tasks' | 'projects' | 'settings') => void;
  className?: string;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  className = '',
  onCloseMobile,
  onLogout,
}) => {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'none' | 'theme' | 'color'>('none');

  const currentUser = MOCK_USERS[0];

  const handleNavClick = (tab: 'tasks' | 'projects' | 'settings') => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const colorOptions: { id: AccentColor; label: string; bgClass: string }[] = [
    { id: 'amber', label: 'Amber', bgClass: 'bg-amber-500' },
    { id: 'blue', label: 'Blue', bgClass: 'bg-blue-600' },
    { id: 'pink', label: 'Pink', bgClass: 'bg-pink-600' },
    { id: 'rose', label: 'Rose', bgClass: 'bg-rose-600' },
    { id: 'emerald', label: 'Emerald', bgClass: 'bg-emerald-600' },
    { id: 'black', label: 'Black', bgClass: 'bg-zinc-900 dark:bg-zinc-100' },
  ];

  return (
    <aside
      className={`w-64 h-full bg-surface border-r border-theme flex flex-col justify-between p-4 shrink-0 relative ${className}`}
    >
      {/* Upper Navigation Header */}
      <div className="space-y-6">
        {/* Workspace Brand Selector */}
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-accent text-white font-bold flex items-center justify-center text-sm shadow-xs">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-main leading-tight">Dexter</span>
            <span className="text-xs text-muted">Workspace</span>
          </div>
        </div>

        {/* Main Links */}
        <nav className="space-y-1">
          <button
            onClick={() => handleNavClick('tasks')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-accent/10 text-accent font-semibold'
                : 'text-secondary hover:text-main hover:bg-surface-hover'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => handleNavClick('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-accent/10 text-accent font-semibold'
                : 'text-secondary hover:text-main hover:bg-surface-hover'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-accent/10 text-accent font-semibold'
                : 'text-secondary hover:text-main hover:bg-surface-hover'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* User Profile Popover Container */}
      <div className="relative border-t border-theme pt-3">
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors text-left cursor-pointer"
        >
          <Avatar user={currentUser} size="md" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-main truncate">{currentUser.name}</span>
            <span className="text-xs text-muted truncate">{currentUser.email || 'Guest User'}</span>
          </div>
        </button>

        {/* User Context Popover Menu */}
        {isProfileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => {
                setIsProfileMenuOpen(false);
                setActiveSubmenu('none');
              }}
            />
            <div className="absolute bottom-16 left-0 w-64 rounded-2xl bg-surface border border-theme shadow-2xl z-40 p-2 text-sm space-y-1 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="px-3 py-2 border-b border-theme mb-1">
                <p className="font-semibold text-main">{currentUser.name}</p>
                <p className="text-xs text-muted">{currentUser.email || 'Guest Session'}</p>
              </div>

              {/* Menu Item: Change Theme */}
              <div className="relative">
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'theme' ? 'none' : 'theme')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-hover text-secondary hover:text-main cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {themeMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>Change Theme</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </button>

                {/* Submenu for Theme Mode */}
                {activeSubmenu === 'theme' && (
                  <div className="absolute left-full bottom-0 ml-2 w-36 rounded-xl bg-surface border border-theme shadow-xl p-1.5 space-y-1 z-50">
                    <button
                      onClick={() => setThemeMode('light')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        themeMode === 'light' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-surface-hover text-main'
                      }`}
                    >
                      <span>Light</span>
                      {themeMode === 'light' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setThemeMode('dark')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        themeMode === 'dark' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-surface-hover text-main'
                      }`}
                    >
                      <span>Dark</span>
                      {themeMode === 'dark' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Menu Item: Color Mode */}
              <div className="relative">
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'color' ? 'none' : 'color')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-hover text-secondary hover:text-main cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4" />
                    <span>Color Mode</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </button>

                {/* Submenu for Accent Color */}
                {activeSubmenu === 'color' && (
                  <div className="absolute left-full bottom-0 ml-2 w-40 rounded-xl bg-surface border border-theme shadow-xl p-1.5 space-y-1 z-50">
                    {colorOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAccentColor(opt.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                          accentColor === opt.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-surface-hover text-main'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${opt.bgClass}`} />
                          <span>{opt.label}</span>
                        </div>
                        {accentColor === opt.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-theme pt-1 space-y-1">
                <button
                  onClick={() => handleNavClick('settings')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-hover text-secondary hover:text-main cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
