'use client';

import React from 'react';
import { Plus, MoreHorizontal, FolderKanban } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="w-full space-y-4">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-main">Projects</h2>
          <p className="text-xs text-muted">Manage active workspace project pipelines</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
          Add Project
        </Button>
      </div>

      {/* Projects Table */}
      <div className="w-full bg-surface border border-theme rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-hover/60 text-muted uppercase text-[11px] font-semibold border-b border-theme">
              <tr>
                <th className="px-6 py-3.5">Project Name</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Project Lead</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Total Tasks</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onSelectProject && onSelectProject(project)}
                  className="hover:bg-surface-hover/50 transition-colors cursor-pointer"
                >
                  {/* Project Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-main hover:text-accent transition-colors">
                        {project.name}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="priority" priority={project.priority} />
                  </td>

                  {/* Lead */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.lead ? (
                      <div className="flex items-center gap-2">
                        <Avatar user={project.lead} size="sm" />
                        <span className="text-main font-medium">{project.lead.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted italic">Unassigned</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-secondary font-medium">
                    {project.dueDate || '-'}
                  </td>

                  {/* Task Count */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-main">
                    {project.taskCount} tasks
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
    </div>
  );
};
