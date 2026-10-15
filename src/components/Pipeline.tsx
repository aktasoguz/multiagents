import React from 'react';
import { PipelineStep } from '../types';
import { CheckCircle2, Loader2, FileText, Layout, Code2, TestTube2, ArrowRight } from 'lucide-react';

interface PipelineProps {
  steps: PipelineStep[];
}

const getStepIcon = (agent: string) => {
  switch (agent) {
    case 'product_manager': return FileText;
    case 'architect': return Layout;
    case 'engineer': return Code2;
    case 'qa_engineer': return TestTube2;
    default: return FileText;
  }
};

const Pipeline: React.FC<PipelineProps> = ({ steps }) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-5">
      {steps.map((step, index) => {
        const Icon = getStepIcon(step.agent);
        return (
          <React.Fragment key={step.agent}>
            <div className="flex flex-col items-center relative group">
              {/* Icon container */}
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-500 border ${
                  step.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : step.status === 'active'
                    ? 'bg-violet-500/10 border-violet-500/30 shadow-sm shadow-violet-500/10'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : step.status === 'active' ? (
                  <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <p className={`text-[11px] font-medium ${
                  step.status === 'active' ? 'text-violet-400' :
                  step.status === 'completed' ? 'text-emerald-400' : 'text-gray-600'
                }`}>
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-3 flex items-center">
                <div className="flex-1 h-px bg-white/[0.06] relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                      step.status === 'completed' ? 'bg-emerald-500/50 w-full' :
                      step.status === 'active' ? 'bg-violet-500/50 w-1/2' : 'w-0'
                    }`}
                  />
                </div>
                <ArrowRight className={`w-3 h-3 mx-1 ${
                  step.status === 'completed' ? 'text-emerald-500/50' :
                  step.status === 'active' ? 'text-violet-500/50' : 'text-gray-700'
                }`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Pipeline;
