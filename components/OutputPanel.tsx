
import React from 'react';
import { Language, ExecutionResult, CodeState } from '../types';
import LivePreview from './LivePreview';
import MongoPlayground from './MongoPlayground';

interface OutputPanelProps {
  language: Language;
  code: CodeState;
  stdin: string;
  onStdinChange: (value: string) => void;
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  mongoResults: any;
  isMongoLoading: boolean;
  onClose?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
  language,
  code,
  stdin,
  onStdinChange,
  executionResult,
  isRunning,
  mongoResults,
  isMongoLoading,
  onClose,
  isMaximized,
  onToggleMaximize
}) => {
  const renderPanelHeaderButtons = () => (
    <div className="flex items-center gap-1.5">
      {onToggleMaximize && (
        <button 
          onClick={onToggleMaximize} 
          title={isMaximized ? "Exit Fullscreen" : "Fullscreen Output"}
          className="p-1 hover:bg-white/10 rounded-md text-slate-500 hover:text-white transition-all"
        >
          {isMaximized ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 6l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      )}
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md text-slate-500 hover:text-white transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );

  if (language === 'html') {
    return (
      <div className="h-full border-t border-[var(--border-app)] bg-[var(--bg-app)] transition-colors duration-300 relative flex flex-col">
        <div className="flex justify-end p-2 bg-black/10 border-b border-[var(--border-app)] absolute top-0 right-0 z-20">
          {renderPanelHeaderButtons()}
        </div>
        <div className="flex-1">
          <LivePreview html={code.html} css={code.css} js={code.frontendJs} />
        </div>
      </div>
    );
  }

  if (language === 'mongodb') {
    return (
      <div className="h-full border-t border-[var(--border-app)] transition-colors duration-300 flex flex-col">
        <div className="flex justify-end p-2 bg-black/10 border-b border-[var(--border-app)]">
           {renderPanelHeaderButtons()}
        </div>
        <div className="flex-1">
          <MongoPlayground results={mongoResults} isLoading={isMongoLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-t border-[var(--border-app)] flex bg-[var(--bg-app)] transition-colors duration-300 overflow-hidden">
      <div className={`${isMaximized ? 'w-1/5' : 'w-1/4'} border-r border-[var(--border-app)] flex flex-col bg-black/5 transition-all duration-300`}>
        <div className="px-5 py-2.5 bg-black/10 border-b border-[var(--border-app)] flex items-center justify-between">
          <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">Input</span>
          <div className="w-1 h-1 rounded-full opacity-20 bg-white"></div>
        </div>
        <textarea
          value={stdin}
          onChange={(e) => onStdinChange(e.target.value)}
          placeholder="Arguments..."
          className="flex-1 bg-transparent p-5 font-mono text-[12px] resize-none focus:outline-none text-[var(--accent-primary)] placeholder-white/5 scrollbar-none"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-2.5 bg-black/10 border-b border-[var(--border-app)] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">Environment</span>
            {isRunning && <span className="text-[9px] text-[var(--accent-primary)] font-bold animate-pulse uppercase tracking-widest">[Runtime Active]</span>}
          </div>
          <div className="flex items-center gap-4">
            {executionResult && (
              <div className="flex gap-4 text-[9px] font-bold opacity-60 tracking-tighter uppercase">
                <span className="flex items-center gap-1.5">TIME {executionResult.time}</span>
                <span className="flex items-center gap-1.5">MEM {executionResult.memory}</span>
              </div>
            )}
            {renderPanelHeaderButtons()}
          </div>
        </div>
        <div className="flex-1 p-5 font-mono text-[12px] overflow-auto whitespace-pre-wrap scrollbar-none">
          {isRunning ? (
            <div className="flex flex-col gap-2">
              <div className="w-12 h-[2px] bg-[var(--accent-primary)] animate-pulse"></div>
              <p className="opacity-40 italic text-[11px]">Connecting cluster...</p>
            </div>
          ) : executionResult?.error ? (
            <div className="text-red-500 leading-relaxed font-medium">
              <span className="font-black text-[10px] block mb-1 uppercase tracking-widest">Critical Alert</span>
              {executionResult.error}
            </div>
          ) : executionResult?.output ? (
            <div className="text-[var(--text-app)] leading-relaxed font-medium selection:bg-[var(--accent-primary)]/20">
               {executionResult.output}
               <div className="mt-4 text-[9px] opacity-20 font-black border-t border-white/5 pt-3 uppercase tracking-widest">Process exited (0)</div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
               <svg className="w-6 h-6 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               <span className="text-[10px] font-black uppercase tracking-widest">Idle</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OutputPanel);
