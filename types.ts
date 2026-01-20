
export type Language = 'python' | 'java' | 'javascript' | 'html' | 'mongodb';

export type ThemeType = 'industrial' | 'midnight' | 'nord' | 'cyberpunk' | 'forest';

export type AIPersona = 'Mentor' | 'Security Lead' | 'Clean Code Guru' | 'Performance Ninja';

export interface AIAuditResult {
  maintainability: number;
  security: number;
  performance: number;
  suggestions: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: Language;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  files: { name: string; content: string; language: Language }[];
}

export interface ExecutionHistoryItem {
  id: string;
  timestamp: number;
  language: Language;
  status: string;
  output: string;
  codeSnippet: string;
}

export interface ProjectSettings {
  fontSize: number;
  wordWrap: 'on' | 'off';
  lineNumbers: 'on' | 'off';
  minimap: boolean;
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
  CONVERT = 'Convert Language',
  AUDIT = 'Comprehensive Audit'
}
