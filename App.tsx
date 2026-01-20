
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIChatPanel, { AIChatHandle } from './components/AIChatPanel';
import EditorPanel from './components/EditorPanel';
import OutputPanel from './components/OutputPanel';
import SnippetsPanel from './components/SnippetsPanel';
import ActivityBar from './components/ActivityBar';
import { useCodeState } from './hooks/useCodeState';
import { Language, ExecutionResult, CodeState, AIAction, ThemeType } from './types';
import { executeCode } from './services/executionService';
import { simulateMongoQuery } from './services/geminiService';
import { INITIAL_CODE, THEMES } from './constants';

const App: React.FC = () => {
  const { 
    files, 
    activeFile, 
    setActiveFileId, 
    updateFileContent, 
    addFile, 
    renameFile,
    deleteFile 
  } = useCodeState();

  const [stdin, setStdin] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mongoResults, setMongoResults] = useState<any>(null);
  const [isMongoLoading, setIsMongoLoading] = useState(false);
  
  // Panel management states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);
  const [outputPanelCollapsed, setOutputPanelCollapsed] = useState(false);
  
  const [activeSidebarTab, setActiveSidebarTab] = useState<'explorer' | 'snippets' | 'search'>('explorer');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(activeFile?.language || 'python');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('codestream_theme') as ThemeType) || 'industrial';
  });
  
  const aiChatRef = useRef<AIChatHandle>(null);

  // Theme Injection
  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    root.style.setProperty('--bg-app', theme.bg);
    root.style.setProperty('--bg-sidebar', theme.sidebar);
    root.style.setProperty('--bg-navbar', theme.navbar);
    root.style.setProperty('--border-app', theme.border);
    root.style.setProperty('--text-app', theme.text);
    root.style.setProperty('--text-highlight', theme.highlight);
    root.style.setProperty('--accent-primary', theme.primary);
    localStorage.setItem('codestream_theme', currentTheme);
  }, [currentTheme]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => f.language === currentLanguage);
  }, [files, currentLanguage]);

  React.useEffect(() => {
    if (activeFile && activeFile.language !== currentLanguage) {
      const firstInSpace = files.find(f => f.language === currentLanguage);
      if (firstInSpace) {
        setActiveFileId(firstInSpace.id);
      }
    }
  }, [currentLanguage, activeFile, files, setActiveFileId]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value === undefined || !activeFile) return;
    updateFileContent(activeFile.id, value);
  }, [activeFile, updateFileContent]);

  const handleApplyAICode = useCallback((newCode: string) => {
    if (!activeFile) return;
    updateFileContent(activeFile.id, newCode);
  }, [activeFile, updateFileContent]);

  const handleInsertSnippet = useCallback((snippetCode: string) => {
    if (!activeFile) return;
    const currentVal = activeFile.content;
    const newVal = currentVal.trim() === "" ? snippetCode : `${currentVal}\n\n${snippetCode}`;
    updateFileContent(activeFile.id, newVal);
  }, [activeFile, updateFileContent]);

  const detectLanguage = (name: string, defaultLang: Language): Language => {
    if (name.endsWith('.py')) return 'python';
    if (name.endsWith('.java')) return 'java';
    if (name.endsWith('.html') || name.endsWith('.css') || (name.endsWith('.js') && defaultLang === 'html')) return 'html';
    if (name.endsWith('.js')) return 'javascript';
    if (name.endsWith('.mongodb')) return 'mongodb';
    return defaultLang;
  };

  const handleCreateFile = useCallback(() => {
    const defaultExt = {
      python: '.py',
      java: '.java',
      javascript: '.js',
      html: '.html',
      mongodb: '.mongodb'
    }[currentLanguage];

    const name = prompt(`New ${currentLanguage} file name:`, `untitled${defaultExt}`);
    if (!name) return;

    const detectedLang = detectLanguage(name, currentLanguage);
    if (detectedLang !== currentLanguage) setCurrentLanguage(detectedLang);
    addFile(name, detectedLang);
  }, [currentLanguage, addFile]);

  const handleRenameFile = useCallback((fileId: string, oldName: string) => {
    const newName = prompt(`Rename ${oldName}:`, oldName);
    if (!newName || newName === oldName) return;

    const detectedLang = detectLanguage(newName, currentLanguage);
    renameFile(fileId, newName, detectedLang);
    if (detectedLang !== currentLanguage) setCurrentLanguage(detectedLang);
  }, [currentLanguage, renameFile]);

  const handleDeleteFile = useCallback((fileId: string, name: string) => {
    if (confirm(`Permanently delete ${name}?`)) {
      deleteFile(fileId);
    }
  }, [deleteFile]);

  const handleReset = useCallback(() => {
    if (!activeFile) return;
    if (confirm(`Reset ${activeFile.name}? All local changes will be lost.`)) {
       let resetContent = '';
       if (activeFile.name === 'index.html') resetContent = INITIAL_CODE.html;
       else if (activeFile.name === 'styles.css') resetContent = INITIAL_CODE.css;
       else if (activeFile.name === 'script.js' && activeFile.language === 'html') resetContent = INITIAL_CODE.frontendJs;
       else resetContent = INITIAL_CODE[activeFile.language as keyof CodeState] || '';
       
       updateFileContent(activeFile.id, resetContent);
    }
  }, [activeFile, updateFileContent]);

  const handleOptimize = useCallback(() => {
    if (aiChatRef.current) {
      aiChatRef.current.triggerAction(AIAction.OPTIMIZE);
    }
  }, []);

  const runCode = async () => {
    if (!activeFile) return;
    setIsRunning(true);
    setExecutionResult(null);
    // Automatically reveal output panel when running code
    setOutputPanelCollapsed(false);

    try {
      if (currentLanguage === 'mongodb') {
        setIsMongoLoading(true);
        const results = await simulateMongoQuery(activeFile.content);
        setMongoResults(results);
        setIsMongoLoading(false);
      } else if (currentLanguage !== 'html') {
        const result = await executeCode(currentLanguage, activeFile.content, stdin);
        setExecutionResult(result);
      }
    } catch (error) {
      setExecutionResult({ 
        output: '', 
        error: 'Engine failure: Failed to allocate compute resources.',
        status: 'FAILED' 
      });
    } finally {
      setIsRunning(false);
    }
  };

  const combinedFrontendState = useMemo(() => {
    const htmlFile = files.find(f => f.name === 'index.html' && f.language === 'html');
    const cssFile = files.find(f => f.name === 'styles.css' && f.language === 'html');
    const jsFile = files.find(f => f.name === 'script.js' && f.language === 'html');

    return {
      html: htmlFile?.content || '',
      css: cssFile?.content || '',
      frontendJs: jsFile?.content || '',
      python: '', java: '', javascript: '', mongodb: ''
    };
  }, [files]);

  const getFileIcon = (fileName: string, isActive: boolean) => {
    if (fileName.endsWith('.py')) return <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>PY</span>;
    if (fileName.endsWith('.java')) return <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>JV</span>;
    if (fileName.endsWith('.html')) return <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>HT</span>;
    if (fileName.endsWith('.css')) return <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>CS</span>;
    if (fileName.endsWith('.js')) return <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>JS</span>;
    return <span className={`text-[10px] font-bold opacity-50`}>TXT</span>;
  };

  const MemoizedNavbar = useMemo(() => (
    <Navbar 
      currentLanguage={currentLanguage} 
      currentTheme={currentTheme}
      onLanguageChange={(lang) => {
        setCurrentLanguage(lang);
        const firstOfLang = files.find(f => f.language === lang);
        if (firstOfLang) setActiveFileId(firstOfLang.id);
        setExecutionResult(null);
      }} 
      onThemeChange={setCurrentTheme}
      onRun={runCode}
      isRunning={isRunning}
      aiPanelCollapsed={aiPanelCollapsed}
      onToggleAiPanel={() => setAiPanelCollapsed(!aiPanelCollapsed)}
      outputPanelCollapsed={outputPanelCollapsed}
      onToggleOutputPanel={() => setOutputPanelCollapsed(!outputPanelCollapsed)}
    />
  ), [currentLanguage, currentTheme, isRunning, files, setActiveFileId, runCode, aiPanelCollapsed, outputPanelCollapsed]);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-app)] overflow-hidden antialiased font-inter transition-colors duration-300">
      {MemoizedNavbar}

      <div className="flex-1 flex overflow-hidden">
        <ActivityBar 
          activeTab={activeSidebarTab} 
          onTabChange={(tab) => {
            if (tab === activeSidebarTab) {
              setSidebarCollapsed(!sidebarCollapsed);
            } else {
              setActiveSidebarTab(tab as any);
              setSidebarCollapsed(false);
            }
          }} 
        />

        {!sidebarCollapsed && (
          <aside className="w-60 flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-app)] shrink-0 transition-all duration-300">
            <div className="h-9 flex items-center px-4 border-b border-[var(--border-app)] bg-black/10">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                {activeSidebarTab === 'explorer' ? 'Explorer' : activeSidebarTab === 'snippets' ? 'Snippets' : 'Search'}
              </span>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {activeSidebarTab === 'explorer' ? (
                <div className="flex flex-col h-full">
                  <div className="px-4 py-3 flex items-center justify-between group">
                    <span className="text-[10px] font-bold opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                       Project Files
                    </span>
                    <button onClick={handleCreateFile} className="p-1 hover:bg-white/5 rounded-md text-[var(--accent-primary)] transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <div className="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto scrollbar-none">
                    {filteredFiles.map(file => {
                      const isActive = activeFile?.id === file.id;
                      return (
                        <div 
                          key={file.id} 
                          onClick={() => setActiveFileId(file.id)} 
                          className={`group text-[11px] font-medium flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/5 text-[var(--text-highlight)] ring-1 ring-[var(--accent-primary)]/20 shadow-lg' 
                              : 'text-[var(--text-app)] hover:bg-white/5 hover:text-[var(--text-highlight)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                            <div className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 ${isActive ? 'bg-[var(--accent-primary)]/10' : 'bg-black/20'}`}>
                              {getFileIcon(file.name, isActive)}
                            </div>
                            <span className="truncate">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); handleRenameFile(file.id, file.name); }} className="p-1 hover:text-[var(--accent-primary)]"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" /></svg></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id, file.name); }} className="p-1 hover:text-red-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeSidebarTab === 'snippets' ? (
                <SnippetsPanel language={currentLanguage} onSelect={handleInsertSnippet} />
              ) : (
                <div className="p-6 text-[10px] opacity-40 font-bold uppercase tracking-widest text-center">Engine Standby</div>
              )}
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)] relative transition-all duration-300">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <EditorPanel
              language={currentLanguage}
              fileName={activeFile?.name || 'main'}
              code={combinedFrontendState as any}
              currentFileContent={activeFile?.content || ''}
              activeFrontendTab={activeFile?.name === 'styles.css' ? 'css' : activeFile?.name === 'script.js' ? 'js' : 'html'}
              onTabChange={() => {}} 
              onCodeChange={handleCodeChange}
              onReset={handleReset}
              onOptimize={handleOptimize}
            />
          </div>
          
          {!outputPanelCollapsed && (
            <div className="h-2/5 min-h-[150px] flex flex-col transition-all duration-300">
              <OutputPanel
                language={currentLanguage}
                code={combinedFrontendState as any}
                stdin={stdin}
                onStdinChange={setStdin}
                executionResult={executionResult}
                isRunning={isRunning}
                mongoResults={mongoResults}
                isMongoLoading={isMongoLoading}
                onClose={() => setOutputPanelCollapsed(true)}
              />
            </div>
          )}
        </div>

        {!aiPanelCollapsed && (
          <div className="w-[380px] shrink-0 flex transition-all duration-300 border-l border-[var(--border-app)]">
            <AIChatPanel 
              ref={aiChatRef}
              currentLanguage={currentLanguage} 
              currentCode={activeFile?.content || ''} 
              onApplyCode={handleApplyAICode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
