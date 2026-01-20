
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChatMessage, Language, AIAction } from '../types';
import { askAIStream } from '../services/geminiService';

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
    { role: 'assistant', content: "Neural Core ready. Analyzing " + currentLanguage + " context. How can I assist your workflow?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      const stream = askAIStream(prompt, { code: currentCode, language: currentLanguage, action });
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
    }
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
              <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Snippet Generated</span>
              <button 
                onClick={() => onApplyCode(code)} 
                className="text-[9px] font-black text-[var(--accent-primary)] hover:brightness-125 transition-all uppercase tracking-widest bg-[var(--accent-primary)]/10 px-3 py-1 rounded-lg border border-[var(--accent-primary)]/20"
              >
                Apply Changes
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
      <div className="h-12 border-b border-[var(--border-app)] flex items-center justify-between px-6 bg-[var(--bg-navbar)] shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_12px_rgba(var(--accent-primary),0.6)] animate-pulse"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Co-Pilot Core</h3>
        </div>
        <div className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Active session</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
        <div className="flex flex-wrap gap-2 pb-6 border-b border-white/5">
          <ActionChip onClick={() => handleSend("Explain this code in detail.", AIAction.EXPLAIN)} label="Explain" icon="📘" />
          <ActionChip onClick={() => handleSend("Fix syntax and logical errors.", AIAction.FIX)} label="Fix Errors" icon="🛠️" />
          <ActionChip onClick={() => handleSend("Optimize for better performance.", AIAction.OPTIMIZE)} label="Optimize" icon="🚀" />
          <ActionChip onClick={() => handleSend("Add helpful comments to this code.", AIAction.GENERATE)} label="Document" icon="📝" />
          <ActionChip onClick={() => handleSend("Refactor this code to be cleaner.", AIAction.GENERATE)} label="Clean Code" icon="🧼" />
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start animate-in slide-in-from-bottom-2 duration-300'}`}>
            <div className={`max-w-[90%] rounded-2xl px-5 py-4 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-[var(--accent-primary)]/5 text-[var(--text-highlight)] border border-[var(--accent-primary)]/20' 
                : 'bg-white/[0.03] text-[var(--text-app)] border border-white/5 w-full'
            }`}>
              {renderMessageContent(msg.content)}
            </div>
            {msg.role === 'assistant' && msg.content && !isTyping && idx === messages.length - 1 && (
              <div className="flex gap-4 mt-3 px-1">
                <button className="text-[9px] font-bold uppercase opacity-30 hover:opacity-100 transition-opacity tracking-widest">Copy Result</button>
                <button className="text-[9px] font-bold uppercase opacity-30 hover:opacity-100 transition-opacity tracking-widest text-emerald-500">Share Link</button>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-[var(--bg-navbar)] border-t border-[var(--border-app)] transition-colors duration-300">
        <div className="relative group">
          <textarea
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask Co-Pilot something..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-6 pr-14 py-4 text-[12px] focus:outline-none focus:border-[var(--accent-primary)]/30 text-[var(--text-highlight)] transition-all resize-none overflow-hidden placeholder-white/10 shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !inputValue.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[var(--accent-primary)] text-black rounded-xl transition-all disabled:opacity-20 active:scale-90 shadow-xl shadow-[var(--accent-primary)]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
        <p className="mt-4 text-center text-[9px] opacity-20 font-bold uppercase tracking-[0.2em]">Powered by Gemini-3 Flash Engine</p>
      </div>
    </div>
  );
});

const ActionChip: React.FC<{ label: string; onClick: () => void; icon: string }> = ({ label, onClick, icon }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-[var(--accent-primary)]/30 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-tight text-[var(--text-app)] hover:text-[var(--text-highlight)]"
  >
    <span>{icon}</span>
    {label}
  </button>
);

export default React.memo(AIChatPanel);
