# MultiAgent Platform

A CLI-first multi-agent orchestration platform inspired by [MetaGPT](https://github.com/FoundationAgents/MetaGPT). Run AI agents from your terminal, manage workflows through a local browser dashboard.

## Features

- 🖥️ **CLI First** - Run agents from your terminal
- 🌐 **Browser Dashboard** - Visual management interface (no login required)
- 🤖 **Multi-Agent** - PM, Architect, Engineer, QA roles working together
- 💾 **Local Memory** - Projects and state saved locally, nothing leaves your machine
- 🔧 **Flexible API** - OpenAI, Anthropic, or any OpenAI-compatible endpoint
- 📄 **Structured Output** - PRDs, designs, code, tests generated automatically

## Installation

```bash
npm install -g multiagentmanager
```

## Quick Start

```bash
# Start the dashboard (opens browser automatically)
mm start

# Or run a project directly from CLI
mm run "Build a task management app with React"

# Check status
mm status

# View logs
mm logs
```

## CLI Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `mm start` | `mm s` | Start dashboard server & open browser |
| `mm run <desc>` | `mm r` | Run a new project |
| `mm status` | `mm st` | Show current project status |
| `mm list` | `mm ls` | List all projects |
| `mm logs` | `mm l` | View agent communication logs |
| `mm open` | `mm o` | Open dashboard in browser |
| `mm config <key> [value]` | | Configure API settings |
| `mm clear` | | Clear all data |

## Configuration

### API Setup

```bash
# Set API provider
mm config provider openai

# Set model (any model name)
mm config model gpt-4o

# Set API key
mm config api-key sk-...
```

### Custom Endpoints

Works with any OpenAI-compatible API:

```bash
mm config provider custom
mm config base-url https://your-api.com/v1
mm config model your-model
mm config api-key your-key
```

## How It Works

1. **Product Manager** analyzes requirements and writes a PRD
2. **Architect** designs system architecture based on the PRD
3. **Engineer** implements code following the architecture
4. **QA Engineer** writes tests and validates the implementation

Each agent passes context to the next, creating a complete software development workflow.

## Architecture

```
multiagentmanager/
├── bin/                    # CLI entry point
├── src/
│   ├── components/         # React dashboard components
│   ├── services/           # API & data services
│   ├── hooks/              # React hooks
│   └── types.ts            # TypeScript types
├── dist/                   # Built dashboard (served by CLI)
└── package.json
```

## Data Storage

All data is stored locally in `~/.multiagentmanager/`:
- `state.json` - Project history and current state
- `config.json` - API configuration

## Development

```bash
# Install dependencies
npm install

# Build dashboard
npm run build

# Run CLI locally
node bin/multiagentmanager.js start
```

## Inspired By

- [MetaGPT](https://github.com/FoundationAgents/MetaGPT) - Multi-agent framework with SOP-driven workflow

## License

MIT
