import React, { useState } from 'react';
import { Play, RotateCcw, FolderOpen } from 'lucide-react';

interface ProjectInputProps {
  onStart: (name: string, description: string) => void;
  isRunning: boolean;
  onReset: () => void;
  hasStarted: boolean;
}

const ProjectInput: React.FC<ProjectInputProps> = ({ onStart, isRunning, onReset, hasStarted }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onStart(name.trim(), description.trim());
    }
  };

  const examples = [
    { name: 'Task Manager', desc: 'A collaborative task management app with real-time updates and team assignments.' },
    { name: 'AI Chat Interface', desc: 'Chat application with conversation history, multiple AI models, and export features.' },
    { name: 'E-commerce Dashboard', desc: 'Admin dashboard with sales analytics, inventory management, and order processing.' },
  ];

  return (
    <div className="w-full">
      {!hasStarted ? (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome App"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want to build..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Quick examples */}
          <div>
            <p className="text-[10px] text-gray-700 mb-1.5 uppercase tracking-wider">Quick start</p>
            <div className="flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => { setName(ex.name); setDescription(ex.desc); }}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-violet-400 hover:border-violet-500/30 transition-all"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-sm hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            Start Pipeline
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <FolderOpen className="w-4 h-4 text-violet-400" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-white truncate">{name}</h3>
              <p className="text-[11px] text-gray-600 truncate">{description}</p>
            </div>
          </div>
          {!isRunning && (
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              New Project
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectInput;
