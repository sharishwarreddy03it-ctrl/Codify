import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LESSONS, TOPICS } from '../../data/courses';
import { Language, Level } from '../../types';
import {
  Terminal,
  Cpu,
  Coffee,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Zap,
  Sparkles,
  HelpCircle,
  Play,
  Layers,
  Code,
} from 'lucide-react';

interface LanguageLearningViewProps {
  language: Language;
  onOpenLesson: (lessonId: string) => void;
  onOpenSandbox: (lang: Language) => void;
}

export const LanguageLearningView: React.FC<LanguageLearningViewProps> = ({
  language,
  onOpenLesson,
  onOpenSandbox,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>('beginner');
  const { progress } = useAuth();

  const langConfig = {
    python: {
      name: 'Python 3',
      description: 'Master readable, high-level programming for data, web, and automation.',
      icon: Terminal,
      color: 'yellow',
      borderColor: 'border-yellow-500/30',
      badgeBg: 'bg-yellow-500/10 text-yellow-400',
    },
    c: {
      name: 'C Programming',
      description: 'Understand low-level memory, pointers, hardware performance, and structures.',
      icon: Cpu,
      color: 'blue',
      borderColor: 'border-blue-500/30',
      badgeBg: 'bg-blue-500/10 text-blue-400',
    },
    java: {
      name: 'Java Development',
      description: 'Enterprise object-oriented programming, JVM architecture, Streams & Collections.',
      icon: Coffee,
      color: 'orange',
      borderColor: 'border-orange-500/30',
      badgeBg: 'bg-orange-500/10 text-orange-400',
    },
  }[language];

  const IconComponent = langConfig.icon;
  const currentLangProgress = progress[language];

  // Filter topics for this language and level
  const levelTopics = TOPICS.filter(
    (t) => t.language === language && t.level === selectedLevel
  );

  // Filter all lessons for this language and level
  const levelLessons = LESSONS.filter(
    (l) => l.language === language && l.level === selectedLevel
  );

  const completedInLevel = levelLessons.filter((l) =>
    currentLangProgress.completedLessons.includes(l.id)
  ).length;
  const totalInLevel = levelLessons.length;
  const levelPercent = totalInLevel > 0 ? Math.round((completedInLevel / totalInLevel) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${langConfig.badgeBg} border ${langConfig.borderColor} flex items-center justify-center shrink-0 shadow-lg`}
            >
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Curriculum Track
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${langConfig.badgeBg}`}>
                  {currentLangProgress.completedLessons.length} Lessons Finished
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{langConfig.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                {langConfig.description}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenSandbox(language)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Open {langConfig.name} Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Level Tabs: Beginner, Intermediate, Advanced */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold">
        {(['beginner', 'intermediate', 'advanced'] as Level[]).map((lvl) => {
          const isActive = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`flex-1 py-3 px-4 rounded-xl capitalize transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{lvl} Level</span>
              {lvl === 'beginner' && <span className="text-[10px] opacity-75">★</span>}
              {lvl === 'intermediate' && <span className="text-[10px] opacity-75">★★</span>}
              {lvl === 'advanced' && <span className="text-[10px] opacity-75">★★★</span>}
            </button>
          );
        })}
      </div>

      {/* Level Summary & Progress */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-white capitalize">
            {selectedLevel} Level Progress
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {completedInLevel} of {totalInLevel} lessons completed ({levelPercent}%)
          </div>
        </div>
        <div className="w-32 sm:w-48 bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${levelPercent}%` }}
          />
        </div>
      </div>

      {/* Topics & Lessons List */}
      <div className="space-y-6">
        {levelTopics.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs">More {selectedLevel} topics are being scheduled for release!</p>
          </div>
        ) : (
          levelTopics.map((topic) => {
            const topicLessons = LESSONS.filter(
              (l) => l.topicId === topic.id || (l.language === language && l.level === selectedLevel)
            );

            return (
              <div
                key={topic.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-4"
              >
                {/* Topic Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{topic.title}</h3>
                      <p className="text-xs text-slate-400">{topic.description}</p>
                    </div>
                  </div>
                </div>

                {/* Lesson Grid / Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {topicLessons.map((lesson) => {
                    const isCompleted = currentLangProgress.completedLessons.includes(lesson.id);
                    const quizScore = currentLangProgress.quizScores[lesson.id];

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onOpenLesson(lesson.id)}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-950 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Lesson {lesson.order}
                            </span>
                            {isCompleted ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Completed</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
                                <Zap className="w-3 h-3" />
                                <span>+{lesson.xpReward} XP</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                            {lesson.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{lesson.estimatedMinutes}m</span>
                            </span>
                            {quizScore !== undefined && (
                              <span className="text-emerald-400 font-semibold">
                                Quiz: {quizScore}%
                              </span>
                            )}
                          </div>

                          <span className="font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            <span>{isCompleted ? 'Review' : 'Start'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
