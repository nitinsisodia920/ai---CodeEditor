
import React from 'react';
import { ProjectFile } from '../types';

interface TabBarProps {
  openFiles: ProjectFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCloseFile: (id: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ openFiles, activeFileId, onSelectFile, onCloseFile }) => {
  if (openFiles.length === 0) return null;

  return (
    <div className="h-9 bg-[var(--bg-sidebar)] border-b border-[var(--border-app)] flex items-center overflow-x-auto scrollbar-none transition-colors duration-300">
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId;
        return (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className={`group h-full flex items-center gap-2 px-3 border-r border-[var(--border-app)] cursor-pointer select-none transition-all relative min-w-[120px] max-w-[200px] ${
              isActive 
                ? 'bg-[var(--bg-app)] text-[var(--text-highlight)]' 
                : 'text-[var(--text-app)] hover:bg-white/5'
            }`}
          >
            {isActive && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)] shadow-[0_0_8px_rgba(var(--accent-primary),0.4)]" />}
            
            <span className="text-[10px] font-bold truncate flex-1 uppercase tracking-tight">
              {file.name}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseFile(file.id);
              }}
              className={`p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity ${
                isActive ? 'opacity-100' : ''
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
