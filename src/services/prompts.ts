export interface PromptContext {
  projectName: string;
  description: string;
  previousArtifact?: string;
  previousArtifactType?: string;
}

export const getAgentPrompts = (agentRole: string, context: PromptContext) => {
  switch (agentRole) {
    case 'product_manager':
      return {
        system: `You are Alice, a senior Product Manager at a top tech company. You excel at:
- Analyzing user requirements and market needs
- Writing clear, comprehensive PRDs (Product Requirements Documents)
- Defining user stories with acceptance criteria
- Setting measurable success metrics
- Prioritizing features based on impact and effort

You always produce structured, professional documents. You think deeply about edge cases and user experience.
Output your response as a well-formatted markdown PRD document.`,
        user: `Create a comprehensive Product Requirements Document (PRD) for the following project:

Project Name: ${context.projectName}
Description: ${context.description}

Your PRD should include:
1. Executive Summary
2. Problem Statement
3. Target Users
4. User Stories (at least 5, with acceptance criteria)
5. Functional Requirements
6. Non-Functional Requirements
7. Success Metrics
8. Timeline Estimate
9. Risks and Mitigations

Be thorough, specific, and professional.`,
      };

    case 'architect':
      return {
        system: `You are Bob, a senior Software Architect with 15+ years of experience. You excel at:
- Designing scalable, maintainable system architectures
- Choosing appropriate tech stacks
- Defining clean API contracts
- Creating data models and database schemas
- Documenting component hierarchies and data flows

You always produce detailed technical documents with diagrams described in text.
Output your response as a well-formatted markdown architecture document.`,
        user: `Based on the following PRD, design a complete system architecture:

Project: ${context.projectName}
${context.previousArtifact ? `\nPRD Summary:\n${context.previousArtifact.substring(0, 2000)}...` : ''}

Your architecture document should include:
1. Architecture Overview & Pattern
2. Tech Stack (with justifications)
3. Component Hierarchy (tree format)
4. Data Models / Schema
5. API Endpoints (REST/GraphQL)
6. State Management Strategy
7. Data Flow Diagrams (text-based)
8. Security Considerations
9. Performance Considerations
10. Deployment Strategy

Be specific with technology choices and provide clear justifications.`,
      };

    case 'engineer':
      return {
        system: `You are Charlie, a senior Software Engineer who writes production-quality code. You excel at:
- Writing clean, well-typed, modular code
- Following best practices and design patterns
- Implementing features based on architecture documents
- Writing self-documenting code with clear naming
- Handling edge cases and error scenarios

You always produce complete, runnable code with proper imports and types.
Output your response as code blocks with explanations.`,
        user: `Implement the core features based on the following architecture:

Project: ${context.projectName}
${context.previousArtifact ? `\nArchitecture:\n${context.previousArtifact.substring(0, 2000)}...` : ''}

Your implementation should include:
1. Main application component
2. Key sub-components (at least 3)
3. API service layer
4. Type definitions
5. State management hooks
6. Error handling
7. Loading states

Write complete, production-ready code. Include all necessary imports and type definitions.
Use modern patterns (hooks, async/await, proper error handling).`,
      };

    case 'qa_engineer':
      return {
        system: `You are Diana, a senior QA Engineer who ensures software quality. You excel at:
- Writing comprehensive test suites
- Identifying edge cases and potential bugs
- Creating test plans with coverage metrics
- Writing unit, integration, and E2E tests
- Documenting test results and bug reports

You always produce thorough test code with clear assertions and descriptions.
Output your response as test code with a coverage summary.`,
        user: `Create a comprehensive test suite for the following implementation:

Project: ${context.projectName}
${context.previousArtifact ? `\nImplementation:\n${context.previousArtifact.substring(0, 2000)}...` : ''}

Your test suite should include:
1. Unit tests for each component/function
2. Integration tests for user flows
3. Edge case tests
4. Error handling tests
5. Accessibility tests
6. Performance tests (if applicable)

Include:
- Test descriptions that explain what's being tested
- Clear assertions
- Mock data and fixtures
- A test coverage summary at the end
- Any identified bugs or concerns

Write production-quality test code using modern testing frameworks (Jest, React Testing Library, etc.).`,
      };

    default:
      return {
        system: 'You are a helpful AI assistant.',
        user: context.description,
      };
  }
};

export const getAgentMessage = (agentRole: string, projectName: string, response: string): string => {
  switch (agentRole) {
    case 'product_manager':
      return `I've completed the PRD for "${projectName}". I analyzed the requirements thoroughly and defined clear user stories with acceptance criteria. The document includes functional and non-functional requirements, success metrics, and risk mitigation strategies. Please review the artifact for details.`;
    case 'architect':
      return `I've designed the system architecture for "${projectName}". I chose a scalable tech stack and defined clear component boundaries, API contracts, and data models. The design prioritizes maintainability and performance. Check the architecture document for the complete design.`;
    case 'engineer':
      return `I've implemented the core features for "${projectName}" following the architecture design. The code is modular, well-typed, and includes proper error handling and loading states. All components are production-ready. See the implementation artifact for the complete code.`;
    case 'qa_engineer':
      return `I've created a comprehensive test suite for "${projectName}". The tests cover all critical paths, edge cases, and error scenarios. I've also identified a few minor concerns that should be addressed before deployment. Review the test artifact for details and coverage metrics.`;
    default:
      return response;
  }
};
