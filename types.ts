export enum HollywoodTechnique {
  FICTIAN_CURVE = "FICTIAN_CURVE", // 픽티안 커브 (존 윅 스타일) - 분노/복수
  HEROS_JOURNEY = "HEROS_JOURNEY", // 영웅의 여정 (스타워즈 스타일) - 감동/성장
  IN_MEDIAS_RES = "IN_MEDIAS_RES", // 인 미디어스 레스 (넷플릭스 스릴러) - 공포/미스터리
  HANGOVER = "HANGOVER" // 행오버 스타일 (미스터리 코미디) - 황당/유머
}

export interface DiagnosisReport {
  coreEmotion: string; // 핵심 감정
  potentialHook: string; // 소재의 잠재력
  selectedTechnique: HollywoodTechnique; // 선택된 기법
  techniqueReason: string; // 기법 선택 이유
}

export interface AnalyzedData {
  tone: string;
  targetAudience: string;
  diagnosis: DiagnosisReport; // 진단서
  topics: RecommendedTopic[];
}

export interface RecommendedTopic {
  title: string;
  reason: string;
  technique: HollywoodTechnique; // 각 주제에 적용된 기법
  rebrandedTheme: string; // 리브랜딩된 주제
  thumbnailSuggestions: string[]; // 썸네일/제목 추천 (3개)
}

export interface GeneratedScript {
  title: string;
  content: string;
}

export enum AppStep {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  SELECTION = 'SELECTION',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}
