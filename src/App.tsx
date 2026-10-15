import { useState, useEffect } from 'react';
import { agents } from './data/agents';
import { useSimulation } from './hooks/useSimulation';
import { loadAPIConfig, APIConfig } from './services/api';
import Pipeline from './components/Pipeline';
import AgentCard from './components/AgentCard';
import ChatPanel from './components/ChatPanel';
import ArtifactViewer from './components/ArtifactViewer';
import ProjectInput from './components/ProjectInput';
import SettingsModal from './components/SettingsModal';
import { Message } from './types';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfig | null>(null);

  const {
    messages,
    isRunning,
    currentStep,
    projectName,
    selectedArtifact,
    setSelectedArtifact,
    pipelineSteps,
    startSimulation,
    reset,
    error,
    setError,
  } = useSimulation();

  useEffect(() => {
    const config = loadAPIConfig();
    setApiConfig(config);
  }, []);

  const handleConfigChange = (config: APIConfig) => {
    setApiConfig(config);
    setSettingsOpen(false);
  };

  const handleStart = (name: string, desc: string) => {
    if (!apiConfig || !apiConfig.apiKey) {
      setSettingsOpen(true);
      setError('Please configure your API settings first');
      return;
    }
    setError(null);
    startSimulation(name, desc);
  };

  const handleArtifactClick = (msg: Message) => {
    if (msg.artifact) {
      setSelectedArtifact(msg.artifact);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MetaGPT Browser
              </h1>
              <p className="text-[10px] text-gray-500">Multi-Agent Software Company Simulation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRunning && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-blue-400">Running</span>
              </div>
            )}
            {!isRunning && currentStep >= 4 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-green-400">Completed</span>
              </div>
            )}
            
            {/* API Status */}
            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${
                apiConfig?.apiKey
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:border-green-500/50'
                  : 'bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-500/50 animate-pulse'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${apiConfig?.apiKey ? 'bg-green-500' : 'bg-red-500'}`} />
              {apiConfig?.apiKey ? `${apiConfig.provider}` : 'No API Key'}
            </button>

            <a
              href="https://github.com/FoundationAgents/MetaGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 animate-fadeIn">
            <span className="text-lg">⚠️</span>
            <p className="text-sm text-red-400 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* No API Key Banner */}
        {!apiConfig?.apiKey && !error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 animate-fadeIn">
            <span className="text-lg">🔑</span>
            <p className="text-sm text-yellow-400 flex-1">
              Configure your API key to start using real AI agents
            </p>
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-400 hover:bg-yellow-500/30 transition-all"
            >
              Setup API
            </button>
          </div>
        )}

        {/* Pipeline Visualization */}
        <section className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800/50 flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <h2 className="text-sm font-semibold text-gray-300">Agent Pipeline</h2>
            <span className="text-[10px] text-gray-600 ml-2">Standardized Procedural Workflow</span>
          </div>
          <Pipeline steps={pipelineSteps} />
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Project Input & Agents */}
          <div className="lg:col-span-4 space-y-6">
            {/* Project Input */}
            <section className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">🎯</span>
                <h2 className="text-sm font-semibold text-gray-300">Project Brief</h2>
              </div>
              <ProjectInput
                onStart={handleStart}
                isRunning={isRunning}
                onReset={reset}
                hasStarted={currentStep >= 0}
              />
            </section>

            {/* Agents */}
            <section className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">🤖</span>
                <h2 className="text-sm font-semibold text-gray-300">AI Agents</h2>
                <span className="text-[10px] text-gray-600 ml-auto">{agents.length} agents</span>
              </div>
              <div className="space-y-3">
                {agents.map((agent, index) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isActive={currentStep === index}
                    isCompleted={currentStep > index}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Panel - Chat */}
          <div className="lg:col-span-8">
            <section className="bg-gray-900/50 border border-gray-800/50 rounded-2xl h-[600px] flex flex-col overflow-hidden">
              <ChatPanel
                messages={messages}
                onArtifactClick={handleArtifactClick}
                isRunning={isRunning}
              />
            </section>
          </div>
        </div>

        {/* Info Section */}
        <section className="bg-gray-900/30 border border-gray-800/30 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <span>🔄</span> SOP-Driven
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                MetaGPT uses Standardized Operating Procedures to coordinate multiple AI agents, 
                mimicking a real software company's workflow.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <span>📄</span> Structured Output
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Each agent produces structured artifacts (PRDs, designs, code, tests) 
                that feed into the next agent's workflow.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <span>🧠</span> Real AI Agents
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connects to OpenAI or Anthropic APIs. Each agent uses specialized prompts 
                and passes context to the next agent in the pipeline.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConfigChange={handleConfigChange}
      />

      {/* Artifact Viewer Modal */}
      {selectedArtifact && (
        <ArtifactViewer
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
        />
      )}
    </div>
  );
}

export default App;
