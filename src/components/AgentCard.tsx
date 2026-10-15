import React from 'react';
import { Agent } from '../types';
import { CheckCircle2, Loader2, Briefcase, Code2, Wrench, TestTube2 } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  isCompleted: boolean;
}

const getAgentIcon = (role: string) => {
  switch (role) {
    case 'product_manager': return Briefcase;
    case 'architect': return Code2;
    case 'engineer': return Wrench;
    case 'qa_engineer': return TestTube2;
    default: return Briefcase;
  }
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, isCompleted }) => {
  const Icon = getAgentIcon(agent.role);

  return (
    <div
      className={`relative rounded-lg p-3.5 border transition-all duration-300 ${
        isActive
          ? 'bg-violet-500/[0.04] border-violet-500/30 shadow-sm shadow-violet-500/5'
          : isCompleted
          ? 'bg-emerald-500/[0.03] border-emerald-500/20'
          : 'bg-white/[0.02] border-white/[0.06]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isActive ? 'bg-violet-500/10' : isCompleted ? 'bg-emerald-500/10' : 'bg-white/[0.04]'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : isActive ? (
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
          ) : (
            <Icon className="w-4 h-4 text-gray-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-xs font-semibold truncate ${
              isActive ? 'text-violet-300' : isCompleted ? 'text-emerald-300' : 'text-gray-400'
            }`}>
              {agent.name}
            </h3>
            {isActive && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-medium">
                active
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{agent.description}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mt-2.5 ml-12">
        {agent.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.03] text-gray-600 border border-white/[0.04]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AgentCard;
