import React, { useState, useEffect } from 'react';
import { AppState, ViralAnalysis, ScriptResult } from './types';
import { analyzeTranscript, generateViralScript, getStoredApiKey } from './services/geminiService';
import { AnalysisView } from './components/AnalysisView';
import { ScriptGenerator } from './components/ScriptGenerator';
import { ResultView } from './components/ResultView';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, FileVideo, Youtube, ChevronRight, AlertTriangle, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.INPUT_TRANSCRIPT);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<ViralAnalysis | null>(null);
  const [scriptResult, setScriptResult] = useState<ScriptResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Check for API key on mount, open settings if missing
    if (!getStoredApiKey()) {
      setIsSettingsOpen(true);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    
    setCurrentState(AppState.ANALYZING);
    setErrorMsg(null);
    try {
      const result = await analyzeTranscript(transcript);
      setAnalysis(result);
      setCurrentState(AppState.INPUT_TOPIC); 
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "분석 중 오류가 발생했습니다.");
      setCurrentState(AppState.INPUT_TRANSCRIPT);
    }
  };

  const handleGenerate = async (topic: string) => {
    if (!analysis) return;

    setCurrentState(AppState.GENERATING);
    setErrorMsg(null);
    try {
      const result = await generateViralScript(analysis, topic);
      setScriptResult({
        title: result.title,
        script_content: result.script
      });
      setCurrentState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "대본 생성 중 오류가 발생했습니다.");
      setCurrentState(AppState.INPUT_TOPIC);
    }
  };

  const renderContent = () => {
    switch (currentState) {
      case AppState.INPUT_TRANSCRIPT:
      case AppState.ANALYZING:
        return (
          <div className="w-full max-w-3xl mx-auto animate-fade-in">
             <div className="text-center mb-10">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                  <span className="gradient-text">바이럴클론 AI</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  떡상한 유튜브 영상의 대본을 붙여넣으세요. DNA를 분석하여 당신의 새로운 주제에 맞는 대박 영상을 만들어드립니다.
                </p>
             </div>

             <div className="glass-panel p-1 rounded-2xl shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
               <div className="bg-slate-900/90 rounded-xl p-6 md:p-8">
                 <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                   <Youtube className="w-5 h-5 text-red-500" />
                   원본 영상 대본 (Transcript)
                 </label>
                 
                 <textarea
                   className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all font-mono text-sm leading-relaxed custom-scrollbar"
                   placeholder="여기에 영상 대본 전체를 붙여넣으세요..."
                   value={transcript}
                   onChange={(e) => setTranscript(e.target.value)}
                   disabled={currentState === AppState.ANALYZING}
                 />

                 {errorMsg && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{errorMsg}</p>
                    </div>
                 )}

                 <div className="mt-6 flex justify-end">
                   <button
                     onClick={handleAnalyze}
                     disabled={!transcript.trim() || currentState === AppState.ANALYZING}
                     className={`
                       flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                       ${!transcript.trim() || currentState === AppState.ANALYZING
                         ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                         : 'bg-white text-slate-900 hover:bg-blue-50 hover:scale-[1.02] hover:shadow-blue-500/20'
                       }
                     `}
                   >
                     {currentState === AppState.ANALYZING ? (
                       <>
                         <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                         DNA 분석 중...
                       </>
                     ) : (
                       <>
                         DNA 분석하기 <ChevronRight className="w-5 h-5" />
                       </>
                     )}
                   </button>
                 </div>
               </div>
             </div>
          </div>
        );

      case AppState.INPUT_TOPIC:
        return <AnalysisAndGenerationFlow 
                  analysis={analysis!} 
                  onGenerate={handleGenerate} 
                  onBack={() => {
                    setAnalysis(null);
                    setCurrentState(AppState.INPUT_TRANSCRIPT);
                  }}
                  isGenerating={false} 
               />;

      case AppState.GENERATING:
         return <AnalysisAndGenerationFlow 
                  analysis={analysis!} 
                  onGenerate={handleGenerate} 
                  onBack={() => {}} // Disabled during generation
                  isGenerating={true} 
                  forceShowGenerator={true}
               />;

      case AppState.RESULT:
        return <ResultView result={scriptResult!} onReset={() => setCurrentState(AppState.INPUT_TRANSCRIPT)} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">바이럴클론 AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="API 설정"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="hidden md:block text-xs font-medium text-slate-500 uppercase tracking-widest border border-slate-800 px-3 py-1 rounded-full">
            Gemini 2.5 Flash & 3 Pro
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {renderContent()}
      </main>
      
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

// Sub-component to handle the flow between viewing analysis and entering topic
const AnalysisAndGenerationFlow: React.FC<{
  analysis: ViralAnalysis;
  onGenerate: (topic: string) => void;
  onBack: () => void;
  isGenerating: boolean;
  forceShowGenerator?: boolean;
}> = ({ analysis, onGenerate, onBack, isGenerating, forceShowGenerator = false }) => {
  const [step, setStep] = useState<'view' | 'create'>(forceShowGenerator ? 'create' : 'view');

  if (step === 'view') {
    return <AnalysisView analysis={analysis} onNext={() => setStep('create')} onBack={onBack} />;
  }

  return (
    <ScriptGenerator 
      onGenerate={onGenerate} 
      onBack={() => setStep('view')} 
      isGenerating={isGenerating} 
      suggestedTopics={analysis.suggested_topics} // Pass suggestions here
    />
  );
};

export default App;