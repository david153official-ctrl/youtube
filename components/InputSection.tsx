import React, { useState } from 'react';
import { MAX_INPUT_CHARS } from '../constants';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 10) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 md:p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-indigo-400">Step 1.</span> 아이디어 또는 대본 입력
        </h2>
        <p className="text-slate-400 mb-6">
          기존 대본이나 새로운 아이디어 초안을 입력하세요. AI가 스타일을 분석하고 새로운 주제를 제안합니다.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              className="w-full h-64 bg-slate-900/80 border border-slate-600 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all text-lg leading-relaxed"
              placeholder="여기에 대본이나 아이디어를 입력하세요... (예: 스마트폰 리뷰, 여행 브이로그 오프닝 등)"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_INPUT_CHARS))}
              disabled={isLoading}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
              {text.length} / {MAX_INPUT_CHARS}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={text.trim().length <= 10} 
              isLoading={isLoading}
              className="w-full md:w-auto text-lg"
            >
              <Sparkles className="w-5 h-5" />
              분석 및 주제 추천받기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
