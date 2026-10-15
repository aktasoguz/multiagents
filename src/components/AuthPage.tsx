import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Terminal, GitBranch, Users, Zap } from 'lucide-react';
import { register, login } from '../services/auth';

interface AuthPageProps {
  onAuth: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX
    await new Promise(r => setTimeout(r, 400));

    if (isLogin) {
      const result = login(email, password);
      if (result.success) {
        onAuth();
      } else {
        setError(result.error || 'Login failed');
      }
    } else {
      if (!username.trim()) {
        setError('Username is required');
        setLoading(false);
        return;
      }
      const result = register(username, email, password);
      if (result.success) {
        onAuth();
      } else {
        setError(result.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-blue-950/30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">MultiAgent Platform</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">v0.1.0 • Open Source</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Orchestrate AI agents<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                like a software company.
              </span>
            </h2>
            <p className="text-gray-400 mt-4 text-base leading-relaxed max-w-md">
              Run multi-agent workflows from the CLI. Manage, monitor, and iterate through the browser dashboard. Inspired by MetaGPT.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Terminal className="w-5 h-5 text-violet-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium">CLI First</p>
              <p className="text-[11px] text-gray-600 mt-1">Run agents from terminal</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <GitBranch className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium">SOP Driven</p>
              <p className="text-[11px] text-gray-600 mt-1">Standardized workflows</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Users className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium">Multi-Agent</p>
              <p className="text-[11px] text-gray-600 mt-1">PM, Arch, Eng, QA roles</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <p className="text-gray-500">
              <span className="text-emerald-400">$</span> <span className="text-gray-300">map</span> <span className="text-violet-400">run</span> <span className="text-gray-500">"Build a todo app with React"</span>
            </p>
            <p className="text-gray-600 mt-1">
              <span className="text-emerald-400">✓</span> PM → PRD generated
            </p>
            <p className="text-gray-600">
              <span className="text-emerald-400">✓</span> Architect → Design complete
            </p>
            <p className="text-gray-600">
              <span className="text-emerald-400">✓</span> Engineer → Code written
            </p>
            <p className="text-gray-600">
              <span className="text-blue-400">⟳</span> QA → Running tests...
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-gray-600">
          <span>© 2025 MultiAgent Platform</span>
          <span>•</span>
          <a href="https://github.com/FoundationAgents/MetaGPT" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
            Inspired by MetaGPT
          </a>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">MultiAgent Platform</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              {isLogin ? 'Sign in to manage your agents' : 'Get started with multi-agent workflows'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <Zap className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-sm hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-violet-400 hover:text-violet-300">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
