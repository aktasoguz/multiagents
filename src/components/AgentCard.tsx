import React from 'react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  isCompleted: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, isCompleted }) => {
  return (
    <div
      className={`relative rounded-xl p-4 border transition-all duration-300 ${
        isActive
          ? 'bg-gray-800/80 border-blue-500/50 shadow-lg shadow-blue-500/10 scale-[1.02]'
          : isCompleted
          ? 'bg-gray-800/50 border-green-500/30'
          : 'bg-gray-800/30 border-gray-700/50 opacity-60'
      }`}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
      )}
      {isCompleted && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px]">
          ✓
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-3xl">{agent.avatar}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{agent.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{agent.description}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mt-3">
        {agent.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 border border-gray-700"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Status */}
      {isActive && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-blue-400">Working...</span>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
