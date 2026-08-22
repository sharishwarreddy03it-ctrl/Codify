import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lesson, Language, ExecutionResult } from '../../types';
import { CodeEditor } from '../common/CodeEditor';
import { ConsoleOutput } from '../common/ConsoleOutput';
import { triggerConfetti } from '../common/ConfettiEffect';
import { executeCode, runTestCases } from '../../lib/codeRunner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Bot,
  Play,
  RotateCcw,
  BookOpen,
  Check,
  X,
  Zap,
  Clock,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
  onBack: () => void;
  onNextLesson?: () => void;
  onOpenAITutor: () => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  onBack,
  onNextLesson,
  onOpenAITutor,
}) => {
  const { completeLesson, progress } = useAuth();
  const isLessonAlreadyCompleted = progress[lesson.language].completedLessons.includes(lesson.id);

  // Active section tab: 'concept' | 'interactive' | 'quiz' | 'practice'
  const [activeTab, setActiveTab] = useState<'concept' | 'interactive' | 'quiz' | 'practice'>('concept');

  // Interactive Example State
  const [exampleCodes, setExampleCodes] = useState<Record<string, string>>({});
  const [exampleResults, setExampleResults] = useState<Record<string, ExecutionResult | null>>({});
  const [runningExampleId, setRunningExampleId] = useState<string | null>(null);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);

  // Practice Exercise State
  const [practiceCode, setPracticeCode] = useState(lesson.practiceExercise?.initialCode || '');
  const [practiceResult, setPracticeResult] = useState<ExecutionResult | null>(null);
  const [isEvaluatingPractice, setIsEvaluatingPractice] = useState(false);
  const [practicePassed, setPracticePassed] = useState(false);

  // Initialise example codes
  useEffect(() => {
    const initialMap: Record<string, string> = {};
    lesson.interactiveExamples.forEach((ex) => {
      initialMap[ex.id] = ex.initialCode;
    });
    setExampleCodes(initialMap);
    setExampleResults({});
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScorePercent(null);
    setPracticeCode(lesson.practiceExercise?.initialCode || '');
    setPracticeResult(null);
    setPracticePassed(false);
  }, [lesson.id]);

  const handleRunExample = async (exampleId: string) => {
    const code = exampleCodes[exampleId];
    if (!code) return;
    setRunningExampleId(exampleId);
    try {
      const result = await executeCode(lesson.language, code);
      setExampleResults((prev) => ({ ...prev, [exampleId]: result }));
    } catch (e) {
      console.warn('Execution error:', e);
    } finally {
      setRunningExampleId(null);
    }
  };

  const handleResetExample = (exampleId: string) => {
    const ex = lesson.interactiveExamples.find((e) => e.id === exampleId);
    if (ex) {
      setExampleCodes((prev) => ({ ...prev, [exampleId]: ex.initialCode }));
      setExampleResults((prev) => ({ ...prev, [exampleId]: null }));
    }
  };

  const handleSelectQuizOption = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    lesson.quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerId) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / lesson.quizQuestions.length) * 100);
    setQuizScorePercent(percent);
    setQuizSubmitted(true);

    if (percent >= 70) {
      triggerConfetti();
      completeLesson(lesson.language, lesson.id, percent);
    }
  };

  const handleRunPractice = async () => {
    if (!lesson.practiceExercise) return;
    setIsEvaluatingPractice(true);
    try {
      const result = await runTestCases(
        lesson.language,
        practiceCode,
        lesson.practiceExercise.testCases
      );
      setPracticeResult(result);
      if (result.allPassed) {
        setPracticePassed(true);
        triggerConfetti();
        completeLesson(lesson.language, lesson.id, 100);
      }
    } catch (e) {
      console.warn('Practice run error:', e);
    } finally {
      setIsEvaluatingPractice(false);
    }
  };

  const handleMarkComplete = () => {
    triggerConfetti();
    completeLesson(lesson.language, lesson.id, 100);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask AI Tutor</span>
          </button>

          {isLessonAlreadyCompleted ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lesson Mastered</span>
            </span>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Complete & +{lesson.xpReward} XP</span>
            </button>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono">
          <span className="uppercase text-indigo-400">{lesson.language}</span>
          <span>•</span>
          <span>{lesson.topicTitle}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{lesson.estimatedMinutes} Mins</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{lesson.title}</h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{lesson.summary}</p>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'concept'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Concept & Theory</span>
        </button>

        <button
          onClick={() => setActiveTab('interactive')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'interactive'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>2. Interactive Code ({lesson.interactiveExamples.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>3. Mini Quiz ({lesson.quizQuestions.length})</span>
        </button>

        {lesson.practiceExercise && (
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'practice'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4. Practice Exercise</span>
          </button>
        )}
      </div>

      {/* TAB 1: Concept & Theory */}
      {activeTab === 'concept' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 text-sm leading-relaxed space-y-4">
            <div className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 whitespace-pre-wrap font-sans">
              {lesson.conceptContent}
            </div>
          </div>

          {/* Key Takeaways Card */}
          <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Core Takeaways</span>
            </div>
            <div className="space-y-2">
              {lesson.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step to Next Tab */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('interactive')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <span>Try Interactive Examples</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Runnable Code Examples */}
      {activeTab === 'interactive' && (
        <div className="space-y-8">
          {lesson.interactiveExamples.map((example, idx) => (
            <div
              key={example.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                    Example #{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{example.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{example.description}</p>
                </div>
              </div>

              {/* Code Editor */}
              <CodeEditor
                language={lesson.language}
                code={exampleCodes[example.id] || example.initialCode}
                onChange={(newCode) =>
                  setExampleCodes((prev) => ({ ...prev, [example.id]: newCode }))
                }
                onRun={() => handleRunExample(example.id)}
                onReset={() => handleResetExample(example.id)}
                isRunning={runningExampleId === example.id}
                height="240px"
              />

              {/* Console Output */}
              <ConsoleOutput
                result={exampleResults[example.id] || null}
                isRunning={runningExampleId === example.id}
              />

              {/* Explanation Note */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <strong className="text-indigo-300">How it works: </strong>
                {example.explanation}
              </div>
            </div>
          ))}

          {/* Stepper to Quiz */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('concept')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
            >
              Back to Concept
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <span>Proceed to Mini Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Mini Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-1">Knowledge Check</h3>
            <p className="text-xs text-slate-400">
              Answer the questions below to verify your comprehension and earn quiz XP.
            </p>
          </div>

          <div className="space-y-5">
            {lesson.quizQuestions.map((q, qIndex) => {
              const selectedOption = selectedAnswers[q.id];
              const isAnswered = !!selectedOption;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-100 flex items-start gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </h4>
                  </div>

                  {/* Code snippet in question if present */}
                  {q.codeSnippet && (
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre>{q.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const isCorrect = opt.id === q.correctAnswerId;

                      let btnStyle =
                        'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-indigo-500/40';
                      if (isSelected) {
                        btnStyle = 'bg-indigo-900/30 border-indigo-500 text-white';
                      }

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectQuizOption(q.id, opt.id)}
                          className={`w-full p-3.5 rounded-2xl border text-xs font-medium text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {quizSubmitted && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-indigo-400">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Quiz or Score Results */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {quizSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
                  {quizScorePercent}%
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {quizScorePercent! >= 70 ? '🎉 Great Job! Quiz Passed!' : 'Review the concept and try again!'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {quizScorePercent! >= 70 ? 'You earned lesson XP points.' : 'Passing threshold is 70%.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Answer all questions above to submit and lock in your score.
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < lesson.quizQuestions.length}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Retry Quiz
                </button>
              )}

              {lesson.practiceExercise && (
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Practice Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Practice Exercise */}
      {activeTab === 'practice' && lesson.practiceExercise && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                Hands-On Practice
              </span>
              <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>+{lesson.practiceExercise.xpReward} XP</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{lesson.practiceExercise.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lesson.practiceExercise.instruction}
            </p>
          </div>

          {/* Exercise Code Editor */}
          <CodeEditor
            language={lesson.language}
            code={practiceCode}
            onChange={setPracticeCode}
            onRun={handleRunPractice}
            onSubmit={handleRunPractice}
            isRunning={isEvaluatingPractice}
            height="320px"
          />

          {/* Test Case Evaluation Results */}
          <ConsoleOutput result={practiceResult} isRunning={isEvaluatingPractice} />

          {practicePassed && (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Exercise completed successfully! You unlocked full lesson XP.</span>
              </div>
              {onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
