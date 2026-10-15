import { useState, useCallback, useRef } from 'react';
import { Message, Artifact, PipelineStep, AgentRole } from '../types';
import { APIConfig, callAPI, loadAPIConfig } from '../services/api';
import { getAgentPrompts, getAgentMessage } from '../services/prompts';

const getArtifactType = (role: AgentRole): Artifact['type'] => {
  switch (role) {
    case 'product_manager': return 'prd';
    case 'architect': return 'design';
    case 'engineer': return 'code';
    case 'qa_engineer': return 'test';
    default: return 'document';
  }
};

const getArtifactTitle = (role: AgentRole, projectName: string): string => {
  switch (role) {
    case 'product_manager': return `PRD - ${projectName}`;
    case 'architect': return `Architecture - ${projectName}`;
    case 'engineer': return `Implementation - ${projectName}`;
    case 'qa_engineer': return `Test Suite - ${projectName}`;
    default: return `Document - ${projectName}`;
  }
};

const agentRoles: AgentRole[] = ['product_manager', 'architect', 'engineer', 'qa_engineer'];

export const useSimulation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<boolean>(false);

  const pipelineSteps: PipelineStep[] = [
    { agent: 'product_manager', label: 'Requirements', description: 'Analyze & write PRD', status: 'waiting' },
    { agent: 'architect', label: 'Architecture', description: 'Design system & APIs', status: 'waiting' },
    { agent: 'engineer', label: 'Implementation', description: 'Write production code', status: 'waiting' },
    { agent: 'qa_engineer', label: 'Testing', description: 'Validate & test', status: 'waiting' },
  ];

  const getPipelineStatus = useCallback((step: number): PipelineStep[] => {
    return pipelineSteps.map((s, i) => ({
      ...s,
      status: i < step ? 'completed' : i === step ? 'active' : 'waiting',
    }));
  }, []);

  const startSimulation = useCallback(async (name: string, desc: string) => {
    const config = loadAPIConfig();
    
    if (!config || !config.apiKey) {
      setError('Please configure your API settings first (click the gear icon ⚙️)');
      return;
    }

    setProjectName(name);
    setProjectDescription(desc);
    setMessages([]);
    setCurrentStep(-1);
    setIsRunning(true);
    setSelectedArtifact(null);
    setError(null);
    abortRef.current = false;

    let previousArtifact = '';
    let previousArtifactType = '';

    for (let i = 0; i < agentRoles.length; i++) {
      if (abortRef.current) break;

      const role = agentRoles[i];
      setCurrentStep(i);

      // Add thinking message
      const thinkingId = `thinking-${Date.now()}-${i}`;
      setMessages(prev => [...prev, {
        id: thinkingId,
        from: role,
        to: i < agentRoles.length - 1 ? agentRoles[i + 1] : 'all',
        content: '',
        timestamp: new Date(),
        status: 'thinking',
      }]);

      try {
        const prompts = getAgentPrompts(role, {
          projectName: name,
          description: desc,
          previousArtifact,
          previousArtifactType,
        });

        const response = await callAPI(config, prompts.system, prompts.user);

        if (abortRef.current) break;

        if (response.error) {
          throw new Error(response.error);
        }

        const artifact: Artifact = {
          type: getArtifactType(role),
          title: getArtifactTitle(role, name),
          content: response.content,
        };

        const messageContent = getAgentMessage(role, name, response.content);

        // Replace thinking message with completed message
        setMessages(prev => prev.map(msg => 
          msg.id === thinkingId 
            ? {
                ...msg,
                content: messageContent,
                status: 'completed' as const,
                artifact,
              }
            : msg
        ));

        previousArtifact = response.content;
        previousArtifactType = artifact.type;

        // Wait a bit before next agent
        if (i < agentRoles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        
        // Update thinking message with error
        setMessages(prev => prev.map(msg => 
          msg.id === thinkingId 
            ? {
                ...msg,
                content: `❌ Error: ${errorMessage}`,
                status: 'completed' as const,
              }
            : msg
        ));

        setError(errorMessage);
        setIsRunning(false);
        return;
      }
    }

    if (!abortRef.current) {
      setIsRunning(false);
      setCurrentStep(agentRoles.length);
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setIsRunning(false);
    setCurrentStep(-1);
    setSelectedArtifact(null);
    setError(null);
  }, []);

  return {
    messages,
    isRunning,
    currentStep,
    projectName,
    projectDescription,
    selectedArtifact,
    setSelectedArtifact,
    error,
    setError,
    pipelineSteps: getPipelineStatus(currentStep + 1),
    startSimulation,
    reset,
  };
};
