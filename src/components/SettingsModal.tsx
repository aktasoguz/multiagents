import React, { useState, useEffect } from 'react';
import { APIConfig, APIProvider, getModels, getDefaultModel, loadAPIConfig, saveAPIConfig } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: APIConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onConfigChange }) => {
  const [provider, setProvider] = useState<APIProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const config = loadAPIConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model);
    } else {
      setModel(getDefaultModel('openai'));
    }
  }, []);

  useEffect(() => {
    setModel(getDefaultModel(provider));
  }, [provider]);

  const handleSave = () => {
    const config: APIConfig = { provider, apiKey, model };
    saveAPIConfig(config);
    onConfigChange(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('metagpt_api_config');
    setApiKey('');
    setModel(getDefaultModel(provider));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-white">API Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">API Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProvider('openai')}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  provider === 'openai'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <span>🟢</span>
                  OpenAI
                </div>
              </button>
              <button
                onClick={() => setProvider('anthropic')}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  provider === 'anthropic'
                    ? 'bg-orange-500/10 border-orange-500/50 text-orange-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <span>🟠</span>
                  Anthropic
                </div>
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
            >
              {getModels(provider).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              API Key
              <span className="text-gray-600 ml-2">(stored locally in your browser)</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-blue-400 leading-relaxed">
              🔒 Your API key is stored only in your browser's localStorage and never sent to any server other than the selected API provider.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear Config
          </button>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-green-400 animate-fadeIn">✓ Saved!</span>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-5 py-2 rounded-lg bg-blue-600 text-xs text-white font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
