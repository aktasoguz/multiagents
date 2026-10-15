import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

const CLIGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const commands = [
    { cmd: 'map init', desc: 'Initialize a new project' },
    { cmd: 'map run "Build a todo app"', desc: 'Run the multi-agent pipeline' },
    { cmd: 'map status', desc: 'Check current pipeline status' },
    { cmd: 'map config set api-key sk-...', desc: 'Configure API key' },
    { cmd: 'map logs', desc: 'View agent communication logs' },
    { cmd: 'map artifacts list', desc: 'List generated artifacts' },
  ];

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">CLI Commands</h3>
      </div>

      <div className="space-y-2">
        {commands.map((item, index) => (
          <div
            key={index}
            className="group flex items-center gap-2 p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all"
          >
            <code className="flex-1 text-xs font-mono text-emerald-400/80 truncate">
              {item.cmd}
            </code>
            <button
              onClick={() => handleCopy(item.cmd, index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.06]"
            >
              {copiedIndex === index ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Install CLI: <code className="text-violet-400/70 font-mono">npm install -g multiagent-platform</code>
        </p>
      </div>
    </div>
  );
};

export default CLIGuide;
