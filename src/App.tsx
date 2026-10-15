import { useState, useEffect } from 'react';
import {
  Terminal, Settings, LogOut, Users, Zap, GitBranch,
  MessageSquare, ChevronRight, Activity, FolderOpen,
  BookOpen, Bell, Search
} from 'lucide-react';
import { agents } from './data/agents';
import { useSimulation } from './hooks/useSimulation';
import { getSession, logout, User } from './services/auth';
import { loadAPIConfig, APIConfig } from './services/api';
import Pipeline from './components/Pipeline';
import AgentCard from './components/AgentCard';
import ChatPanel from './components/ChatPanel';
import ArtifactViewer from './components/ArtifactViewer';
import ProjectInput from './components/ProjectInput';
import SettingsModal from './components/SettingsModal';
import CLIGuide from './components/CLIGuide';
import AuthPage from './components/AuthPage';
import { Message } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'cli'>('pipeline');

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
    const session = getSession();
    setUser(session);
    const config = loadAPIConfig();
    setApiConfig(config);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleConfigChange = (config: APIConfig) => {
    setApiConfig(config);
    setSettingsOpen(false);
  };

  const handleStart = (name: string, desc: string) => {
    if (!apiConfig || !apiConfig.apiKey) {
      setSettingsOpen(true);
      setError('Configure your API key first');
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

  // Not authenticated
  if (!user) {
    return <AuthPage onAuth={() => setUser(getSession())} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/[0.06] flex flex-col bg-[#0c0c14]">
        {/* Logo */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">MultiAgent</h1>
              <p className="text-[10px] text-gray-600">Platform v0.1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'cli'
                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            CLI Guide
          </button>

          <div className="pt-4 pb-2">
            <p className="px-3 text-[10px] text-gray-700 uppercase tracking-wider font-medium">Resources</p>
          </div>
          <a
            href="https://github.com/FoundationAgents/MetaGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Documentation
          </a>
          <a
            href="https://github.com/FoundationAgents/MetaGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            GitHub
          </a>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/[0.08] flex items-center justify-center">
              <span className="text-[10px] font-bold text-violet-300">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">{user.username}</p>
              <p className="text-[10px] text-gray-600 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 border-b border-white/[0.06] flex items-center justify-between px-5 bg-[#0c0c14]/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <FolderOpen className="w-3 h-3" />
              <span>workspace</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">{activeTab === 'pipeline' ? 'Pipeline' : 'CLI Guide'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status indicators */}
            {isRunning && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-violet-400">Running</span>
              </div>
            )}
            {!isRunning && currentStep >= 4 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-[11px] text-emerald-400">Complete</span>
              </div>
            )}

            {/* API status */}
            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-all ${
                apiConfig?.apiKey
                  ? 'bg-white/[0.02] border-white/[0.06] text-gray-500 hover:border-white/[0.12]'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-500/40'
              }`}
            >
              <Settings className="w-3 h-3" />
              {apiConfig?.apiKey ? `${apiConfig.provider} • ${apiConfig.model}` : 'Setup API'}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'cli' ? (
            <div className="p-6 max-w-2xl">
              <CLIGuide />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Error Banner */}
              {error && (
                <div className="mx-5 mt-4 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Zap className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400 flex-1">{error}</p>
                  <button onClick={() => setError(null)} className="text-xs text-red-400/70 hover:text-red-400">✕</button>
                </div>
              )}

              {/* Pipeline */}
              <div className="mx-5 mt-4 rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-400">Workflow Pipeline</span>
                </div>
                <Pipeline steps={pipelineSteps} />
              </div>

              {/* Main Grid */}
              <div className="flex-1 grid grid-cols-12 gap-4 p-5 min-h-0">
                {/* Left Column */}
                <div className="col-span-3 space-y-4 overflow-y-auto">
                  {/* Project */}
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FolderOpen className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Project</span>
                    </div>
                    <ProjectInput
                      onStart={handleStart}
                      isRunning={isRunning}
                      onReset={reset}
                      hasStarted={currentStep >= 0}
                    />
                  </div>

                  {/* Agents */}
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Agents</span>
                      <span className="text-[10px] text-gray-700 ml-auto">{agents.length}</span>
                    </div>
                    <div className="space-y-2">
                      {agents.map((agent, index) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          isActive={currentStep === index}
                          isCompleted={currentStep > index}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Chat */}
                <div className="col-span-9 rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden flex flex-col min-h-0">
                  <ChatPanel
                    messages={messages}
                    onArtifactClick={handleArtifactClick}
                    isRunning={isRunning}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConfigChange={handleConfigChange}
      />

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
