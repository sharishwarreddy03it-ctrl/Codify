import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, AlertTriangle, Trash2, Cpu } from 'lucide-react';
import { ExecutionResult, TestCase } from '../../types';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
  onClear?: () => void;
  customInput?: string;
  onCustomInputChange?: (val: string) => void;
  showInputTab?: boolean;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  isRunning = false,
  onClear,
  customInput = '',
  onCustomInputChange,
  showInputTab = false,
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'tests' | 'stdin'>('output');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);

  const hasTestResults = !!(result?.testResults && result.testResults.length > 0);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl font-mono text-xs text-slate-200">
      {/* Console Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'output'
                ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console Output</span>
          </button>

          {hasTestResults && (
            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'tests'
                  ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {result.allPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>
                Test Cases ({result.testResults?.filter((t) => t.passed).length}/
                {result.testResults?.length})
              </span>
            </button>
          )}

          {showInputTab && onCustomInputChange && (
            <button
              onClick={() => setActiveTab('stdin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'stdin'
                  ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Standard Input</span>
            </button>
          )}
        </div>

        {/* Execution Time & Clear button */}
        <div className="flex items-center gap-3">
          {result && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{result.executionTimeMs}ms</span>
            </div>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
              title="Clear Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Console Body */}
      <div className="p-4 min-h-[160px] max-h-[280px] overflow-y-auto bg-slate-950 font-mono text-xs">
        {isRunning ? (
          <div className="flex items-center gap-2 text-indigo-400 py-4">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Compiling and executing code in sandbox...</span>
          </div>
        ) : activeTab === 'output' ? (
          <div>
            {result?.error ? (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 space-y-1 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Execution Error:</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[11px]">{result.error}</pre>
              </div>
            ) : null}

            {result?.output ? (
              <pre className="whitespace-pre-wrap text-emerald-300/90 leading-relaxed">
                {result.output}
              </pre>
            ) : !result?.error ? (
              <div className="text-slate-500 italic py-6 text-center">
                Click "Run Code" to execute program and view console output.
              </div>
            ) : null}
          </div>
        ) : activeTab === 'tests' && hasTestResults ? (
          <div className="space-y-3">
            {/* Test Case Pills */}
            <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-slate-800">
              {result.testResults?.map((tc, idx) => (
                <button
                  key={tc.testCaseId || idx}
                  onClick={() => setSelectedTestCaseIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedTestCaseIndex === idx
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tc.passed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-rose-400" />
                  )}
                  <span>Case {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Selected Test Detail */}
            {result.testResults && result.testResults[selectedTestCaseIndex] && (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-sans">Input:</span>
                  <pre className="mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    {result.testResults[selectedTestCaseIndex].input || '(No input)'}
                  </pre>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 font-sans">Expected Output:</span>
                    <pre className="mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                      {result.testResults[selectedTestCaseIndex].expected}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Actual Output:</span>
                    <pre
                      className={`mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 ${
                        result.testResults[selectedTestCaseIndex].passed
                          ? 'text-emerald-300'
                          : 'text-rose-400'
                      }`}
                    >
                      {result.testResults[selectedTestCaseIndex].actual || '(Empty output)'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'stdin' && onCustomInputChange ? (
          <div>
            <label className="block text-slate-400 text-xs font-sans mb-1">
              Provide input passed to standard input (stdin):
            </label>
            <textarea
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="Enter standard input values here (one per line)..."
              className="w-full h-24 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-indigo-500 font-mono text-xs resize-none"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
