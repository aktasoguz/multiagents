import { useState, useCallback, useRef } from 'react';
import { Message, Artifact, PipelineStep, AgentRole } from '../types';

const generatePRD = (projectName: string, description: string): string => {
  return `# Product Requirements Document (PRD)

## Project: ${projectName}

### Overview
${description}

### User Stories
1. As a user, I want to be able to interact with the system intuitively
2. As a user, I want fast and reliable responses
3. As a user, I want a clean and modern interface

### Functional Requirements
- Core feature implementation based on description
- Responsive design for all screen sizes
- Error handling and edge cases
- Data persistence layer

### Non-Functional Requirements
- Performance: < 200ms response time
- Scalability: Support 1000+ concurrent users
- Security: Input validation and sanitization
- Accessibility: WCAG 2.1 AA compliance

### Success Metrics
- User satisfaction score > 4.5/5
- Zero critical bugs at launch
- 99.9% uptime SLA`;
};

const generateDesign = (projectName: string): string => {
  return `# System Architecture Design

## Project: ${projectName}

### Architecture Pattern
- Frontend: React + TypeScript
- State Management: Context API / Redux
- Styling: Tailwind CSS
- Build Tool: Vite

### Component Hierarchy
\`\`\`
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── MainContent
├── Pages
│   ├── Dashboard
│   ├── Settings
│   └── Details
└── Shared
    ├── Button
    ├── Card
    └── Modal
\`\`\`

### Data Flow
1. User Action → Event Handler
2. State Update → Re-render
3. API Call → Data Fetch
4. Response → State Mutation

### API Endpoints
- GET /api/data - Fetch main data
- POST /api/data - Create new entry
- PUT /api/data/:id - Update entry
- DELETE /api/data/:id - Remove entry`;
};

const generateCode = (projectName: string): string => {
  return `// Implementation for: ${projectName}

import React, { useState, useEffect } from 'react';

interface DataItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
}

const App: React.FC = () => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (title: string, description: string) => {
    const newItem: DataItem = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'pending',
    };
    setItems(prev => [...prev, newItem]);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="app-container">
      <Header title="${projectName}" />
      <ItemList items={items} />
      <AddItemForm onSubmit={addItem} />
    </div>
  );
};

export default App;`;
};

const generateTests = (projectName: string): string => {
  return `// Test Suite for: ${projectName}

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('fetches and displays data on mount', async () => {
    const mockData = [
      { id: '1', title: 'Test Item', description: 'Desc', status: 'active' }
    ];
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    });
  });

  test('adds new item when form is submitted', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Item' },
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('New Item')).toBeInTheDocument();
    });
  });
});

// Test Coverage Summary
// ✅ Component rendering: PASS
// ✅ Data fetching: PASS
// ✅ Error handling: PASS
// ✅ User interactions: PASS
// ✅ State management: PASS
// Coverage: 94.2%`;
};

const getMessagesForProject = (projectName: string, description: string): { role: AgentRole; content: string; artifact?: Artifact }[] => {
  return [
    {
      role: 'product_manager',
      content: `I've analyzed the requirements for "${projectName}". Based on the description, I've prepared a comprehensive PRD that outlines the scope, user stories, and success metrics.`,
      artifact: {
        type: 'prd',
        title: `PRD - ${projectName}`,
        content: generatePRD(projectName, description),
      },
    },
    {
      role: 'architect',
      content: `I've reviewed the PRD and designed the system architecture. The tech stack will be React + TypeScript with Tailwind CSS. I've defined the component hierarchy and API contracts.`,
      artifact: {
        type: 'design',
        title: `Architecture Design - ${projectName}`,
        content: generateDesign(projectName),
      },
    },
    {
      role: 'engineer',
      content: `Architecture looks solid! I've implemented the core features following the design documents. The code is modular, well-typed, and follows best practices.`,
      artifact: {
        type: 'code',
        title: `Implementation - ${projectName}`,
        content: generateCode(projectName),
      },
    },
    {
      role: 'qa_engineer',
      content: `I've written comprehensive test suites covering all critical paths. All tests pass with 94.2% code coverage. The project is ready for deployment!`,
      artifact: {
        type: 'test',
        title: `Test Suite - ${projectName}`,
        content: generateTests(projectName),
      },
    },
  ];
};

export const useSimulation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const startSimulation = useCallback((name: string, desc: string) => {
    setProjectName(name);
    setProjectDescription(desc);
    setMessages([]);
    setCurrentStep(-1);
    setIsRunning(true);
    setSelectedArtifact(null);

    const projectMessages = getMessagesForProject(name, desc);

    projectMessages.forEach((msg, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        const newMessage: Message = {
          id: `msg-${Date.now()}-${index}`,
          from: msg.role,
          to: index < projectMessages.length - 1 ? projectMessages[index + 1].role : 'all',
          content: msg.content,
          timestamp: new Date(),
          status: 'completed',
          artifact: msg.artifact,
        };
        setMessages(prev => [...prev, newMessage]);

        if (index === projectMessages.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setCurrentStep(projectMessages.length);
          }, 1000);
        }
      }, (index + 1) * 2500);

      timeoutRef.current = timeout;
    });
  }, []);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMessages([]);
    setIsRunning(false);
    setCurrentStep(-1);
    setSelectedArtifact(null);
  }, []);

  return {
    messages,
    isRunning,
    currentStep,
    projectName,
    projectDescription,
    selectedArtifact,
    setSelectedArtifact,
    pipelineSteps: getPipelineStatus(currentStep + 1),
    startSimulation,
    reset,
  };
};
