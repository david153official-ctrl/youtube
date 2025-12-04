import React, { useState } from 'react';
import { Copy, Check, RefreshCw, ArrowLeft, Download } from 'lucide-react';
import { ScriptResult } from '../types';

interface ResultViewProps {
  result: ScriptResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.title}\n\n${result.script_content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`${result.title}\n\n${result.script_content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${result.title.replace(/[^a-z0-9가-힣]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <button 
            onClick={onReset}
            className="flex items-center text-slate-400 hover:text-white mb-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            다른 주제로 만들기
          </button>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {result.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="텍스트 파일로 다운로드"
          >
             <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '복사됨' : '대본 복사'}
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-900/50">
           <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-lg max-w-none">
            {result.script_content}
           </pre>
        </div>
      </div>
    </div>
  );
};