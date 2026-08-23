import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Coffee,
  CheckCircle2,
  Play,
  Flame,
  Trophy,
  Bot,
  Zap,
  BookOpen,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../../types';

interface LandingPageProps {
  onStartLearning: (lang?: Language) => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onOpenLogin,
  onOpenSignup,
}) => {
  const [activeHeroLang, setActiveHeroLang] = useState<Language>('python');
  const [heroOutput, setHeroOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const heroCodeSnippets: Record<Language, { code: string; output: string }> = {
    python: {
      code: `# Welcome to Python on Codify!
def calculate_mastery(lessons_completed, quiz_score):
    xp = (lessons_completed * 50) + (quiz_score * 2)
    return f"Mastery XP: {xp} | Level: 3 (Intermediate)"

print(calculate_mastery(lessons_completed=8, quiz_score=95))
print(">> Ready to write Pythonic code!")`,
      output: `Mastery XP: 590 | Level: 3 (Intermediate)\n>> Ready to write Pythonic code!`,
    },
    c: {
      code: `// C Programming: Low-level power & memory
#include <stdio.h>

int main() {
    int score = 100;
    int *ptr = &score;
    
    printf("Pointer address: %p\\n", (void*)ptr);
    printf("Direct memory dereference: %d\\n", *ptr);
    printf(">> C Fundamentals Mastered!\\n");
    return 0;
}`,
      output: `Pointer address: 0x7ffd9a32c040\nDirect memory dereference: 100\n>> C Fundamentals Mastered!`,
    },
    java: {
      code: `// Object-Oriented Java with Streams
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> skills = Arrays.asList("OOP", "Streams", "Threads", "JVM");
        System.out.println("Codify Java Engineer ready with:");
        skills.forEach(s -> System.out.println(" • " + s));
    }
}`,
      output: `Codify Java Engineer ready with:\n • OOP\n • Streams\n • Threads\n • JVM`,
    },
  };

  const handleRunHero = () => {
    setIsRunning(true);
    setHeroOutput(null);
    setTimeout(() => {
      setHeroOutput(heroCodeSnippets[activeHeroLang].output);
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Landing Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Codify
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The Modern Interactive Coding Academy</span>
          </div>

          {/* Slogan */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Learn. Code. Practice.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Master.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            All-in-one educational platform with structured interactive lessons, runnable sandboxes, automated challenge grading, and an AI mentor for{' '}
            <strong className="text-slate-200">Python, C, and Java</strong>.
          </p>

          {/* Interactive Live Sandbox Trial in Hero */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-6 text-left backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                {(['python', 'c', 'java'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setActiveHeroLang(lang);
                      setHeroOutput(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 capitalize ${
                      activeHeroLang === lang
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'python' ? (
                      <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                    ) : lang === 'c' ? (
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Coffee className="w-3.5 h-3.5 text-orange-400" />
                    )}
                    <span>{lang}</span>
                  </button>
                ))}
              </div>

              {/* Run Trigger */}
              <button
                onClick={handleRunHero}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isRunning ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>Run Interactive Sample</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="leading-relaxed whitespace-pre-wrap">
                {heroCodeSnippets[activeHeroLang].code}
              </pre>
            </div>

            {/* Console Output */}
            {heroOutput && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 font-mono text-xs text-emerald-300">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Standard Output:</div>
                <pre className="whitespace-pre-wrap">{heroOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Language Course Cards */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Three Powerful Programming Languages
            </h2>
            <p className="text-slate-400 text-sm">
              From absolute beginner fundamentals to advanced memory management, concurrency, and OOP architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Python Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mb-4">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Python 3</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Clean syntax, data structures, list comprehensions, OOP, decorators, and algorithms.
                </p>
                <div className="space-y-2 mb-6">
                  {['Beginner: Variables, Logic, Loops', 'Intermediate: Collections, OOP', 'Advanced: Asyncio, Decorators'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onOpenSignup}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Start Python Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* C Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">C Language</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Systems programming, raw pointer arithmetic, dynamic memory malloc/free, and custom structs.
                </p>
                <div className="space-y-2 mb-6">
                  {['Beginner: Syntax, printf, functions', 'Intermediate: Pointers, Arrays, Structs', 'Advanced: Linked Lists, Bitwise'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onOpenSignup}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Start C Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Java Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Java Core & Advanced</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Write Once Run Anywhere: OOP hierarchies, Collections framework, Lambdas, and Streams API.
                </p>
                <div className="space-y-2 mb-6">
                  {['Beginner: JVM, Classes, Control flow', 'Intermediate: Inheritance, Interfaces', 'Advanced: Streams, Multithreading'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onOpenSignup}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Start Java Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">AI Socratic Mentor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive progressive hints and debug assistance without spoiling direct code solutions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Daily Streaks & XP</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stay motivated with reward points, achievement badges, and level advancement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Hands-On IDE</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Execute code directly in an isolated browser environment with instant console feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Challenge Suite</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated test cases and test runner across algorithms, data structures, and interview problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">Codify Interactive Education</span>
          </div>
          <div>Empowering next-generation software engineers worldwide.</div>
        </div>
      </footer>
    </div>
  );
};
