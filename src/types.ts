export type AgentRole = 'product_manager' | 'architect' | 'engineer' | 'qa_engineer';

export type MessageStatus = 'pending' | 'thinking' | 'completed';

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  avatar: string;
  color: string;
  description: string;
  skills: string[];
}

export interface Message {
  id: string;
  from: AgentRole;
  to: AgentRole | 'all';
  content: string;
  timestamp: Date;
  status: MessageStatus;
  artifact?: Artifact;
}

export interface Artifact {
  type: 'prd' | 'design' | 'code' | 'test' | 'document';
  title: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed';
  currentStep: number;
  messages: Message[];
  artifacts: Artifact[];
  createdAt?: string;
}

export type PipelineStep = {
  agent: AgentRole;
  label: string;
  description: string;
  status: 'waiting' | 'active' | 'completed';
};
