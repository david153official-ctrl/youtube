import React, { useState, useEffect } from 'react';
import { X, Key, Save, ExternalLink } from 'lucide-react';
import { getStoredApiKey, saveApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveApiKey(apiKey.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-6 text-purple-400">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">API 설정</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AI Studio API Key를 입력하세요"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="text-xs text-slate-500 flex flex-col gap-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <p>API 키는 브라우저(Local Storage)에만 저장되며 서버로 전송되지 않습니다.</p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline w-fit"
            >
              API Key 발급받기 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};