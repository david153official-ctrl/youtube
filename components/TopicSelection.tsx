import React from 'react';
import { AnalyzedData, RecommendedTopic, HollywoodTechnique } from '../types';
import { Button } from './Button';
import { Target, MessageCircle, ArrowRight, TrendingUp, Film, Sparkles, Zap, Heart, Ghost, Laugh } from 'lucide-react';

interface TopicSelectionProps {
  data: AnalyzedData;
  onSelectTopic: (topic: RecommendedTopic) => void;
  isLoading: boolean;
  onReset: () => void;
}

// 헐리우드 기법별 아이콘과 색상
const techniqueIcons = {
  [HollywoodTechnique.FICTIAN_CURVE]: { icon: Zap, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', name: '픽티안 커브', desc: '썰/사이다 채널용', target: '분노/복수' },
  [HollywoodTechnique.HEROS_JOURNEY]: { icon: Heart, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', name: '영웅의 여정', desc: '성공담/국뽕용', target: '감동/성장' },
  [HollywoodTechnique.IN_MEDIAS_RES]: { icon: Ghost, color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', name: '인 미디어스 레스', desc: '미스터리/공포용', target: '긴장/호기심' },
  [HollywoodTechnique.HANGOVER]: { icon: Laugh, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', name: '행오버 스타일', desc: '엽기/유머용', target: '황당/웃음' },
};

export const TopicSelection: React.FC<TopicSelectionProps> = ({ data, onSelectTopic, isLoading, onReset }) => {
  const diagnosisConfig = techniqueIcons[data.diagnosis.selectedTechnique];
  const DiagnosisIcon = diagnosisConfig?.icon || Film;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Diagnosis Report */}
      <div className={`bg-slate-800/80 backdrop-blur border ${diagnosisConfig?.borderColor || 'border-slate-700'} p-6 rounded-2xl`}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-indigo-400 w-6 h-6" />
          콘텐츠 설계 진단서
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3 bg-slate-700/30 px-4 py-3 rounded-lg border border-slate-600">
            <MessageCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-slate-400 text-xs mb-1">분석된 핵심 감정</div>
              <div className="text-white font-semibold">{data.diagnosis.coreEmotion}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-700/30 px-4 py-3 rounded-lg border border-slate-600">
            <Target className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-slate-400 text-xs mb-1">타겟 시청자</div>
              <div className="text-white font-semibold">{data.targetAudience}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 mb-4">
          <div className="text-slate-400 text-xs mb-2">소재의 잠재력</div>
          <div className="text-slate-200 text-sm leading-relaxed">{data.diagnosis.potentialHook}</div>
        </div>

        <div className={`${diagnosisConfig?.bgColor} border ${diagnosisConfig?.borderColor} p-4 rounded-lg flex items-start gap-3`}>
          <DiagnosisIcon className={`w-6 h-6 ${diagnosisConfig?.color} mt-0.5 flex-shrink-0`} />
          <div>
            <div className="text-slate-300 text-xs mb-1">적용된 헐리우드 기법</div>
            <div className={`${diagnosisConfig?.color} font-bold text-lg mb-1`}>
              {diagnosisConfig?.name}
            </div>
            <div className="text-slate-400 text-xs mb-2">
              <span className="font-semibold">{diagnosisConfig?.desc}</span> · 타겟: {diagnosisConfig?.target}
            </div>
            <div className="text-slate-300 text-sm">{data.diagnosis.techniqueReason}</div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-slate-500 text-xs">톤: <span className="text-slate-300">{data.tone}</span></div>
          <Button variant="ghost" onClick={onReset} className="text-sm">처음으로</Button>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
        <TrendingUp className="text-yellow-400" />
        추천 주제 선택
        <span className="text-base font-normal text-slate-400 ml-2">(하나를 선택하세요)</span>
      </h3>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.topics.map((topic, index) => {
          const config = techniqueIcons[topic.technique];
          const TechniqueIcon = config?.icon || Film;
          
          return (
            <button
              key={index}
              onClick={() => onSelectTopic(topic)}
              disabled={isLoading}
              className={`group relative flex flex-col h-full bg-slate-800 border border-slate-700 hover:border-${config?.color.replace('text-', '')} rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-${config?.color.replace('text-', '')}/10 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0`}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className={`${config?.color} w-6 h-6`} />
              </div>
              
              {/* Technique Badge */}
              <div className={`mb-3 ${config?.bgColor} ${config?.borderColor} border px-3 py-1.5 rounded-full flex items-center gap-2 w-fit`}>
                <TechniqueIcon className={`${config?.color} w-4 h-4`} />
                <span className={`${config?.color} text-xs font-semibold`}>{config?.name}</span>
              </div>
              
              <div className="mb-3 bg-slate-900/50 w-10 h-10 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                <span className="text-indigo-400 font-bold">{index + 1}</span>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {topic.title}
              </h4>
              
              <div className="text-xs text-slate-500 mb-3 italic">
                "{topic.rebrandedTheme}"
              </div>
              
              <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 mb-4">
                {topic.reason}
              </p>

              {/* Thumbnail Suggestions Preview */}
              <div className="mt-auto pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-500 mb-2">썸네일 추천:</div>
                <div className="text-xs text-slate-400 line-clamp-2">
                  {topic.thumbnailSuggestions[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-slate-300">AI가 헐리우드 스타일 대본을 작성하고 있습니다... (약 15-30초 소요)</p>
        </div>
      )}
    </div>
  );
};
