import React from 'react';
import { ViralAnalysis } from '../types';
import { Zap, Activity, MessageCircle, GitMerge, Lock } from 'lucide-react';

interface AnalysisViewProps {
  analysis: ViralAnalysis;
  onNext: () => void;
  onBack: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onNext, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">바이럴 DNA 추출 완료</h2>
        <p className="text-slate-400">떡상한 영상의 성공 공식은 다음과 같습니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Hook Strategy */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-yellow-400">
          <div className="flex items-center gap-2 mb-3 text-yellow-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">후킹 전략 (Hook)</h3>
          </div>
          <p className="text-slate-200 leading-relaxed">{analysis.hook_strategy}</p>
        </div>

        {/* Tone */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-purple-400">
          <div className="flex items-center gap-2 mb-3 text-purple-400">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">톤앤매너 (Tone)</h3>
          </div>
          <p className="text-slate-200 leading-relaxed">{analysis.tone}</p>
        </div>

        {/* Pacing */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-3 text-blue-400">
            <Activity className="w-5 h-5" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">전개 속도 (Pacing)</h3>
          </div>
          <p className="text-slate-200 leading-relaxed">{analysis.pacing_style}</p>
        </div>

        {/* Retention Tactics */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-green-400">
          <div className="flex items-center gap-2 mb-3 text-green-400">
            <Lock className="w-5 h-5" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">이탈 방지 장치</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            {analysis.key_retention_tactics.map((tactic, i) => (
              <li key={i}>{tactic}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Structure Blueprint */}
      <div className="glass-panel p-6 rounded-xl mb-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-4 text-pink-400">
          <GitMerge className="w-5 h-5" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">대본 구조 설계도</h3>
        </div>
        <div className="space-y-3">
          {analysis.structure_points.map((point, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                {index + 1}
              </span>
              <p className="text-slate-300">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={onBack}
          className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
        >
          처음으로
        </button>
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-white shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all"
        >
          이 구조로 대본 만들기
        </button>
      </div>
    </div>
  );
};