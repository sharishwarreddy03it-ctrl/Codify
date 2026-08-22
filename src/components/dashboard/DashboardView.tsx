import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LESSONS } from '../../data/courses';
import { CHALLENGES } from '../../data/challenges';
import { ACHIEVEMENTS, calculateLevel } from '../../data/achievements';
import {
  Flame,
  Zap,
  Trophy,
  BookOpen,
  ArrowRight,
  Sparkles,
  Play,
  BarChart2,
  CheckCircle2,
  Terminal,
  Code2,
} from 'lucide-react';
import { Language } from '../../types';

interface DashboardViewProps {
  onSelectLanguage: (lang: Language) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenSandbox: (lang?: Language) => void;
  onOpenChallenges: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectLanguage,
  onOpenLesson,
  onOpenSandbox,
  onOpenChallenges,
}) => {
  const { user, progress, unlockedAchievements } = useAuth();
  const [activeCodeLang, setActiveCodeLang] = useState<'python' | 'c' | 'java'>('python');

  const levelInfo = user ? calculateLevel(user.xp) : { level: 1, currentLevelXp: 0, nextLevelXp: 200, progressPercent: 0 };

  // Calculate Language percentages
  const pyTotal = LESSONS.filter((l) => l.language === 'python').length;
  const pyCompleted = progress.python.completedLessons.length;
  const pyPercent = pyTotal > 0 ? Math.round((pyCompleted / pyTotal) * 100) : 0;

  const cTotal = LESSONS.filter((l) => l.language === 'c').length;
  const cCompleted = progress.c.completedLessons.length;
  const cPercent = cTotal > 0 ? Math.round((cCompleted / cTotal) * 100) : 0;

  const javaTotal = LESSONS.filter((l) => l.language === 'java').length;
  const javaCompleted = progress.java.completedLessons.length;
  const javaPercent = javaTotal > 0 ? Math.round((javaCompleted / javaTotal) * 100) : 0;

  // Find Recommended Next Lesson
  let nextLesson = LESSONS.find(
    (l) =>
      l.language === 'python' &&
      !progress.python.completedLessons.includes(l.id)
  );
  if (!nextLesson) {
    nextLesson = LESSONS.find(
      (l) =>
        l.language === 'c' &&
        !progress.c.completedLessons.includes(l.id)
    );
  }
  if (!nextLesson) {
    nextLesson = LESSONS.find(
      (l) =>
        l.language === 'java' &&
        !progress.java.completedLessons.includes(l.id)
    );
  }
  if (!nextLesson) {
    nextLesson = LESSONS[0];
  }

  // Sample weekly activity values for visualization
  const weeklyData = [
    { day: 'M', height: '40%', active: false },
    { day: 'T', height: '65%', active: false },
    { day: 'W', height: '95%', active: true },
    { day: 'T', height: '30%', active: false },
    { day: 'F', height: '55%', active: false },
    { day: 'S', height: '80%', active: true },
    { day: 'S', height: '45%', active: false },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 12-Column Grid matching Clean Minimalism layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Hero Banner */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-indigo-900/20 text-white">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.displayName || 'Alex'}!
              </h2>
              <p className="text-indigo-100/80 mb-6 max-w-md text-sm leading-relaxed">
                You're making great progress in your programming journey. Complete today's lesson to maintain your {user?.streak || 1}-day streak and unlock new skills.
              </p>
              {nextLesson && (
                <button
                  onClick={() => onOpenLesson(nextLesson!.id)}
                  className="bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Play className="w-4 h-4 fill-indigo-900 text-indigo-900" />
                  <span>Continue: {nextLesson.title}</span>
                </button>
              )}
            </div>
            {/* Background vector watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
              <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Curriculum Progress 3-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Python Card */}
            <div
              onClick={() => onSelectLanguage('python')}
              className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400 font-semibold uppercase">Python</p>
                <span className="text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">Py</span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-white">{pyPercent}%</span>
                <span className="text-xs text-indigo-400 font-medium">{pyCompleted}/{pyTotal} Topics</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${pyPercent}%` }}
                />
              </div>
            </div>

            {/* C Language Card */}
            <div
              onClick={() => onSelectLanguage('c')}
              className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400 font-semibold uppercase">C Language</p>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">C</span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-white">{cPercent}%</span>
                <span className="text-xs text-blue-400 font-medium">{cCompleted}/{cTotal} Topics</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${cPercent}%` }}
                />
              </div>
            </div>

            {/* Java Core Card */}
            <div
              onClick={() => onSelectLanguage('java')}
              className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400 font-semibold uppercase">Java Core</p>
                <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">Jv</span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-white">{javaPercent}%</span>
                <span className="text-xs text-red-400 font-medium">{javaCompleted}/{javaTotal} Topics</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${javaPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Code Preview Box */}
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 flex justify-between items-center">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">prime_checker.py</span>
              </div>
              <button
                onClick={() => onOpenSandbox('python')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Run in IDE</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300">
              <p><span className="text-purple-400">def</span> <span className="text-blue-400">is_prime</span>(n):</p>
              <p className="pl-4"><span className="text-purple-400">if</span> n &lt;= <span className="text-orange-400">1</span>: <span className="text-purple-400">return</span> <span className="text-orange-400">False</span></p>
              <p className="pl-4"><span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-blue-400">range</span>(<span className="text-orange-400">2</span>, <span className="text-blue-400">int</span>(n**<span className="text-orange-400">0.5</span>) + <span className="text-orange-400">1</span>):</p>
              <p className="pl-8"><span className="text-purple-400">if</span> n % i == <span className="text-orange-400">0</span>: <span className="text-purple-400">return</span> <span className="text-orange-400">False</span></p>
              <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-orange-400">True</span></p>
              <p className="mt-2 text-slate-500"># Sample verification</p>
              <p>print(<span className="text-emerald-300">f"Is 29 prime? &#123;is_prime(29)&#125;"</span>) <span className="text-slate-500"># Output: True</span></p>
            </div>
          </div>

          {/* Recommended Lessons List */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Curated Learning Path</span>
              </h3>
              <span className="text-xs text-slate-400">Sequential Mastery</span>
            </div>

            <div className="space-y-2.5">
              {LESSONS.slice(0, 4).map((lesson) => {
                const isCompleted =
                  progress[lesson.language].completedLessons.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => onOpenLesson(lesson.id)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓' : lesson.order}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {lesson.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="uppercase font-mono text-[10px] text-indigo-400">
                            {lesson.language}
                          </span>
                          <span>•</span>
                          <span>{lesson.estimatedMinutes} mins</span>
                          <span>•</span>
                          <span>+{lesson.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Stats & Achievements Column (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Activity Bar Chart Card */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
              </svg>
              <span>Weekly Activity</span>
            </h3>
            <div className="flex items-end justify-between h-32 gap-2 mt-4">
              {weeklyData.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-t-lg transition-all ${
                    item.active ? 'bg-indigo-500' : 'bg-slate-700/50'
                  }`}
                  style={{ height: item.height }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold font-mono">
              {weeklyData.map((item, idx) => (
                <span key={idx}>{item.day}</span>
              ))}
            </div>
          </div>

          {/* Achievements Badges Card */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl shrink-0">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">First Program</p>
                  <p className="text-[10px] text-slate-400">Completed HelloWorld.py</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Quick Solver</p>
                  <p className="text-[10px] text-slate-400">Challenge solved in &lt; 1 min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-40">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl shrink-0">
                  🔒
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Code Master</p>
                  <p className="text-[10px] text-slate-400">Finish any language path</p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenChallenges}
              className="w-full mt-6 py-2 text-xs font-semibold text-indigo-400 border border-indigo-400/20 rounded-lg hover:bg-indigo-400/5 transition-colors cursor-pointer"
            >
              View All Badges
            </button>
          </div>

          {/* Quick Practice Featured Card */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Practice Drills</h4>
              <span className="text-[10px] text-indigo-400 font-bold">+{CHALLENGES[0]?.xpReward || 50} XP</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {CHALLENGES[0]?.title || 'Two Sum Problem'}
            </p>
            <p className="text-[11px] text-slate-400">
              Solve the classic interview algorithm with test assertions.
            </p>
            <button
              onClick={onOpenChallenges}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md"
            >
              Start Drill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
