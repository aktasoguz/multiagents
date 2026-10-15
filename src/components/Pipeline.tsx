import React from 'react';
import { PipelineStep } from '../types';
import { getAgent } from '../data/agents';

interface PipelineProps {
  steps: PipelineStep[];
}

const Pipeline: React.FC<PipelineProps> = ({ steps }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-6">
      {steps.map((step, index) => {
        const agent = getAgent(step.agent);
        return (
          <React.Fragment key={step.agent}>
            <div className="flex flex-col items-center relative group">
              {/* Status indicator */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-500 border-3 shadow-lg ${
                  step.status === 'completed'
                    ? 'bg-green-500/20 border-green-500 scale-100'
                    : step.status === 'active'
                    ? 'bg-blue-500/20 border-blue-500 scale-110 animate-pulse'
                    : 'bg-gray-700/50 border-gray-600 scale-95 opacity-60'
                }`}
                style={{ borderWidth: '3px' }}
              >
                {step.status === 'completed' ? '✅' : agent.avatar}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <p className={`text-xs font-bold ${
                  step.status === 'active' ? 'text-blue-400' :
                  step.status === 'completed' ? 'text-green-400' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">{step.description}</p>
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                <p className="text-xs text-gray-300">{agent.name}</p>
                <p className="text-[10px] text-gray-500">{agent.description}</p>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 h-1 rounded-full overflow-hidden bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    step.status === 'completed' ? 'bg-green-500 w-full' :
                    step.status === 'active' ? 'bg-blue-500 w-1/2 animate-pulse' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Pipeline;
