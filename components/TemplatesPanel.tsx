
import React from 'react';
import { ProjectTemplate } from '../types';
import { PROJECT_TEMPLATES } from '../constants';

interface TemplatesPanelProps {
  onSelect: (template: ProjectTemplate) => void;
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onSelect }) => {
  const categories = Array.from(new Set(PROJECT_TEMPLATES.map(t => t.category)));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[var(--border-app)] bg-black/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Ready Modules</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-none">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-1">
              {category}
            </h4>
            <div className="space-y-2">
              {PROJECT_TEMPLATES.filter(t => t.category === category).map(template => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[var(--accent-primary)]/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{template.icon}</span>
                    <span className="text-[11px] font-black text-[var(--text-highlight)] uppercase tracking-tight">{template.name}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-app)] opacity-60 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-all">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">Initialize Workspace</span>
                    <svg className="w-2.5 h-2.5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPanel;
