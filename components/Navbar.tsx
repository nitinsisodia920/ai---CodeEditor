
import React, { useState } from 'react';
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
  onToggleOutputPanel
}) => {
  const [showThemes, setShowThemes] = useState(false);

  return (
    <nav className="h-12 bg-[var(--bg-navbar)] border-b border-[var(--border-app)] flex items-center justify-between px-4 z-50 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 select-none">
          <div className="w-7 h-7 bg-[var(--text-highlight)] rounded-md flex items-center justify-center font-black text-[var(--bg-navbar)] text-[9px] tracking-tighter shadow-lg shadow-[var(--accent-primary)]/10">
            CS
          </div>
          <span className="font-bold text-[11px] uppercase tracking-[0.25em] text-[var(--text-highlight)] hidden md:block">
            CodeStream <span className="text-[var(--accent-primary)]">Node</span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-2 hidden lg:block"></div>

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
      </div>

      <div className="flex items-center gap-3">
        {/* Layout Toggles */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
          <button 
            onClick={onToggleOutputPanel}
            title={outputPanelCollapsed ? "Show Terminal" : "Hide Terminal"}
            className={`p-1.5 rounded-md transition-all ${!outputPanelCollapsed ? 'text-[var(--accent-primary)] bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button 
            onClick={onToggleAiPanel}
            title={aiPanelCollapsed ? "Show AI Assistant" : "Hide AI Assistant"}
            className={`p-1.5 rounded-md transition-all ${!aiPanelCollapsed ? 'text-[var(--accent-primary)] bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block"></div>

        {/* Theme Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowThemes(!showThemes)}
            className="flex items-center gap-2 px-3 h-8 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md transition-all group"
          >
            <div className="w-3 h-3 rounded-full border border-white/20 bg-[var(--accent-primary)]"></div>
            <span className="text-[10px] font-bold text-[var(--text-app)] uppercase tracking-widest hidden lg:block">Theme</span>
            <svg className={`w-3 h-3 text-[var(--text-app)] transition-transform ${showThemes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          {showThemes && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-sidebar)] border border-[var(--border-app)] rounded-xl shadow-2xl p-1 z-50 overflow-hidden backdrop-blur-xl">
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
                  <div className="flex items-center gap-1 w-8">
                    <div className="w-3 h-3 rounded-full" style={{ background: theme.primary }}></div>
                    <div className="w-3 h-3 rounded-full opacity-40" style={{ background: theme.bg }}></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{theme.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block"></div>

        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-6 h-8 rounded-md font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
            isRunning 
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-[var(--accent-primary)] text-black hover:opacity-90 shadow-[var(--accent-primary)]/20'
          }`}
        >
          {isRunning ? (
             <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
          {isRunning ? 'Busy' : 'Run'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
