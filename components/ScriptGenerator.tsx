import React, { useState } from 'react';
import { Wand2, AlertCircle, Sparkles } from 'lucide-react';

interface ScriptGeneratorProps {
  onGenerate: (topic: string) => void;
  onBack: () => void;
  isGenerating: boolean;
  suggestedTopics: string[];
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ onGenerate, onBack, isGenerating, suggestedTopics }) => {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }
    if (topic.length < 2) {
      setError('주제가 너무 짧습니다. 조금 더 구체적으로 적어주세요.');
      return;
    }
    setError('');
    onGenerate(topic);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    // Optional: Auto-submit on suggestion click? Let's just populate to let them edit.
    // But user experience is often better if it just fills it. 
    // If they want to edit, they can click into the input.
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">어떤 주제로 만드시겠습니까?</h2>
        <p className="text-slate-400">AI가 분석한 바이럴 공식을 새로운 주제에 적용합니다.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Suggested Topics */}
          {suggestedTopics && suggestedTopics.length > 0 && (
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-purple-300 mb-3">
                <Sparkles className="w-4 h-4" />
                AI 추천 주제
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-full text-sm text-purple-200 transition-all text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              새로운 영상 주제
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 집에서 누구나 따라 할 수 있는 5분 홈트레이닝"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isGenerating}
            />
            {error && (
              <div className="mt-2 flex items-center text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isGenerating}
              className="px-6 py-4 rounded-xl text-slate-400 hover:text-white font-medium transition-colors sm:w-1/3"
            >
              뒤로
            </button>
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all
                ${isGenerating 
                  ? 'bg-slate-700 cursor-wait' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25 hover:-translate-y-0.5'
                }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  대본 작성 중...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  대본 생성하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-slate-500">
        <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800">
          <span className="block font-semibold text-slate-400 mb-1">구체적으로</span>
          "코딩" 보다는 "30일 만에 파이썬 마스터한 썰"이 좋습니다.
        </div>
        <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800">
          <span className="block font-semibold text-slate-400 mb-1">장르 변경 가능</span>
          요리 영상의 구조를 게임 리뷰에 적용해보세요.
        </div>
        <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800">
          <span className="block font-semibold text-slate-400 mb-1">AI 모델</span>
          Gemini 3 Pro가 창의적인 대본을 작성합니다.
        </div>
      </div>
    </div>
  );
};