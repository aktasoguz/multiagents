#!/usr/bin/env node

const { program } = require('commander');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const DATA_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.multiagentmanager');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// State management
const loadState = () => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading state:', e.message);
  }
  return { projects: [], currentProject: null };
};

const saveState = (state) => {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
};

const loadConfig = () => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading config:', e.message);
  }
  return {};
};

const saveConfig = (config) => {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
};

// CLI Commands
program
  .name('multiagentmanager')
  .description('Multi-Agent Platform - Orchestrate AI agents like a software company')
  .version('0.1.0');

program
  .command('start')
  .alias('s')
  .description('Start the dashboard server and open in browser')
  .option('-p, --port <port>', 'Port number', '3000')
  .action((options) => {
    const port = parseInt(options.port);
    console.log(`\n🚀 Starting MultiAgent Platform on port ${port}...\n`);
    
    // Start server
    const server = http.createServer((req, res) => {
      // Serve the built React app
      const filePath = path.join(__dirname, '..', 'dist', req.url === '/' ? 'index.html' : req.url);
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
        }[ext] || 'text/plain';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    server.listen(port, () => {
      console.log(`✓ Dashboard running at http://localhost:${port}\n`);
      console.log('Press Ctrl+C to stop\n');
      
      // Open browser
      const url = `http://localhost:${port}`;
      const command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${command} ${url}`);
    });
  });

program
  .command('run <description>')
  .alias('r')
  .description('Run a new project with the given description')
  .action((description) => {
    const state = loadState();
    const project = {
      id: Date.now().toString(),
      description,
      status: 'running',
      createdAt: new Date().toISOString(),
      messages: [],
    };
    
    state.projects.push(project);
    state.currentProject = project.id;
    saveState(state);
    
    console.log(`\n🎯 Starting project: ${description}\n`);
    console.log('Use "mm status" to check progress');
    console.log('Use "mm open" to view in browser\n');
  });

program
  .command('status')
  .alias('st')
  .description('Show current project status')
  .action(() => {
    const state = loadState();
    
    if (!state.currentProject) {
      console.log('\n⚠️  No active project\n');
      console.log('Use "mm run <description>" to start a new project\n');
      return;
    }
    
    const project = state.projects.find(p => p.id === state.currentProject);
    if (!project) {
      console.log('\n⚠️  Project not found\n');
      return;
    }
    
    console.log(`\n📁 Project: ${project.description}`);
    console.log(`📊 Status: ${project.status}`);
    console.log(`💬 Messages: ${project.messages.length}`);
    console.log(`📅 Created: ${new Date(project.createdAt).toLocaleString()}\n`);
  });

program
  .command('config')
  .description('Configure API settings')
  .argument('<key>', 'Config key (provider, model, api-key)')
  .argument('[value]', 'Config value')
  .action((key, value) => {
    const config = loadConfig();
    
    if (!value) {
      // Show current value
      console.log(`\n${key}: ${config[key] || '(not set)'}\n`);
      return;
    }
    
    config[key] = value;
    saveConfig(config);
    console.log(`\n✓ ${key} updated\n`);
  });

program
  .command('list')
  .alias('ls')
  .description('List all projects')
  .action(() => {
    const state = loadState();
    
    if (state.projects.length === 0) {
      console.log('\n📭 No projects yet\n');
      console.log('Use "mm run <description>" to start a new project\n');
      return;
    }
    
    console.log('\n📁 Projects:\n');
    state.projects.forEach((project, index) => {
      const active = project.id === state.currentProject ? ' (active)' : '';
      console.log(`${index + 1}. ${project.description}${active}`);
      console.log(`   Status: ${project.status} | Messages: ${project.messages.length}`);
    });
    console.log('');
  });

program
  .command('open')
  .alias('o')
  .description('Open dashboard in browser')
  .option('-p, --port <port>', 'Port number', '3000')
  .action((options) => {
    const port = parseInt(options.port);
    const url = `http://localhost:${port}`;
    const command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    
    console.log(`\n🌐 Opening ${url}...\n`);
    exec(`${command} ${url}`);
  });

program
  .command('logs')
  .alias('l')
  .description('View agent communication logs')
  .option('-n, --lines <number>', 'Number of lines to show', '20')
  .action((options) => {
    const state = loadState();
    
    if (!state.currentProject) {
      console.log('\n⚠️  No active project\n');
      return;
    }
    
    const project = state.projects.find(p => p.id === state.currentProject);
    if (!project || project.messages.length === 0) {
      console.log('\n📭 No messages yet\n');
      return;
    }
    
    const lines = parseInt(options.lines);
    const messages = project.messages.slice(-lines);
    
    console.log(`\n💬 Last ${messages.length} messages:\n`);
    messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      console.log(`[${time}] ${msg.from}: ${msg.content}`);
    });
    console.log('');
  });

program
  .command('clear')
  .description('Clear all data')
  .action(() => {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
    console.log('\n✓ Data cleared\n');
  });

program.parse();
