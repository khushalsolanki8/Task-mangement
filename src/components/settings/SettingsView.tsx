'use client';

import React, { useState } from 'react';
import { Camera, Edit2, LogOut, ShieldAlert } from 'lucide-react';
import { MOCK_USERS } from '@/data/mockData';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';

export const SettingsView: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-main">Profile Settings</h2>
        <p className="text-xs text-muted">Manage your account credentials, avatar, and workspace access</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-surface border border-theme rounded-2xl space-y-6 shadow-xs">
        {/* Avatar Upload Area */}
        <div className="flex items-center gap-5 pb-6 border-b border-theme">
          <div className="relative group cursor-pointer">
            <Avatar user={currentUser} size="lg" className="w-16 h-16 text-lg" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-main">Profile Picture</h4>
            <p className="text-xs text-muted">PNG or JPG up to 2MB</p>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={currentUser.name}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
          />

          <Input
            label="Email Address"
            value={currentUser.email || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            rightIcon={<Edit2 className="w-4 h-4 text-muted cursor-pointer" />}
          />

          <Input
            label="Job Title"
            defaultValue="Designer"
            helperText="Your job title or role within the workspace"
          />

          <Input
            label="Username"
            defaultValue="Dexuser"
            helperText="One word, like a nickname or first name"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-theme">
          {isSaved && <span className="text-xs text-emerald-600 font-semibold">Settings saved successfully!</span>}
          <div className="ml-auto">
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
          </div>
        </div>
      </form>

      {/* Workspace Danger Zone Card */}
      <div className="p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Workspace Access
            </h3>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
              Remove yourself from the workspace. You will lose access to all tasks and project data.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={() => setIsLeaveModalOpen(true)}
          >
            Leave Workspace
          </Button>
        </div>
      </div>

      {/* Leave Workspace Modal Confirmation */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Workspace?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
              Confirm & Leave
            </Button>
          </>
        }
      >
        <p className="text-sm text-secondary">
          Are you sure you want to leave the <strong className="text-main">Dexter</strong> workspace? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
