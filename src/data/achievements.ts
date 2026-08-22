import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-program',
    title: 'First Program',
    description: 'Execute your very first code snippet inside the Codify sandbox.',
    icon: 'PlayCircle',
    category: 'coding',
    xpReward: 50,
    threshold: 1,
  },
  {
    id: 'python-beginner',
    title: 'Python Beginner',
    description: 'Complete all Python beginner fundamentals lessons.',
    icon: 'Terminal',
    category: 'mastery',
    xpReward: 100,
    threshold: 3,
  },
  {
    id: 'c-fundamentals',
    title: 'C Fundamentals Mastered',
    description: 'Master memory pointers, structs, and compilation in C.',
    icon: 'Cpu',
    category: 'mastery',
    xpReward: 150,
    threshold: 3,
  },
  {
    id: 'java-explorer',
    title: 'Java Explorer',
    description: 'Build OOP classes and explore streams in Java.',
    icon: 'Coffee',
    category: 'mastery',
    xpReward: 150,
    threshold: 3,
  },
  {
    id: 'ten-lessons',
    title: '10 Lessons Completed',
    description: 'Finish 10 interactive lessons across any languages.',
    icon: 'BookOpen',
    category: 'learning',
    xpReward: 200,
    threshold: 10,
  },
  {
    id: 'seven-day-streak',
    title: '7-Day Learning Streak',
    description: 'Study for 7 consecutive days on Codify.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 300,
    threshold: 7,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Achieve a 100% score on 5 lesson mini-quizzes.',
    icon: 'Award',
    category: 'learning',
    xpReward: 120,
    threshold: 5,
  },
  {
    id: 'challenge-conqueror',
    title: 'Challenge Conqueror',
    description: 'Successfully submit solutions to 5 coding challenges.',
    icon: 'Trophy',
    category: 'coding',
    xpReward: 250,
    threshold: 5,
  },
];

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  // Level threshold formula: level n needs n * 200 XP
  // Total XP for level L = 100 * L * (L - 1)
  let level = 1;
  while (xp >= 100 * level * (level + 1)) {
    level++;
  }
  const baseForCurrent = 100 * (level - 1) * level;
  const baseForNext = 100 * level * (level + 1);
  const diff = baseForNext - baseForCurrent;
  const currentProgress = xp - baseForCurrent;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / diff) * 100)));

  return {
    level,
    currentLevelXp: currentProgress,
    nextLevelXp: diff,
    progressPercent,
  };
}
