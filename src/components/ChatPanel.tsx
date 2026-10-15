import React from 'react';
import { Message } from '../types';
import { getAgent } from '../data/agents';

interface ChatPanelProps {
  messages: Message[];
  onArtifactClick: (message: Message) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onArtifactClick }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <h3 className="text-sm font-semibold text-gray-300">Agent Communication Channel</h3>
        <span className="text-xs text-gray-500 ml-auto">{messages.length} messages</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="text-4xl mb-3">💬</span>
            <p className="text-sm">Start a project to see agent communications</p>
          </div>
        )}

        {messages.map((msg) => {
          const agent = getAgent(msg.from);
          const toAgent = msg.to === 'all' ? null : getAgent(msg.to);

          return (
            <div
              key={msg.id}
              className="animate-fadeIn rounded-xl bg-gray-800/50 border border-gray-700/50 p-4 hover:border-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent.avatar}</span>
                <span className="text-xs font-semibold" style={{ color: agent.color }}>
                  {agent.name}
                </span>
                <span className="text-gray-600 text-xs">→</span>
                {toAgent ? (
                  <span className="text-xs text-gray-400">{toAgent.name}</span>
                ) : (
                  <span className="text-xs text-gray-400">Everyone</span>
                )}
                <span className="text-[10px] text-gray-600 ml-auto">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>

              {msg.artifact && (
                <button
                  onClick={() => onArtifactClick(msg)}
                  className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 hover:border-blue-500/50 hover:bg-gray-700 transition-all group w-full text-left"
                >
                  <span className="text-lg">
                    {msg.artifact.type === 'prd' ? '📋' :
                     msg.artifact.type === 'design' ? '🏗️' :
                     msg.artifact.type === 'code' ? '💻' :
                     msg.artifact.type === 'test' ? '🧪' : '📄'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-300 group-hover:text-blue-400 transition-colors">
                      {msg.artifact.title}
                    </p>
                    <p className="text-[10px] text-gray-500">Click to view artifact</p>
                  </div>
                  <span className="text-gray-500 group-hover:text-blue-400 transition-colors">→</span>
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
