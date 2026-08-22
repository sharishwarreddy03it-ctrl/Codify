import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Bug,
  Lightbulb,
  BookOpen,
  User,
  Loader2,
} from 'lucide-react';
import { Language } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: Language;
  currentCode?: string;
  currentLessonTitle?: string;
  currentError?: string;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  currentLanguage = 'python',
  currentCode = '',
  currentLessonTitle = '',
  currentError = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **Codify AI Tutor**. I'm here to explain concepts, guide you with hints, and help you debug without spoiling the answers. How can I assist your ${currentLanguage} learning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string, customMode?: 'explain' | 'hint' | 'debug') => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let endpoint = '/api/ai/ask';
      let payload: any = {
        question: textToSend,
        language: currentLanguage,
        code: currentCode,
        context: currentLessonTitle,
      };

      if (customMode === 'hint') {
        endpoint = '/api/ai/hint';
        payload = {
          problemTitle: currentLessonTitle || 'Practice Problem',
          problemDescription: textToSend,
          userCode: currentCode,
          language: currentLanguage,
        };
      } else if (customMode === 'debug') {
        endpoint = '/api/ai/debug';
        payload = {
          code: currentCode,
          language: currentLanguage,
          errorOutput: currentError || textToSend,
          problemDescription: currentLessonTitle,
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const aiText = data.reply || data.hint || data.analysis || 'I am ready to help you continue!';
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: 'I am reviewing your code. Make sure you check variable initialization and syntax rules!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Great attempt! Keep experimenting and testing your code step by step.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string, mode?: 'explain' | 'hint' | 'debug') => {
    sendMessage(prompt, mode);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100">Codify AI Tutor</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Socratic guidance & hints</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() => handleQuickPrompt('Explain this concept in simple terms', 'explain')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Explain Concept</span>
        </button>
        <button
          onClick={() => handleQuickPrompt('Can you give me a small hint for this problem?', 'hint')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors"
        >
          <HelpCircle className="w-3 h-3 text-indigo-400" />
          <span>Get Hint</span>
        </button>
        <button
          onClick={() => handleQuickPrompt('Why is my code producing an error or failing tests?', 'debug')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          <span>Debug Error</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/50">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isAI
                    ? 'bg-slate-800 text-slate-200 border border-slate-700/60'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    isAI ? 'text-slate-500' : 'text-indigo-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI Tutor is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or request a hint..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
