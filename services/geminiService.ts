import { GoogleGenAI, Type } from "@google/genai";
import { ViralAnalysis } from "../types";

const STORAGE_KEY = 'viral_clone_api_key';

export const getStoredApiKey = (): string => {
  // Prioritize local storage, fallback to env variable
  return localStorage.getItem(STORAGE_KEY) || (process.env.API_KEY as string) || '';
};

export const saveApiKey = (key: string) => {
  localStorage.setItem(STORAGE_KEY, key);
};

const getAI = () => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("API Key가 없습니다. 우측 상단 설정 아이콘을 눌러 API Key를 입력해주세요.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTranscript = async (transcript: string): Promise<ViralAnalysis> => {
  const ai = getAI();
  
  // Using Flash for fast analysis
  const model = "gemini-2.5-flash";
  
  const prompt = `
    다음 유튜브 영상 대본을 분석하세요. 당신의 목표는 이 영상이 "떡상(바이럴)"한 비결을 역설계하는 것입니다.
    모든 응답은 '한국어'로 작성해 주세요.
    
    다음 항목을 식별하세요:
    1. 'hook_strategy': 초반 30초 동안 시청자의 주의를 끈 전략 (후킹 전략).
    2. 'pacing_style': 편집 호흡이나 이야기 전개 속도 (빠른 컷 편집, 스토리텔링 위주, 느린 빌드업 등).
    3. 'tone': 영상의 전반적인 분위기나 어조 (활기찬, 진지한, 병맛, 감동적인 등).
    4. 'structure_points': 대본의 논리적 흐름을 단계별로 요약 (예: 인트로 -> 문제 제기 -> 반전 -> 해결).
    5. 'key_retention_tactics': 시청 지속 시간을 늘리기 위해 사용한 장치 (예: 열린 결말, 시각적 자료 언급, 질문 던지기 등).
    6. 'suggested_topics': 이 대본의 형식과 구조를 적용했을 때 대박이 날 만한, 완전히 새로운 주제 3가지를 추천해 주세요.

    대본:
    ${transcript.substring(0, 20000)} 
    (대본이 너무 길면 잘림)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook_strategy: { type: Type.STRING },
            pacing_style: { type: Type.STRING },
            tone: { type: Type.STRING },
            structure_points: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            key_retention_tactics: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            suggested_topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["hook_strategy", "pacing_style", "tone", "structure_points", "key_retention_tactics", "suggested_topics"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 응답이 없습니다.");
    
    return JSON.parse(text) as ViralAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    // Cast error to check message properly
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes("API Key")) throw error;
    throw new Error("대본 분석에 실패했습니다. 다시 시도해 주세요.");
  }
};

export const generateViralScript = async (
  analysis: ViralAnalysis, 
  topic: string
): Promise<{ title: string; script: string }> => {
  const ai = getAI();

  // Using Pro Preview for high-quality creative writing
  const model = "gemini-3-pro-preview";

  const prompt = `
    당신은 유튜브 대본 전문 작가입니다.
    성공한 영상에서 추출한 "바이럴 공식"을 바탕으로, 새로운 주제의 대본을 작성해야 합니다.

    ---
    바이럴 공식:
    - 후킹 전략: ${analysis.hook_strategy}
    - 호흡(Pacing): ${analysis.pacing_style}
    - 톤(Tone): ${analysis.tone}
    - 구조 청사진: ${JSON.stringify(analysis.structure_points)}
    - 이탈 방지 장치(Retention): ${JSON.stringify(analysis.key_retention_tactics)}
    ---

    새로운 주제: "${topic}"

    위 공식을 철저히 따르되, 내용은 새로운 주제에 맞춰 대본 전체를 작성하세요.
    - [0:00 인트로]와 같이 타임스탬프 혹은 섹션 헤더를 포함하세요.
    - [화면: 혼란스러운 상황 자료화면] 처럼 괄호 안에 시각적 연출 가이드를 포함하세요.
    - 후킹(오프닝)은 매우 강력해야 합니다.
    - 첫 줄에는 클릭을 유도할 수 있는 "제목"을 작성하세요.
    - 전체 언어는 한국어로 작성하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // Higher thinking budget for creative structuring
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("대본이 생성되지 않았습니다.");

    // Simple parsing to separate title if possible
    const lines = text.split('\n');
    let title = "생성된 대본";
    let scriptBody = text;

    // Heuristic: If first line looks like a title
    if (lines.length > 0 && (lines[0].toLowerCase().includes("제목:") || lines[0].length < 100)) {
       title = lines[0].replace(/제목:/i, "").trim();
       scriptBody = lines.slice(1).join('\n').trim();
    }

    return { title, script: scriptBody };

  } catch (error) {
    console.error("Generation Error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes("API Key")) throw error;
    throw new Error("대본 생성에 실패했습니다.");
  }
};