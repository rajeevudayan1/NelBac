
import React, { useState, useRef, useEffect } from 'react';
import { getSmartAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const STORAGE_KEY = 'nelbac_chat_history';
const SESSION_KEY = 'nelbac_session_id';

const SmartAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session and history
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    let savedSessionId = localStorage.getItem(SESSION_KEY);

    if (!savedSessionId) {
      savedSessionId = `sess_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      localStorage.setItem(SESSION_KEY, savedSessionId);
    }
    setSessionId(savedSessionId);

    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([
        { role: 'ai', content: "Systems check complete. I am the Nelbac AI Advisor. How can I assist with your infrastructure today?" }
      ]);
    }
  }, []);

  // Persist history to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const clearHistory = () => {
    const initialMsg: ChatMessage[] = [{ role: 'ai', content: "Memory buffer cleared. System ready for new input." }];
    setMessages(initialMsg);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    const advice = await getSmartAdvice(userMsg);
    
    setIsTyping(false);
    const finalMessages: ChatMessage[] = [...newMessages, { role: 'ai', content: advice }];
    setMessages(finalMessages);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="glass w-[350px] sm:w-[400px] h-[550px] rounded-3xl overflow-hidden border border-[#00f3ff]/20 flex flex-col shadow-2xl">
          <div className="bg-[#00f3ff] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                <i className="fas fa-robot text-black text-sm"></i>
              </div>
              <div>
                <span className="font-bold text-black text-sm block leading-none mb-1 font-heading">Nelbac AI Advisor</span>
                <span className="text-[8px] text-black/60 font-black uppercase tracking-tighter">ID: {sessionId}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearHistory} className="text-black/40 hover:text-black transition-colors" title="Clear Buffer">
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-black/80 hover:text-black">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-primary)]/50"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#00f3ff] text-black rounded-br-none font-medium shadow-lg' 
                    : 'glass border border-[var(--border-primary)] text-[var(--text-primary)] rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass border border-[var(--border-primary)] px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-bounce shadow-[0_0_5px_#00f3ff]"></div>
                    <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-bounce delay-75 shadow-[0_0_5px_#00f3ff]"></div>
                    <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-bounce delay-150 shadow-[0_0_5px_#00f3ff]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about IoT solutions..."
                className="w-full bg-[var(--text-primary)]/5 border border-[var(--border-primary)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f3ff] text-[var(--text-primary)] pr-12"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#00f3ff] rounded-lg flex items-center justify-center hover:bg-[#00f3ff]/80 transition-colors shadow-[0_0_10px_#00f3ff]"
              >
                <i className="fas fa-paper-plane text-xs text-black"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#00f3ff] rounded-full flex items-center justify-center shadow-[0_0_30px_#00f3ff] hover:scale-110 transition-all group"
        >
          <div className="relative">
             <i className="fas fa-brain text-black text-2xl group-hover:animate-pulse"></i>
             {messages.length > 1 && !isOpen && (
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--text-primary)] rounded-full flex items-center justify-center border-2 border-[#00f3ff]">
                 <div className="w-1.5 h-1.5 bg-[var(--bg-primary)] rounded-full"></div>
               </div>
             )}
          </div>
        </button>
      )}
    </div>
  );
};

export default SmartAdvisor;
