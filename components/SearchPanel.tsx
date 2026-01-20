
import React, { useState, useMemo } from 'react';
import { ProjectFile } from '../types';

interface SearchPanelProps {
  files: ProjectFile[];
  onSelectFile: (id: string) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ files, onSelectFile }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    return files.flatMap(file => {
      const lines = file.content.split('\n');
      return lines
        .map((line, index) => ({ line, index, fileId: file.id, fileName: file.name }))
        .filter(item => item.line.toLowerCase().includes(query.toLowerCase()))
        .map(item => ({ ...item, lineNumber: item.index + 1 }));
    });
  }, [query, files]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[var(--border-app)]">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code..."
            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-[var(--text-highlight)]"
          />
          <svg className="absolute right-3 top-2.5 w-3 h-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-none">
        {results.length > 0 ? (
          results.map((result, idx) => (
            <button
              key={`${result.fileId}-${idx}`}
              onClick={() => onSelectFile(result.fileId)}
              className="w-full text-left p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-[var(--accent-primary)] uppercase truncate tracking-widest">{result.fileName}</span>
                <span className="text-[9px] opacity-40">Line {result.lineNumber}</span>
              </div>
              <div className="text-[11px] text-[var(--text-app)] line-clamp-2 font-mono break-all opacity-80 group-hover:opacity-100">
                {result.line.trim()}
              </div>
            </button>
          ))
        ) : query.length >= 2 ? (
          <div className="text-center py-10 opacity-40 uppercase text-[10px] font-bold tracking-widest">
            No matches found
          </div>
        ) : (
          <div className="text-center py-10 opacity-20 uppercase text-[9px] font-bold tracking-widest">
            Enter 2+ characters
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
