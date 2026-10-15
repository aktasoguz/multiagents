import React from 'react';
import { Message } from '../types';
import { getAgent } from '../data/agents';
import { MessageSquare, FileText, Layout, Code2, TestTube2, ArrowRight, Loader2, Hash } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onArtifactClick: (message: Message) => void;
  isRunning?: boolean;
}

const getArtifactIcon = (type: string) => {
  switch (type) {
    case 'prd': return FileText;
    case 'design': return Layout;
    case 'code': return Code2;
    case 'test': return TestTube2;
    default: return FileText;
  }
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onArtifactClick, isRunning }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.06]">
        <MessageSquare className="w-4 h-4 text-gray-500" />
        <h3 className="text-xs font-medium text-gray-400">Agent Communication</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-gray-700" />
          <span className="text-[11px] text-gray-600">{messages.length} messages</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && !isRunning && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <MessageSquare className="w-10 h-10 mb-3 text-gray-700" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-gray-700 mt-1">Start a project to see agent communications</p>
          </div>
        )}

        {messages.length === 0 && isRunning && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <Loader2 className="w-8 h-8 mb-3 text-violet-500/50 animate-spin" />
            <p className="text-sm text-gray-500">Initializing agents...</p>
          </div>
        )}

        {messages.map((msg) => {
          const agent = getAgent(msg.from);
          const toAgent = msg.to === 'all' ? null : getAgent(msg.to);

          return (
            <div
              key={msg.id}
              className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4 hover:border-white/[0.1] transition-colors"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: `${agent.color}15` }}>
                  <span>{agent.avatar}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: agent.color }}>
                  {agent.name.split(' ')[0]}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-700" />
                {toAgent ? (
                  <span className="text-[11px] text-gray-500">{toAgent.name.split(' ')[0]}</span>
                ) : (
                  <span className="text-[11px] text-gray-500">everyone</span>
                )}
                <span className="text-[10px] text-gray-700 ml-auto">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Content */}
              {msg.status === 'thinking' ? (
                <div className="flex items-center gap-2 py-1">
                  <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                  <span className="text-xs text-violet-400/70">Processing...</span>
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>
              )}

              {/* Artifact */}
              {msg.artifact && (
                <button
                  onClick={() => onArtifactClick(msg)}
                  className="mt-3 flex items-center gap-2.5 px-3 py-2 rounded-md bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-all group w-full text-left"
                >
                  {(() => {
                    const Icon = getArtifactIcon(msg.artifact!.type);
                    return <Icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-400 group-hover:text-violet-300 transition-colors truncate">
                      {msg.artifact.title}
                    </p>
                    <p className="text-[10px] text-gray-700">Click to view</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-700 group-hover:text-violet-400 transition-colors" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatPanel;
