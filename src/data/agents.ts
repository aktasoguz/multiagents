import { Agent } from '../types';

export const agents: Agent[] = [
  {
    id: 'pm',
    role: 'product_manager',
    name: 'Alice (Product Manager)',
    avatar: '👩‍💼',
    color: '#8B5CF6',
    description: 'Analyzes requirements, writes PRDs, and defines product scope.',
    skills: ['Requirements Analysis', 'PRD Writing', 'User Stories', 'Market Research'],
  },
  {
    id: 'arch',
    role: 'architect',
    name: 'Bob (Architect)',
    avatar: '👨‍💻',
    color: '#3B82F6',
    description: 'Designs system architecture, API contracts, and data models.',
    skills: ['System Design', 'API Design', 'Data Modeling', 'Tech Stack Selection'],
  },
  {
    id: 'eng',
    role: 'engineer',
    name: 'Charlie (Engineer)',
    avatar: '🧑‍🔧',
    color: '#10B981',
    description: 'Implements code based on design documents and architecture.',
    skills: ['Frontend Dev', 'Backend Dev', 'Code Review', 'Debugging'],
  },
  {
    id: 'qa',
    role: 'qa_engineer',
    name: 'Diana (QA Engineer)',
    avatar: '👩‍🔬',
    color: '#F59E0B',
    description: 'Writes tests, validates quality, and ensures requirements are met.',
    skills: ['Test Planning', 'Unit Testing', 'Integration Testing', 'Bug Reporting'],
  },
];

export const getAgent = (role: string): Agent => {
  return agents.find(a => a.role === role) || agents[0];
};
