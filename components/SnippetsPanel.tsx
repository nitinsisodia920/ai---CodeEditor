
import React, { useState } from 'react';
import { Language } from '../types';
import { SNIPPETS, Snippet } from '../data/snippets';

interface SnippetsPanelProps {
  language: Language;
  onSelect: (code: string) => void;
}

const SnippetsPanel: React.FC<SnippetsPanelProps> = ({ language, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const snippets = SNIPPETS[language] || [];
  
  const filteredSnippets = snippets.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(snippets.map(s => s.category)));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-10">
        <input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {categories.map(category => {
          const categorySnippets = filteredSnippets.filter(s => s.category === category);
          if (categorySnippets.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-tighter text-gray-600 px-2 py-1">
                {category}
              </h4>
              <div className="space-y-1">
                {categorySnippets.map(snippet => (
                  <button
                    key={snippet.id}
                    onClick={() => onSelect(snippet.code)}
                    className="w-full text-left p-2 hover:bg-[#21262d] rounded-md transition-colors group relative"
                  >
                    <div className="text-[11px] font-bold text-gray-300 group-hover:text-blue-400">
                      {snippet.name}
                    </div>
                    <div className="text-[9px] text-gray-500 line-clamp-1">
                      {snippet.description}
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {filteredSnippets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-gray-600 italic">No snippets found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetsPanel;
