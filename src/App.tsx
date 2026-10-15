import { useState, useEffect } from 'react';
import {
  Terminal, Settings, Users, Zap, GitBranch,
  FolderOpen, BookOpen, Activity, History, Trash2, Plus
} from 'lucide-react';
import { agents } from './data/agents';
import { useSimulation } from './hooks/useSimulation';
import { loadAPIConfig, APIConfig } from './services/api';
import Pipeline from './components/Pipeline';
import AgentCard from './components/AgentCard';
import ChatPanel from './components/ChatPanel';
import ArtifactViewer from './components/ArtifactViewer';
import ProjectInput from './components/ProjectInput';
import SettingsModal from './components/SettingsModal';
import CLIGuide from './components/CLIGuide';
import { Message, Project } from './types';

// Memory management
const PROJECTS_KEY = 'map_projects';
const CURRENT_PROJECT_KEY = 'map_current_project';

const loadProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveProjects = (projects: Project[]) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

const loadCurrentProjectId = (): string | null => {
  return localStorage.getItem(CURRENT_PROJECT_KEY);
};

const saveCurrentProjectId = (id: string | null) => {
  if (id) {
    localStorage.setItem(CURRENT_PROJECT_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
};

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'cli' | 'history'>('pipeline');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

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
    
    const savedProjects = loadProjects();
    setProjects(savedProjects);
    
    const savedCurrentId = loadCurrentProjectId();
    if (savedCurrentId) {
      setCurrentProjectId(savedCurrentId);
    }
  }, []);

  // Save project state when messages change
  useEffect(() => {
    if (messages.length > 0 && projectName) {
      const existingProject = projects.find(p => p.id === currentProjectId);
      
      const status: 'idle' | 'running' | 'completed' = isRunning ? 'running' : currentStep >= 4 ? 'completed' : 'idle';
      
      if (existingProject) {
        // Update existing project
        const updatedProjects = projects.map(p => 
          p.id === currentProjectId 
            ? { ...p, messages, name: projectName, status }
            : p
        );
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
      } else {
        // Create new project
        const newProject: Project = {
          id: Date.now().toString(),
          name: projectName,
          description: '',
          status,
          currentStep,
          messages,
          artifacts: messages.filter(m => m.artifact).map(m => m.artifact!),
          createdAt: new Date().toISOString(),
        };
        
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
        setCurrentProjectId(newProject.id);
        saveCurrentProjectId(newProject.id);
      }
    }
  }, [messages, projectName, isRunning, currentStep]);

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

  const handleNewProject = () => {
    reset();
    setCurrentProjectId(null);
    saveCurrentProjectId(null);
  };

  const handleLoadProject = (project: Project) => {
    setCurrentProjectId(project.id);
    saveCurrentProjectId(project.id);
    // TODO: Load project messages into simulation
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
      saveCurrentProjectId(null);
    }
  };

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
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
            {projects.length > 0 && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-500">
                {projects.length}
              </span>
            )}
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

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="px-2 py-1.5 text-[10px] text-gray-700 text-center">
            Local Mode • No Login Required
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
              <span className="text-gray-700 mx-1">/</span>
              <span className="text-gray-400">
                {activeTab === 'pipeline' ? 'Pipeline' : activeTab === 'history' ? 'History' : 'CLI Guide'}
              </span>
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
          ) : activeTab === 'history' ? (
            <div className="p-6 max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Project History</h2>
                  <p className="text-xs text-gray-600 mt-1">{projects.length} projects saved locally</p>
                </div>
                <button
                  onClick={handleNewProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-600 text-xs text-white font-medium hover:bg-violet-500 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  New Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                  <History className="w-12 h-12 mb-3 text-gray-700" />
                  <p className="text-sm">No projects yet</p>
                  <p className="text-xs text-gray-700 mt-1">Start a new project from the Pipeline tab</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">{project.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[11px] ${
                            project.status === 'completed' ? 'text-emerald-400' :
                            project.status === 'running' ? 'text-violet-400' : 'text-gray-600'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-[11px] text-gray-700">
                            {project.messages.length} messages
                          </span>
                          <span className="text-[11px] text-gray-700">
                            {new Date(project.messages[0]?.timestamp || project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleLoadProject(project)}
                          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
