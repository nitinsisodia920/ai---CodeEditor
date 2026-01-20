
import React, { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Language, CodeState, AIAction, ProjectSettings } from '../types';
import { formatCode } from '../services/geminiService';

interface EditorPanelProps {
  language: Language;
  fileName: string;
  code: CodeState;
  currentFileContent: string;
  activeFrontendTab: 'html' | 'css' | 'js';
  onTabChange: (tab: 'html' | 'css' | 'js') => void;
  onCodeChange: (value: string | undefined) => void;
  onReset: () => void;
  onOptimize: () => void;
  settings: ProjectSettings;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  language,
  fileName,
  currentFileContent,
  onCodeChange,
  onReset,
  onOptimize,
  settings
}) => {
  const [isFormatting, setIsFormatting] = useState(false);

  const editorLanguage = useMemo(() => {
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.py')) return 'python';
    if (fileName.endsWith('.java')) return 'java';
    if (fileName.endsWith('.mongodb')) return 'javascript'; 
    return 'javascript';
  }, [fileName]);

  const handleClear = () => onCodeChange('');
  
  const handleDownload = () => {
    const blob = new Blob([currentFileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFormat = async () => {
    if (isFormatting) return;
    setIsFormatting(true);
    try {
      const formatted = await formatCode(currentFileContent, language);
      onCodeChange(formatted);
    } catch (e) {
      console.error("Format failed", e);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleFormat();
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 relative bg-[var(--bg-app)] transition-colors duration-300">
      {/* Dynamic Breadcrumbs */}
      <div className="h-9 bg-[var(--bg-sidebar)]/50 flex items-center justify-between px-5 shrink-0 border-b border-[var(--border-app)] transition-colors duration-300">
        <div className="flex items-center gap-3 text-[10px] font-bold tracking-tight opacity-60">
          <span className="uppercase">Project</span>
          <span className="opacity-20">/</span>
          <span className="uppercase">{language}</span>
          <span className="opacity-20">/</span>
          <span className="text-[var(--text-highlight)] flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]"></div>
             {fileName}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleFormat}
            disabled={isFormatting}
            className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              isFormatting ? 'text-slate-500' : 'text-emerald-500 hover:opacity-80'
            }`}
          >
            {isFormatting ? (
               <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" /></svg>
            )}
            {isFormatting ? 'Formatting' : 'Code Standard'}
          </button>
          <div className="w-[1px] h-3 bg-white/5"></div>
          <button 
            onClick={onOptimize}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] hover:opacity-80 transition-all flex items-center gap-2"
          >
            Audit
          </button>
        </div>
      </div>

      <div className="h-10 bg-[var(--bg-app)] border-b border-[var(--border-app)] flex items-center shrink-0 transition-colors duration-300">
        <div className="h-full px-5 border-r border-[var(--border-app)] bg-white/5 flex items-center gap-3 relative">
           <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[var(--accent-primary)] shadow-[0_0_12px_rgba(var(--accent-primary),0.6)]"></div>
           <span className="text-[11px] font-black text-[var(--text-highlight)] uppercase tracking-widest">{fileName}</span>
        </div>
        
        <div className="ml-auto flex items-center gap-1.5 px-4">
          <ToolbarButton onClick={handleFormat} title="Format (Ctrl+S)">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={handleDownload} title="Export">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </ToolbarButton>
          <div className="w-[1px] h-3 bg-white/5 mx-1"></div>
          <ToolbarButton onClick={handleClear} title="Wipe">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={onReset} title="Restore">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" /></svg>
          </ToolbarButton>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <Editor
          theme="vs-dark"
          language={editorLanguage}
          value={currentFileContent}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: settings.fontSize,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: settings.minimap },
            padding: { top: 20 },
            lineHeight: 22,
            cursorSmoothCaretAnimation: "on",
            cursorBlinking: "smooth",
            renderLineHighlight: "all",
            fontLigatures: true,
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: settings.wordWrap,
            lineNumbers: settings.lineNumbers,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false
            },
          }}
        />
        {isFormatting && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-20 transition-all">
             <div className="bg-[var(--bg-sidebar)] border border-[var(--border-app)] px-4 py-2 rounded-lg shadow-2xl flex items-center gap-3">
               <svg className="animate-spin h-4 w-4 text-[var(--accent-primary)]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-highlight)]">Formatting Workspace...</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ children: React.ReactNode; onClick: () => void; title: string }> = ({ children, onClick, title }) => (
  <button 
    onClick={onClick}
    title={title}
    className="p-2 text-[var(--text-app)] hover:text-[var(--text-highlight)] hover:bg-white/5 rounded-md transition-all active:scale-90"
  >
    {children}
  </button>
);

export default EditorPanel;
