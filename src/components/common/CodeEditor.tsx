import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle2, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { Language } from '../../types';

interface CodeEditorProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onReset?: () => void;
  onSubmit?: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  height?: string;
  readOnly?: boolean;
  showActionButtons?: boolean;
  title?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
  onRun,
  onReset,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  height = '360px',
  readOnly = false,
  showActionButtons = true,
  title,
}) => {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Map our language names to Monaco editor language ids
  const monacoLanguageMap: Record<Language, string> = {
    python: 'python',
    c: 'c',
    java: 'java',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            {title || `main.${language === 'python' ? 'py' : language === 'c' ? 'c' : 'java'}`}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-sans uppercase">
            {language}
          </span>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
              title="Reset to Starter Code"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative w-full" style={{ height }}>
        <Editor
          height="100%"
          language={monacoLanguageMap[language] || 'plaintext'}
          theme={theme}
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            tabSize: 4,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            wordWrap: 'on',
          }}
          loading={
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 text-xs">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
              <span>Loading Monaco Editor...</span>
            </div>
          }
        />
      </div>

      {/* Editor Action Buttons Footer */}
      {showActionButtons && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            {language === 'python' ? 'Python 3.x' : language === 'c' ? 'GCC C11' : 'OpenJDK 17'}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {onRun && (
              <button
                onClick={onRun}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isRunning ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                )}
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            )}

            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                )}
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
