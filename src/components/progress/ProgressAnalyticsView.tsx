import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LESSONS } from '../../data/courses';
import { CHALLENGES } from '../../data/challenges';
import { ACHIEVEMENTS, calculateLevel } from '../../data/achievements';
import {
  BarChart3,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Trophy,
  Terminal,
  Cpu,
  Coffee,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Language } from '../../types';

export const ProgressAnalyticsView: React.FC = () => {
  const { user, progress, unlockedAchievements } = useAuth();
  const levelInfo = user ? calculateLevel(user.xp) : { level: 1, currentLevelXp: 0, nextLevelXp: 200, progressPercent: 0 };

  const getLangStats = (lang: Language) => {
    const totalLessons = LESSONS.filter((l) => l.language === lang).length;
    const completedLessons = progress[lang].completedLessons.length;
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const quizScores: number[] = (Object.values(progress[lang].quizScores || {}) as number[]);
    const quizAvg =
      quizScores.length > 0
        ? Math.round(quizScores.reduce((a: number, b: number) => a + Number(b), 0) / quizScores.length)
        : 100;

    const challengesSolved = Object.keys(progress[lang].challengeScores).length;

    return { totalLessons, completedLessons, percent, quizAvg, challengesSolved };
  };

  const pyStats = getLangStats('python');
  const cStats = getLangStats('c');
  const javaStats = getLangStats('java');

  const totalLessonsMastered =
    pyStats.completedLessons + cStats.completedLessons + javaStats.completedLessons;
  const totalAllLessons = LESSONS.length;
  const totalChallengesSolved =
    pyStats.challengesSolved + cStats.challengesSolved + javaStats.challengesSolved;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Learning Analytics & Gamification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Progress & Mastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Detailed breakdown of lessons completed, quiz accuracy, coding challenges, and unlocked badges.
          </p>
        </div>

        {/* Level Box */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-600/30">
            {levelInfo.level}
          </div>
          <div>
            <div className="text-xs font-bold text-purple-300">Level {levelInfo.level} Scholar</div>
            <div className="text-base font-extrabold text-white">{user?.xp || 0} Total XP</div>
            <div className="w-28 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-xs font-semibold text-slate-400">Daily Streak</div>
          </div>
          <div className="text-2xl font-bold text-white">{user?.streak || 1} Days Active</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-400">Lessons Finished</div>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalLessonsMastered} / {totalAllLessons}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-400">Challenges Solved</div>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalChallengesSolved} / {CHALLENGES.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-400">Badges Unlocked</div>
          </div>
          <div className="text-2xl font-bold text-white">
            {Object.keys(unlockedAchievements).length} / {ACHIEVEMENTS.length}
          </div>
        </div>
      </div>

      {/* Language Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Python */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Python 3</h3>
                <span className="text-xs text-slate-400">Dynamic & Scripting</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-yellow-400">{pyStats.percent}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${pyStats.percent}%` }} />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Completed Lessons:</span>
              <span className="font-bold">{pyStats.completedLessons} / {pyStats.totalLessons}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Quiz Score:</span>
              <span className="font-bold text-emerald-400">{pyStats.quizAvg}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Practice Problems:</span>
              <span className="font-bold">{pyStats.challengesSolved} Solved</span>
            </div>
          </div>
        </div>

        {/* C Language */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">C Programming</h3>
                <span className="text-xs text-slate-400">Systems & Memory</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-blue-400">{cStats.percent}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${cStats.percent}%` }} />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Completed Lessons:</span>
              <span className="font-bold">{cStats.completedLessons} / {cStats.totalLessons}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Quiz Score:</span>
              <span className="font-bold text-emerald-400">{cStats.quizAvg}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Practice Problems:</span>
              <span className="font-bold">{cStats.challengesSolved} Solved</span>
            </div>
          </div>
        </div>

        {/* Java */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Java Core</h3>
                <span className="text-xs text-slate-400">OOP & Enterprise</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-orange-400">{javaStats.percent}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-orange-400 h-full rounded-full" style={{ width: `${javaStats.percent}%` }} />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Completed Lessons:</span>
              <span className="font-bold">{javaStats.completedLessons} / {javaStats.totalLessons}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Quiz Score:</span>
              <span className="font-bold text-emerald-400">{javaStats.quizAvg}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Practice Problems:</span>
              <span className="font-bold">{javaStats.challengesSolved} Solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Gamification Badges</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock badges by mastering lessons, maintaining streaks, and solving challenges.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-400">
            {Object.keys(unlockedAchievements).length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = !!unlockedAchievements[ach.id];
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{ach.icon}</div>
                <div className="font-bold text-xs text-slate-200 mb-1">{ach.title}</div>
                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                  {ach.description}
                </p>
                <span
                  className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isUnlocked ? 'Unlocked' : `+${ach.xpReward} XP`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
