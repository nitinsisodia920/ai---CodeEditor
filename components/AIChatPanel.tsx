
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

    // Prepare assistant message for streaming
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
      handleSend(`Audit and optimize current implementation.`, action);
    }
  }));

  const renderMessageContent = (content: string) => {
    if (!content) return <div className="animate-pulse flex space-x-2"><div className="h-2 w-2 bg-slate-500 rounded-full"></div><div className="h-2 w-2 bg-slate-500 rounded-full"></div></div>;
    
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const code = match?.[2] || part.replace(/```/g, '').trim();
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden border border-white/10 bg-black/60 shadow-xl group/code">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
              <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">Compiler Result</span>
              <button 
                onClick={() => onApplyCode(code)} 
                className="text-[9px] font-black text-[var(--accent-primary)] hover:opacity-80 transition-all uppercase tracking-widest border border-[var(--accent-primary)]/20 px-2 py-0.5 rounded bg-[var(--accent-primary)]/5"
              >
                Apply Change
              </button>
            </div>
            <pre className="p-4 text-[10.5px] font-mono overflow-x-auto text-[var(--text-highlight)]/90 leading-relaxed scrollbar-none"><code>{code}</code></pre>
          </div>
        );
      }
      return <div key={index} className="whitespace-pre-wrap text-[var(--text-app)] leading-[1.6] font-medium text-[12px]">{part}</div>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] border-l border-[var(--border-app)] w-full lg:w-[380px] shrink-0 overflow-hidden transition-colors duration-300">
      <div className="h-12 border-b border-[var(--border-app)] flex items-center justify-between px-5 bg-[var(--bg-navbar)] shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(var(--accent-primary),0.8)]"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">Intelligence</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none">
        <div className="grid grid-cols-2 gap-2 pb-4 border-b border-[var(--border-app)]">
          {Object.values(AIAction).slice(0, 4).map((action) => (
            <button
              key={action}
              onClick={() => handleSend(`${action} implementation.`, action as AIAction)}
              className="px-3 py-2 text-[9px] font-bold bg-white/5 hover:bg-white/10 text-[var(--text-app)] hover:text-[var(--text-highlight)] border border-white/5 rounded-md transition-all text-center uppercase tracking-tight"
            >
              {action}
            </button>
          ))}
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[95%] rounded-xl px-4 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20' 
                : 'bg-white/5 text-[var(--text-app)] border border-white/5 w-full'
            }`}>
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 px-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:0s]"></div>
              <div className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-5 bg-[var(--bg-navbar)] border-t border-[var(--border-app)] transition-colors duration-300">
        <div className="relative group">
          <textarea
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Command input..."
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-5 pr-12 py-3.5 text-[12px] focus:outline-none focus:border-white/20 text-[var(--text-highlight)] transition-all resize-none overflow-hidden placeholder-white/20 shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !inputValue.trim()}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-[var(--accent-primary)] text-black rounded-lg transition-all disabled:opacity-20 active:scale-95 shadow-lg shadow-[var(--accent-primary)]/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default React.memo(AIChatPanel);
