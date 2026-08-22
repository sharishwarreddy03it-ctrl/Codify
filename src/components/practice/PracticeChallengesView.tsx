import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CHALLENGES } from '../../data/challenges';
import { Challenge, Language, ExecutionResult } from '../../types';
import { CodeEditor } from '../common/CodeEditor';
import { ConsoleOutput } from '../common/ConsoleOutput';
import { triggerConfetti } from '../common/ConfettiEffect';
import { runTestCases } from '../../lib/codeRunner';
import {
  Trophy,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Zap,
  HelpCircle,
  Clock,
  Sparkles,
  Bot,
  Lightbulb,
} from 'lucide-react';

interface PracticeChallengesViewProps {
  onOpenAITutor: () => void;
}

export const PracticeChallengesView: React.FC<PracticeChallengesViewProps> = ({
  onOpenAITutor,
}) => {
  const { progress, submitChallenge } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Filters
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Challenge Workspace State
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [showHintIndex, setShowHintIndex] = useState(0);

  const isCompleted = (ch: Challenge) => {
    return !!progress[ch.language]?.challengeScores?.[ch.id];
  };

  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setResult(null);
    setShowHintIndex(0);
  };

  const handleEvaluate = async () => {
    if (!selectedChallenge) return;
    setIsRunning(true);
    try {
      const res = await runTestCases(
        selectedChallenge.language,
        code,
        selectedChallenge.testCases
      );
      setResult(res);
      if (res.allPassed) {
        triggerConfetti();
        submitChallenge(selectedChallenge.language, selectedChallenge.id, 100);
      }
    } catch (err: any) {
      setResult({
        output: '',
        error: err.message || 'Execution error',
        executionTimeMs: 0,
        allPassed: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const filteredChallenges = CHALLENGES.filter((ch) => {
    if (filterLang !== 'all' && ch.language !== filterLang) return false;
    if (filterDifficulty !== 'all' && ch.difficulty.toLowerCase() !== filterDifficulty.toLowerCase())
      return false;
    if (
      searchQuery &&
      !ch.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ch.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* If a challenge is selected -> Render Workspace */}
      {selectedChallenge ? (
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Challenge Catalog</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAITutor}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask AI for Hint</span>
              </button>

              {isCompleted(selectedChallenge) && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solved (+{selectedChallenge.xpReward} XP)</span>
                </span>
              )}
            </div>
          </div>

          {/* Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Problem Specs & Hints (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-h-[600px] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      selectedChallenge.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : selectedChallenge.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {selectedChallenge.difficulty}
                  </span>
                  <span className="text-xs text-indigo-400 font-semibold font-mono uppercase">
                    {selectedChallenge.language} • +{selectedChallenge.xpReward} XP
                  </span>
                </div>

                <h1 className="text-xl font-bold text-white">{selectedChallenge.title}</h1>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedChallenge.description}
                </p>

                {/* Constraints */}
                {selectedChallenge.constraints && selectedChallenge.constraints.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="text-xs font-bold text-slate-400">Constraints:</div>
                    <ul className="text-xs text-slate-400 space-y-1 font-mono">
                      {selectedChallenge.constraints.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {selectedChallenge.examples && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="text-xs font-bold text-slate-400">Examples:</div>
                    {selectedChallenge.examples.map((ex, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                        <div>
                          <span className="text-slate-500 font-sans">Input: </span>
                          <span className="text-slate-300">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-sans">Output: </span>
                          <span className="text-emerald-400">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-400 text-[11px] font-sans pt-1">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hints Accordion */}
                {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Hints</span>
                    </div>
                    {selectedChallenge.hints.map((hint, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                        <strong>Hint {i + 1}: </strong>{hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code Editor & Test Cases (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <CodeEditor
                language={selectedChallenge.language}
                code={code}
                onChange={setCode}
                onRun={handleEvaluate}
                onSubmit={handleEvaluate}
                onReset={() => setCode(selectedChallenge.starterCode)}
                isRunning={isRunning}
                height="380px"
              />

              <ConsoleOutput result={result} isRunning={isRunning} />

              {result?.allPassed && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>All test cases passed! +{selectedChallenge.xpReward} XP awarded!</span>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                  >
                    Solve Another →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Catalog View */
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span>Coding Challenges & Problem Solving</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Practice Challenges Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Test your skills with automated test suites across algorithms, data structures, and interview questions.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search challenges by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Language:</span>
              <select
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium focus:outline-hidden"
              >
                <option value="all">All Languages</option>
                <option value="python">Python</option>
                <option value="c">C Language</option>
                <option value="java">Java</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Difficulty:</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium focus:outline-hidden"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Challenges List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((ch) => {
              const solved = isCompleted(ch);
              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch)}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          ch.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ch.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {ch.difficulty}
                      </span>

                      {solved ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-indigo-400 font-semibold font-mono">
                          +{ch.xpReward} XP
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ch.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="uppercase font-mono text-[10px] text-slate-400">
                      {ch.language} • {ch.category}
                    </span>
                    <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] group-hover:bg-indigo-500 transition-colors">
                      {solved ? 'Review' : 'Solve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
