export interface ViralAnalysis {
  hook_strategy: string;
  pacing_style: string;
  tone: string;
  structure_points: string[];
  key_retention_tactics: string[];
  suggested_topics: string[];
}

export enum AppState {
  INPUT_TRANSCRIPT = 'INPUT_TRANSCRIPT',
  ANALYZING = 'ANALYZING',
  INPUT_TOPIC = 'INPUT_TOPIC',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface ScriptResult {
  title: string;
  script_content: string;
}