
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChatMessage, Language, AIAction, AIPersona, AIAuditResult } from '../types';
import { askAIStream, auditCode } from '../services/geminiService';

interface AIChatPanelProps {
  currentLanguage: Language;
  currentCode: string;
  onApplyCode: (code: string) => void;
}

export interface AIChatHandle {
  triggerAction: (action: AIAction) => void;
}

const AIChatPanel = forwardRef<AIChatHandle, AIChatPanelProps>(({ currentLanguage, currentCode, onApplyCode }, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Neural Core ready. Analyzing " + currentLanguage + " context. Select an Expert Persona to begin audit." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [persona, setPersona] = useState<AIPersona>('Clean Code Guru');
  const [audit, setAudit] = useState<AIAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleAudit = async () => {
    if (!currentCode.trim() || isAuditing) return;
    setIsAuditing(true);
    const result = await auditCode(currentCode, currentLanguage);
    setAudit(result);
    setIsAuditing(false);
  };

  const handleSend = async (customPrompt?: string, action: AIAction = AIAction.GENERATE) => {
    const prompt = customPrompt || inputValue;
    if (!prompt.trim() && !customPrompt) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const assistantMsgIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    let fullResponse = '';
    try {
      const stream = askAIStream(prompt, { code: currentCode, language: currentLanguage, action, persona });
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[assistantMsgIndex] = { role: 'assistant', content: fullResponse };
          return updated;
        });
      }
    } catch (e) {
      setMessages(prev => {
        const updated = [...prev];
        updated[assistantMsgIndex] = { role: 'assistant', content: "Neural link interrupted. Please try again." };
        return updated;
      });
    } finally {
      setIsTyping(false);
      handleAudit(); // Re-audit after AI changes
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + ' ' + transcript);
    };

    recognition.start();
  };

  useImperativeHandle(ref, () => ({
    triggerAction: (action: AIAction) => {
      handleSend(`Audit and optimize current implementation focusing on ${action}.`, action);
    }
  }));

  const renderMessageContent = (content: string) => {
    if (!content) return (
      <div className="flex space-x-1 items-center h-4">
        <div className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce"></div>
      </div>
    );
    
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const code = match?.[2] || part.replace(/```/g, '').trim();
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl group/code">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
              <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Refined Implementation</span>
              <button 
                onClick={() => onApplyCode(code)} 
                className="text-[9px] font-black text-[var(--accent-primary)] hover:brightness-125 transition-all uppercase tracking-widest bg-[var(--accent-primary)]/10 px-3 py-1 rounded-lg border border-[var(--accent-primary)]/20"
              >
                Sync Codebase
              </button>
            </div>
            <pre className="p-5 text-[10px] font-mono overflow-x-auto text-[var(--text-highlight)]/90 leading-relaxed scrollbar-none"><code>{code}</code></pre>
          </div>
        );
      }
      return <div key={index} className="whitespace-pre-wrap text-[var(--text-app)] leading-[1.7] font-medium text-[12px] opacity-90">{part}</div>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] border-l border-[var(--border-app)] w-full overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 bg-[var(--bg-navbar)] border-b border-[var(--border-app)] shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Neuro Audit</h3>
          </div>
          <select 
            value={persona} 
            onChange={(e) => setPersona(e.target.value as AIPersona)}
            className="bg-white/5 border border-white/5 rounded px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--accent-primary)] focus:outline-none"
          >
            <option value="Mentor">Expert Mentor</option>
            <option value="Security Lead">Security Lead</option>
            <option value="Clean Code Guru">Code Guru</option>
            <option value="Performance Ninja">Performance Ninja</option>
          </select>
        </div>

        {/* Audit Scoreboard */}
        <div className="grid grid-cols-3 gap-3">
          <ScoreMeter label="Maint." score={audit?.maintainability || 0} loading={isAuditing} />
          <ScoreMeter label="Sec." score={audit?.security || 0} loading={isAuditing} />
          <ScoreMeter label="Perf." score={audit?.performance || 0} loading={isAuditing} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
        {audit && audit.suggestions.length > 0 && (
          <div className="bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-primary)] mb-3 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Strategic Suggestions
            </h4>
            <ul className="space-y-2">
              {audit.suggestions.map((s, i) => (
                <li key={i} className="text-[11px] font-medium opacity-80 flex items-start gap-2">
                  <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start animate-in slide-in-from-bottom-2 duration-300'}`}>
            <div className={`max-w-[90%] rounded-2xl px-5 py-4 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-[var(--accent-primary)]/5 text-[var(--text-highlight)] border border-[var(--accent-primary)]/20' 
                : 'bg-white/[0.03] text-[var(--text-app)] border border-white/5 w-full'
            }`}>
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-[var(--bg-navbar)] border-t border-[var(--border-app)]">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask Co-Pilot..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-6 pr-14 py-4 text-[12px] focus:outline-none focus:border-[var(--accent-primary)]/30 text-[var(--text-highlight)] transition-all resize-none overflow-hidden placeholder-white/10"
            />
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[var(--accent-primary)] text-black rounded-xl transition-all disabled:opacity-20 active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const ScoreMeter: React.FC<{ label: string; score: number; loading: boolean }> = ({ label, score, loading }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{label}</span>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
      <div 
        className={`h-full bg-[var(--accent-primary)] transition-all duration-1000 ${loading ? 'animate-pulse' : ''}`} 
        style={{ width: `${loading ? 100 : score}%` }}
      ></div>
    </div>
    <span className="text-[10px] font-bold text-[var(--text-highlight)] font-mono">{loading ? '...' : `${score}%`}</span>
  </div>
);

export default React.memo(AIChatPanel);
