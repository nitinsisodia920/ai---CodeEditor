
import React from 'react';
import { ProjectSettings } from '../types';

interface SettingsModalProps {
  settings: ProjectSettings;
  onUpdate: (settings: ProjectSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--bg-sidebar)] border border-[var(--border-app)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[var(--border-app)] flex justify-between items-center bg-black/10">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50">Advanced Config</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-30">Font Size ({settings.fontSize}px)</label>
            <input 
              type="range" 
              min="10" 
              max="24" 
              value={settings.fontSize} 
              onChange={(e) => onUpdate({ ...settings, fontSize: parseInt(e.target.value) })}
              className="w-full accent-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ToggleOption 
              label="Word Wrap" 
              active={settings.wordWrap === 'on'} 
              onClick={() => onUpdate({ ...settings, wordWrap: settings.wordWrap === 'on' ? 'off' : 'on' })} 
            />
            <ToggleOption 
              label="Line Numbers" 
              active={settings.lineNumbers === 'on'} 
              onClick={() => onUpdate({ ...settings, lineNumbers: settings.lineNumbers === 'on' ? 'off' : 'on' })} 
            />
            <ToggleOption 
              label="Minimap" 
              active={settings.minimap} 
              onClick={() => onUpdate({ ...settings, minimap: !settings.minimap })} 
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-black/10 border-t border-[var(--border-app)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[var(--accent-primary)] text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:opacity-90 transition-all"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleOption: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
  >
    <span className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'text-[var(--accent-primary)]' : 'text-slate-500'}`}>{label}</span>
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-[var(--accent-primary)] shadow-[0_0_8px_rgba(var(--accent-primary),0.5)]' : 'bg-slate-700'}`}></div>
  </button>
);

export default SettingsModal;
