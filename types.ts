
export type Language = 'python' | 'java' | 'javascript' | 'html' | 'mongodb';

export type ThemeType = 'industrial' | 'midnight' | 'nord' | 'cyberpunk' | 'forest';

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: Language;
}

export interface CodeState {
  python: string;
  java: string;
  javascript: string;
  html: string;
  css: string;
  frontendJs: string;
  mongodb: string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  time?: string;
  memory?: string;
  status?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'explanation' | 'fix' | 'code' | 'general';
}

export enum AIAction {
  EXPLAIN = 'Explain Logic',
  FIX = 'Fix Errors',
  OPTIMIZE = 'Optimize Performance',
  GENERATE = 'Generate Code',
  CONVERT = 'Convert Language'
}
