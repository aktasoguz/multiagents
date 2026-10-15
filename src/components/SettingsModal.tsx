import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Key, Save, Trash2, Globe } from 'lucide-react';
import { APIConfig, APIProvider, loadAPIConfig, saveAPIConfig } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: APIConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onConfigChange }) => {
  const [provider, setProvider] = useState<APIProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const config = loadAPIConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model);
      setBaseUrl(config.baseUrl || '');
    }
  }, []);

  const handleSave = () => {
    const config: APIConfig = { provider, apiKey, model, baseUrl: provider === 'custom' ? baseUrl : undefined };
    saveAPIConfig(config);
    onConfigChange(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('map_api_config');
    setApiKey('');
    setModel('');
    setBaseUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121a] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'openai' as const, label: 'OpenAI', color: 'emerald' },
                { id: 'anthropic' as const, label: 'Anthropic', color: 'orange' },
                { id: 'custom' as const, label: 'Custom', color: 'violet' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    provider === p.id
                      ? `bg-${p.color}-500/10 border-${p.color}-500/40 text-${p.color}-400`
                      : 'bg-white/[0.02] border-white/[0.06] text-gray-500 hover:border-white/[0.12]'
                  }`}
                  style={provider === p.id ? {
                    backgroundColor: p.color === 'emerald' ? 'rgba(16,185,129,0.1)' : p.color === 'orange' ? 'rgba(249,115,22,0.1)' : 'rgba(139,92,246,0.1)',
                    borderColor: p.color === 'emerald' ? 'rgba(16,185,129,0.4)' : p.color === 'orange' ? 'rgba(249,115,22,0.4)' : 'rgba(139,92,246,0.4)',
                    color: p.color === 'emerald' ? '#34d399' : p.color === 'orange' ? '#fb923c' : '#a78bfa',
                  } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model Input */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Model
              <span className="text-gray-600 ml-1.5">(type any model name)</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={
                provider === 'openai' ? 'gpt-4o, gpt-4-turbo, gpt-3.5-turbo...' :
                provider === 'anthropic' ? 'claude-3-5-sonnet-20241022...' :
                'your-model-name'
              }
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm font-mono"
            />
            {provider !== 'custom' && (
              <p className="text-[11px] text-gray-600 mt-1.5">
                {provider === 'openai' ? 'Suggestions: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo' : 
                 'Suggestions: claude-3-5-sonnet-20241022, claude-3-opus-20240229, claude-3-haiku-20240307'}
              </p>
            )}
          </div>

          {/* Custom Base URL */}
          {provider === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Base URL
                <span className="text-gray-600 ml-1.5">(OpenAI-compatible endpoint)</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm font-mono"
                />
              </div>
            </div>
          )}

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === 'openai' ? 'sk-...' :
                  provider === 'anthropic' ? 'sk-ant-...' :
                  'your-api-key'
                }
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all text-sm font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <p className="text-[11px] text-violet-300/70 leading-relaxed">
              🔒 Keys are stored locally in your browser. They're only sent directly to the API provider, never to our servers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          <div className="flex items-center gap-2.5">
            {saved && (
              <span className="text-xs text-emerald-400">✓ Saved</span>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || !model.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-violet-600 text-xs text-white font-medium hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
