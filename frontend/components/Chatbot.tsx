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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-mantle-600 to-cyan-600 text-white rounded-full p-4 shadow-lg shadow-mantle-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="glass-panel w-80 sm:w-96 rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-glass-border bg-slate-900/95 backdrop-blur-xl animate-slide-up h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-mantle-500/10 border-b border-glass-border p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ecosystem Guide
              </h3>
              <p className="text-xs text-slate-400">Ask about TVL, Alpha strategies &amp; DeFi concepts</p>
            </div>
            <button onClick={closeChat} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm mt-10">
                <div className="w-12 h-12 rounded-full bg-mantle-500/10 flex items-center justify-center text-mantle-400 mx-auto mb-3">
                  ✨
                </div>
                <p>Hello! I&apos;m your Mantle Atlas Ecosystem Guide.</p>
                <p className="mt-2 text-xs">I can help you analyze the live dashboard data or explain DeFi concepts.</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-mantle-600/80 text-white rounded-br-sm' 
                      : 'bg-dark-800 border border-glass-border text-slate-200 rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed [&_p]:mb-3 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1 [&_strong]:text-slate-100 [&_strong]:font-bold [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2 [&_h4]:font-bold [&_h4]:text-white [&_h4]:mb-2">
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
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-dark-800 border border-glass-border text-slate-400 rounded-bl-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-mantle-400" />
                  <span className="text-xs">Analyzing ecosystem data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-glass-border p-3 bg-dark-800/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Mantle protocols..."
                disabled={isLoading}
                className="flex-1 bg-dark-900 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-mantle-500/50 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-mantle-600 hover:bg-mantle-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 flex items-center justify-center transition-colors shadow-lg shadow-mantle-500/20"
              >
                <Send size={18} className={input.trim() && !isLoading ? "text-white" : "text-slate-300"} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
