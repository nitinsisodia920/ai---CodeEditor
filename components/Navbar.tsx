
import React, { useState, useEffect } from 'react';
import { Language, ThemeType } from '../types';
import { LANGUAGES, THEMES } from '../constants';

interface NavbarProps {
  currentLanguage: Language;
  currentTheme: ThemeType;
  onLanguageChange: (lang: Language) => void;
  onThemeChange: (theme: ThemeType) => void;
  onRun: () => void;
  isRunning: boolean;
  aiPanelCollapsed: boolean;
  onToggleAiPanel: () => void;
  outputPanelCollapsed: boolean;
  onToggleOutputPanel: () => void;
  onExportProject: () => void;
  onShareProject: () => void;
  interviewMode: boolean;
  onToggleInterviewMode: () => void;
  timer: number;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentLanguage, 
  currentTheme, 
  onLanguageChange, 
  onThemeChange, 
  onRun, 
  isRunning,
  aiPanelCollapsed,
  onToggleAiPanel,
  outputPanelCollapsed,
  onToggleOutputPanel,
  onExportProject,
  onShareProject,
  interviewMode,
  onToggleInterviewMode,
  timer,
  onOpenSettings
}) => {
  const [showThemes, setShowThemes] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="h-12 bg-[var(--bg-navbar)] border-b border-[var(--border-app)] flex items-center justify-between px-4 z-50 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 select-none">
          <div className="w-7 h-7 bg-[var(--text-highlight)] rounded-md flex items-center justify-center font-black text-[var(--bg-navbar)] text-[9px] tracking-tighter shadow-lg shadow-[var(--accent-primary)]/20">
            CS
          </div>
          <span className="font-bold text-[11px] uppercase tracking-[0.25em] text-[var(--text-highlight)] hidden md:block">
            CodeStream <span className="text-[var(--accent-primary)]">AI</span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-2 hidden lg:block"></div>

        {!interviewMode && (
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => onLanguageChange(lang.value)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition-all flex items-center gap-2 uppercase ${
                  currentLanguage === lang.value
                    ? 'bg-white/10 text-[var(--text-highlight)] shadow-sm'
                    : 'text-[var(--text-app)] hover:text-[var(--text-highlight)] hover:bg-white/[0.02]'
                }`}
              >
                <span className="text-xs">{lang.icon}</span>
                <span className="hidden sm:inline">{lang.label}</span>
              </button>
            ))}
          </div>
        )}

        {interviewMode && (
          <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-lg">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Session Active</span>
            <div className="w-[1px] h-3 bg-red-500/20"></div>
            <span className="text-[12px] font-mono font-bold text-white tabular-nums">{formatTime(timer)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Project Utilities */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleInterviewMode}
            title={interviewMode ? "Exit Interview Mode" : "Start Interview Mode"}
            className={`p-1.5 transition-all rounded-md ${interviewMode ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {!interviewMode && (
            <>
              <button 
                onClick={onShareProject}
                title="Share Project Link"
                className="p-1.5 text-slate-500 hover:text-[var(--accent-primary)] transition-all hover:bg-white/5 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button 
                onClick={onExportProject}
                title="Export Project (JSON)"
                className="p-1.5 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="h-5 w-[1px] bg-white/5 mx-1"></div>

        {/* Layout Toggles */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
          <button 
            onClick={onToggleOutputPanel}
            title={outputPanelCollapsed ? "Show Console" : "Hide Console"}
            className={`p-1.5 rounded-md transition-all ${!outputPanelCollapsed ? 'text-[var(--accent-primary)] bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
            </svg>
          </button>
          {!interviewMode && (
            <button 
              onClick={onToggleAiPanel}
              title={aiPanelCollapsed ? "Open AI Co-Pilot" : "Hide AI Assistant"}
              className={`p-1.5 rounded-md transition-all ${!aiPanelCollapsed ? 'text-[var(--accent-primary)] bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          )}
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block"></div>

        {/* Theme & Settings */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSettings}
            className="p-1.5 text-slate-500 hover:text-white transition-all"
            title="Editor Settings"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowThemes(!showThemes)}
              className="flex items-center gap-2 px-3 h-8 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md transition-all group"
            >
              <div className="w-2.5 h-2.5 rounded-full border border-white/20 bg-[var(--accent-primary)]"></div>
              <span className="text-[10px] font-bold text-[var(--text-app)] uppercase tracking-widest hidden lg:block">Theme</span>
            </button>

            {showThemes && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-sidebar)] border border-[var(--border-app)] rounded-xl shadow-2xl p-1 z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                {Object.entries(THEMES).map(([key, theme]: [any, any]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onThemeChange(key);
                      setShowThemes(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      currentTheme === key ? 'bg-white/10 text-[var(--text-highlight)]' : 'text-[var(--text-app)] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-1 w-8 shrink-0">
                      <div className="w-3 h-3 rounded-full" style={{ background: theme.primary }}></div>
                      <div className="w-3 h-3 rounded-full opacity-40" style={{ background: theme.bg }}></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider truncate">{theme.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-6 h-8 rounded-md font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
            isRunning 
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : interviewMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[var(--accent-primary)] text-black hover:opacity-90 shadow-[var(--accent-primary)]/30'
          }`}
        >
          {isRunning ? (
             <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
          {interviewMode ? 'SUBMIT' : isRunning ? 'EXEC' : 'RUN'}
        </button>

        <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block"></div>

        {/* User Profile */}
        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className={`h-8 w-8 rounded-full border transition-all flex items-center justify-center overflow-hidden ${
            isLoggedIn ? 'border-[var(--accent-primary)]/50' : 'border-white/10'
          }`}
        >
          {isLoggedIn ? (
            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
