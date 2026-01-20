
import { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectFile, Language } from '../types';
import { INITIAL_CODE } from '../constants';

export const useCodeState = () => {
  const [files, setFiles] = useState<ProjectFile[]>(() => {
    const saved = localStorage.getItem('codestream_files');
    if (saved) return JSON.parse(saved);
    
    // Default starting files
    return [
      { id: '1', name: 'main.py', language: 'python', content: INITIAL_CODE.python },
      { id: '2', name: 'Main.java', language: 'java', content: INITIAL_CODE.java },
      { id: '3', name: 'index.js', language: 'javascript', content: INITIAL_CODE.javascript },
      { id: '4', name: 'index.html', language: 'html', content: INITIAL_CODE.html },
      { id: '5', name: 'styles.css', language: 'html', content: INITIAL_CODE.css },
      { id: '6', name: 'script.js', language: 'html', content: INITIAL_CODE.frontendJs },
      { id: '7', name: 'query.mongodb', language: 'mongodb', content: INITIAL_CODE.mongodb },
    ];
  });

  const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id || '');
  const saveTimeoutRef = useRef<number | null>(null);

  // Debounced persistence to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      localStorage.setItem('codestream_files', JSON.stringify(files));
      console.log('✅ Changes persisted to local storage');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, [files]);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content } : f));
  }, []);

  const addFile = useCallback((name: string, language: Language) => {
    const newFile: ProjectFile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      language,
      content: ''
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    return newFile.id;
  }, []);

  const renameFile = useCallback((fileId: string, newName: string, newLanguage: Language) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, name: newName, language: newLanguage } : f
    ));
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== fileId);
      if (activeFileId === fileId && filtered.length > 0) {
        setActiveFileId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveFileId('');
      }
      return filtered;
    });
  }, [activeFileId]);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  return { 
    files, 
    activeFile, 
    setActiveFileId, 
    updateFileContent, 
    addFile, 
    renameFile,
    deleteFile 
  };
};
