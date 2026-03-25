import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChatStore, Message } from '../store/chatStore';

export function Chatbot() {
  const { isOpen, toggleChat, closeChat, messages, addMessage, contextString } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          contextString: contextString,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      addMessage({ role: 'model', content: data.content });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ role: 'model', content: 'Oops! Something went wrong while connecting to the ecosystem. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-accent-cyan text-dark-950 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="glass-panel w-96 rounded-[32px] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/5 bg-dark-950/90 backdrop-blur-2xl animate-scale-in h-[600px] max-h-[85vh] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="border-b border-white/5 p-6 flex justify-between items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-glow" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">System AI</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Atlas Guide</h3>
            </div>
            <button onClick={closeChat} className="h-10 w-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm mt-12 px-6">
                <div className="w-16 h-16 rounded-[24px] bg-dark-900 border border-white/5 flex items-center justify-center text-2xl mx-auto mb-6 shadow-xl">
                  ✨
                </div>
                <p className="text-white font-black text-lg mb-2">Initialize Atlas AI</p>
                <p className="text-slate-500 font-medium leading-relaxed">Ask about Mantle protocols, yield optimization, or ecosystem trends.</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-[24px] px-5 py-4 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent-cyan text-dark-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-br-none' 
                      : 'bg-white/[0.03] border border-white/5 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className={`whitespace-pre-wrap leading-relaxed [&_p]:mb-3 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1 ${msg.role === 'user' ? '[&_strong]:text-dark-900' : '[&_strong]:text-accent-cyan'} [&_strong]:font-black [&_h3]:font-black [&_h3]:text-white [&_h3]:mb-2 [&_h4]:font-black [&_h4]:text-white [&_h4]:mb-2`}>
                    {msg.role === 'model' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-[24px] px-6 py-4 bg-white/[0.03] border border-white/5 text-slate-400 rounded-bl-none flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan/80">Processing Signal</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-dark-900/50 border-t border-white/5 relative z-10">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Atlas about Mantle..."
                disabled={isLoading}
                className="flex-1 bg-dark-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan/30 transition-all font-medium"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:cursor-not-allowed text-dark-950 rounded-2xl w-14 flex items-center justify-center transition-all duration-300"
              >
                <Send size={20} strokeWidth={3} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
