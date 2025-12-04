import React, { useState } from 'react';
import { RecommendedTopic, HollywoodTechnique } from '../types';
import { Button } from './Button';
import { Copy, Check, RotateCcw, FileText, Download, Film, Zap, Heart, Ghost, Laugh } from 'lucide-react';

interface ScriptResultProps {
  script: string;
  topic: RecommendedTopic;
  onReset: () => void;
}

// 헐리우드 기법별 아이콘과 색상
const techniqueIcons = {
  [HollywoodTechnique.FICTIAN_CURVE]: { icon: Zap, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', name: '픽티안 커브', desc: '갈등 고조 → 사이다 폭발' },
  [HollywoodTechnique.HEROS_JOURNEY]: { icon: Heart, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', name: '영웅의 여정', desc: '결핍 → 시련 → 성장' },
  [HollywoodTechnique.IN_MEDIAS_RES]: { icon: Ghost, color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', name: '인 미디어스 레스', desc: '결말 먼저 → 진실 폭로' },
  [HollywoodTechnique.HANGOVER]: { icon: Laugh, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', name: '행오버 스타일', desc: '황당 상황 → 반전 웃음' },
};

export const ScriptResult: React.FC<ScriptResultProps> = ({ script, topic, onReset }) => {
  const [copied, setCopied] = useState(false);

  const config = techniqueIcons[topic.technique];
  const TechniqueIcon = config?.icon || Film;

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([script], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${topic.title.replace(/\s+/g, '_')}_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up space-y-6">
      
      {/* Header with Topic Info */}
      <div className={`bg-slate-800/80 backdrop-blur border ${config?.borderColor} p-6 rounded-2xl`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              <span className="text-indigo-400">Step 3.</span> 완성된 대본
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <div className={`${config?.bgColor} ${config?.borderColor} border px-3 py-1.5 rounded-full flex items-center gap-2 w-fit`}>
                <TechniqueIcon className={`${config?.color} w-4 h-4`} />
                <span className={`${config?.color} text-sm font-semibold`}>{config?.name}</span>
              </div>
            </div>
            <p className="text-slate-200 font-semibold text-lg mb-2">{topic.title}</p>
            <p className="text-slate-400 text-sm italic">"{topic.rebrandedTheme}"</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" onClick={handleDownload} className="flex-1 md:flex-none py-2 text-sm">
              <Download className="w-4 h-4" />
              저장
            </Button>
            <Button variant="primary" onClick={handleCopy} className="flex-1 md:flex-none py-2 text-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "복사됨" : "복사하기"}
            </Button>
          </div>
        </div>

        {/* Thumbnail Suggestions */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
          <div className="text-slate-400 text-xs mb-2 flex items-center gap-2">
            <FileText className="w-3 h-3" />
            추천 썸네일/제목
          </div>
          <div className="space-y-1">
            {topic.thumbnailSuggestions.map((suggestion, index) => (
              <div key={index} className="text-slate-300 text-sm">
                {index + 1}. {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Script Content */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex items-center gap-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <div className="ml-4 text-xs text-slate-500 font-mono flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {config?.name}_script.md
          </div>
        </div>
        
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-indigo-300 prose-h2:border-b prose-h2:border-slate-700 prose-h2:pb-2 prose-h3:text-emerald-400 prose-ul:text-slate-300 prose-li:text-slate-300">
             <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                {script}
             </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="secondary" onClick={onReset} className="px-8">
          <RotateCcw className="w-4 h-4" />
          새로운 대본 만들기
        </Button>
      </div>
    </div>
  );
};
