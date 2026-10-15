import React, { useState } from 'react';

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
    { name: 'Task Manager App', desc: 'A collaborative task management application with real-time updates, team assignments, and progress tracking.' },
    { name: 'AI Chat Interface', desc: 'An intelligent chat application with conversation history, multiple AI models support, and export functionality.' },
    { name: 'E-commerce Dashboard', desc: 'An admin dashboard for e-commerce with sales analytics, inventory management, and order processing.' },
  ];

  return (
    <div className="w-full">
      {!hasStarted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Task Manager App"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want to build..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Quick examples */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick start examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => { setName(ex.name); setDescription(ex.desc); }}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            🚀 Start Multi-Agent Pipeline
          </button>
        </form>
      ) : (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">📁</span>
            <h3 className="text-sm font-semibold text-white">{name}</h3>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">{description}</p>
          {!isRunning && (
            <button
              onClick={onReset}
              className="mt-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              🔄 New Project
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectInput;
