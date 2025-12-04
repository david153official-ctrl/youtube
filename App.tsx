import React, { useState } from 'react';
import { AnalyzedData, AppStep, RecommendedTopic } from './types';
import { analyzeAndRecommend, generateScript } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { TopicSelection } from './components/TopicSelection';
import { ScriptResult } from './components/ScriptResult';
import { Youtube, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<RecommendedTopic | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setStep(AppStep.ANALYZING);
      const data = await analyzeAndRecommend(text);
      setAnalyzedData(data);
      setStep(AppStep.SELECTION);
    } catch (err) {
      console.error(err);
      setError("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStep(AppStep.INPUT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = async (topic: RecommendedTopic) => {
    if (!analyzedData) return;
    
    setIsLoading(true);
    setError(null);
    setSelectedTopic(topic);
    setStep(AppStep.GENERATING);
    
    try {
      const script = await generateScript(topic, analyzedData.tone, analyzedData.targetAudience);
      setGeneratedScript(script);
      setStep(AppStep.RESULT);
    } catch (err) {
      console.error(err);
      setError("대본 생성 중 오류가 발생했습니다.");
      setStep(AppStep.SELECTION);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setAnalyzedData(null);
    setSelectedTopic(null);
    setGeneratedScript('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 text-slate-100 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TubeGenius
            </h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        {/* Hero Text (Only show on Input step) */}
        {step === AppStep.INPUT && (
          <div className="text-center mb-12 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              당신의 다음 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">바이럴 영상</span>을<br/>
              설계하세요.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              기존 스타일을 분석하고, AI가 200% 더 매력적인 주제를 추천합니다.
              <br className="hidden md:block" />
              단 3번의 클릭으로 완벽한 대본을 완성하세요.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center text-sm">
            {error}
          </div>
        )}

        {/* Application Steps */}
        <div className="transition-all duration-500 ease-in-out">
          {(step === AppStep.INPUT || step === AppStep.ANALYZING) && (
            <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
          )}

          {(step === AppStep.SELECTION || step === AppStep.GENERATING) && analyzedData && (
            <TopicSelection 
              data={analyzedData} 
              onSelectTopic={handleSelectTopic} 
              isLoading={isLoading} 
              onReset={handleReset}
            />
          )}

          {step === AppStep.RESULT && selectedTopic && (
            <ScriptResult 
              script={generatedScript} 
              topic={selectedTopic}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} TubeGenius AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
