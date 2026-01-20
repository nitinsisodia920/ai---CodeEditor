
import React, { useState, useMemo } from 'react';

interface MongoPlaygroundProps {
  results: any;
  isLoading: boolean;
}

const MongoPlayground: React.FC<MongoPlaygroundProps> = ({ results, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'raw' | 'schema'>('raw');

  const inferredSchema = useMemo(() => {
    if (!results || !Array.isArray(results) || results.length === 0) return null;
    const firstDoc = results[0];
    return Object.entries(firstDoc).map(([key, value]) => ({
      field: key,
      type: Array.isArray(value) ? 'Array' : typeof value,
      sample: typeof value === 'object' ? '{...}' : String(value)
    }));
  }, [results]);

  return (
    <div className="h-full bg-[#0d1117] flex flex-col transition-all duration-300">
      <div className="px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Database Sandbox</span>
          <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
             <button 
               onClick={() => setActiveTab('raw')}
               className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activeTab === 'raw' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
             >
               Documents
             </button>
             <button 
               onClick={() => setActiveTab('schema')}
               className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activeTab === 'schema' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
             >
               Schema View
             </button>
          </div>
        </div>
        {results && (
          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
            {Array.isArray(results) ? results.length : 1} Records Found
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto font-mono text-sm scrollbar-none">
        {isLoading ? (
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Inference Engine Active</span>
          </div>
        ) : activeTab === 'raw' ? (
          <div className="p-6">
            <pre className="text-blue-300/80 leading-relaxed whitespace-pre-wrap selection:bg-blue-500/20">
              {results ? JSON.stringify(results, null, 2) : "// Awaiting query execution..."}
            </pre>
          </div>
        ) : (
          <div className="p-6 space-y-4">
             {inferredSchema ? (
               <div className="grid gap-2">
                 <div className="grid grid-cols-3 p-3 bg-black/40 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <span>Field Name</span>
                    <span>Data Type</span>
                    <span>Sample Inbound</span>
                 </div>
                 {inferredSchema.map((item, i) => (
                   <div key={i} className="grid grid-cols-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg text-[11px] group hover:border-blue-500/30 transition-all">
                      <span className="text-blue-400 font-bold">{item.field}</span>
                      <span className="text-gray-500 uppercase text-[9px] font-black">{item.type}</span>
                      <span className="text-emerald-500/80 truncate opacity-60 group-hover:opacity-100">{item.sample}</span>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  <p className="text-[10px] font-black uppercase tracking-widest">Execute query to infer collection schema</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MongoPlayground;
