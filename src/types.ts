export type ColumnType = 'numeric' | 'categorical' | 'date' | 'text';

export interface ColumnStat {
  name: string;
  type: ColumnType;
  missingCount: number;
  uniqueCount: number;
  stats: {
    min?: number;
    max?: number;
    avg?: number;
    sum?: number;
    frequencies?: Record<string, number>;
  };
}

export interface Dataset {
  id: string;
  name: string;
  type: 'csv' | 'xlsx' | 'json';
  size: string;
  uploadDate: string;
  rowCount: number;
  colCount: number;
  duplicateCount: number;
  missingCount: number;
  columns: ColumnStat[];
  data: Record<string, any>[];
}

export interface AIResponse {
  summary: string;
  insights: string[];
  reasoning: string;
  evidence: string;
  confidenceScore: number;
  limitations: string;
  recommendedActions: string[];
  exploreQuestions: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  datasetId: string;
  datasetName: string;
  promptName?: string;
  promptText: string;
  response: AIResponse;
  language: string;
  model: string;
  temperature: number;
}

export interface Report {
  id: string;
  timestamp: string;
  datasetId: string;
  datasetName: string;
  title: string;
  summary: string;
  overview: string;
  visualizationsMarkdown?: string;
  insightsMarkdown: string;
  recommendationsMarkdown: string;
  limitationsMarkdown: string;
  appendixMarkdown: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  userPrompt: string;
  creativity: number;
  category: string;
  isCustom?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  language: string;
  gemmaEndpoint: string;
  model: string;
  exportPreference: 'markdown' | 'pdf' | 'html';
  notifications: boolean;
  privacyMode: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
  avatarSeed: string;
  storageUsed: string;
}
