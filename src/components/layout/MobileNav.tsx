'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  activeTab: 'tasks' | 'projects' | 'settings';
  setActiveTab: (tab: 'tasks' | 'projects' | 'settings') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden w-full bg-surface border-b border-theme px-4 py-3 flex items-center justify-between z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-accent text-white font-bold flex items-center justify-center text-xs">
          D
        </div>
        <span className="font-bold text-main text-sm">Dexter</span>
      </div>

      {/* Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-secondary hover:text-main hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
        aria-label="Open mobile navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-72 max-w-[80vw] bg-surface h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <span className="font-bold text-main">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-muted hover:text-main rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCloseMobile={() => setIsOpen(false)}
              className="w-full border-r-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};
