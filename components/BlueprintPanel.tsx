
import React, { useState } from 'react';
import { generateBlueprint } from '../services/geminiService';

const BlueprintPanel: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [blueprint, setBlueprint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateBlueprint(topic);
      setBlueprint(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] p-5 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Architecture Engine</h3>
        <div className="flex gap-2">
           <input 
             type="text" 
             value={topic}
             onChange={(e) => setTopic(e.target.value)}
             placeholder="App idea (e.g. Chat app with Redis)"
             className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent-primary)]/30 text-[var(--text-highlight)]"
             onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
           />
           <button 
             onClick={handleGenerate}
             disabled={isLoading || !topic.trim()}
             className="px-4 py-2 bg-[var(--accent-primary)] text-black rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-30 transition-all active:scale-95"
           >
             Build
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none pr-2">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
             <div className="w-12 h-1 bg-[var(--accent-primary)] animate-pulse rounded-full"></div>
             <p className="text-[9px] font-black uppercase tracking-widest text-center leading-relaxed">Synthesizing<br/>Technical Architecture</p>
          </div>
        ) : blueprint ? (
          <div className="prose prose-invert prose-xs max-w-none text-[12px] leading-relaxed text-[var(--text-app)] animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 whitespace-pre-wrap font-sans">
                {blueprint}
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 text-center">
             <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Enter a project vision to generate a technical roadmap</p>
          </div>
        )}
      </div>
      
      {blueprint && (
        <button 
          onClick={() => { setBlueprint(null); setTopic(''); }}
          className="mt-4 w-full py-2 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all"
        >
          Reset Canvas
        </button>
      )}
    </div>
  );
};

export default BlueprintPanel;
