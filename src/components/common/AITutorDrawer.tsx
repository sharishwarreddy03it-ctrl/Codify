import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  HelpCircle,
  Bug,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Language } from "../../types";

interface Message {
  id: string;
  sender: "user" | "ai";
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

// --------------------------------------------------
// API URL
// --------------------------------------------------

// If VITE_API_URL exists, use it.
// Otherwise use the same server that serves the frontend.
//
// For your current Render setup, leaving this empty is correct
// because your frontend and backend are on the same Render service.
const API_BASE_URL = "";

export const AITutorDrawer: React.FC<
  AITutorDrawerProps
> = ({
  isOpen,
  onClose,
  currentLanguage = "python",
  currentCode = "",
  currentLessonTitle = "",
  currentError = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello! I am your **Codify AI Tutor**. I'm here to explain concepts, guide you with hints, and help you debug without spoiling the answers. How can I assist your ${currentLanguage} learning today?`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const addAIMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-ai`,
        sender: "ai",
        text,
        timestamp: getTimestamp(),
      },
    ]);
  };

  const sendMessage = async (
    textToSend: string,
    customMode?: "explain" | "hint" | "debug"
  ) => {
    if (!textToSend.trim() || isLoading) {
      return;
    }

    const userMessage = textToSend.trim();

    const userMsg: Message = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: userMessage,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      let endpoint = "/api/ai/ask";

      let payload: Record<string, unknown> = {
        question: userMessage,
        language: currentLanguage,
        code: currentCode,
        context: currentLessonTitle,
      };

      // -----------------------------
      // Hint
      // -----------------------------

      if (customMode === "hint") {
        endpoint = "/api/ai/hint";

        payload = {
          problemTitle:
            currentLessonTitle ||
            "Practice Problem",

          problemDescription: userMessage,

          userCode: currentCode,

          language: currentLanguage,

          testCases: [],
        };
      }

      // -----------------------------
      // Debug
      // -----------------------------

      if (customMode === "debug") {
        endpoint = "/api/ai/debug";

        payload = {
          code: currentCode,

          language: currentLanguage,

          errorOutput:
            currentError ||
            userMessage,

          problemDescription:
            currentLessonTitle ||
            "Not specified",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const serverError =
          data?.error ||
          `Server returned HTTP ${response.status}.`;

        throw new Error(serverError);
      }

      const aiText =
        data.reply ||
        data.hint ||
        data.analysis;

      if (!aiText) {
        throw new Error(
          "The AI server returned an empty response."
        );
      }

      addAIMessage(aiText);
    } catch (error: any) {
      console.error(
        "Codify AI Tutor error:",
        error
      );

      addAIMessage(
        `I'm having trouble connecting to the AI service right now.\n\n**Error:** ${
          error?.message ||
          "Unknown error"
        }\n\nPlease check that your Codify server is running and that your Gemini API key is configured on Render.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (
    prompt: string,
    mode?: "explain" | "hint" | "debug"
  ) => {
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
              <span className="font-bold text-sm text-slate-100">
                Codify AI Tutor
              </span>

              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                Online
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Socratic guidance & hints
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close AI Tutor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions */}

      <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() =>
            handleQuickPrompt(
              "Explain this concept in simple terms",
              "explain"
            )
          }
          disabled={isLoading}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Explain Concept</span>
        </button>

        <button
          onClick={() =>
            handleQuickPrompt(
              "Can you give me a small hint for this problem?",
              "hint"
            )
          }
          disabled={isLoading}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <HelpCircle className="w-3 h-3 text-indigo-400" />
          <span>Get Hint</span>
        </button>

        <button
          onClick={() =>
            handleQuickPrompt(
              "Why is my code producing an error or failing tests?",
              "debug"
            )
          }
          disabled={isLoading}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          <span>Debug Error</span>
        </button>
      </div>

      {/* Messages */}

      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/50">
        {messages.map((msg) => {
          const isAI =
            msg.sender === "ai";

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                isAI
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              {isAI && (
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isAI
                    ? "bg-slate-800 text-slate-200 border border-slate-700/60"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>

                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    isAI
                      ? "text-slate-500"
                      : "text-indigo-200"
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

            <span>
              AI Tutor is thinking...
            </span>
          </div>
        )}
      </div>

      {/* Input */}

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
            onChange={(e) =>
              setInput(e.target.value)
            }
            disabled={isLoading}
            placeholder="Ask a question or request a hint..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={
              !input.trim() ||
              isLoading
            }
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-md"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};