import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculateLevel } from '../../data/achievements';
import {
  Flame,
  Zap,
  Sparkles,
  User,
  LogOut,
  LogIn,
  Bot,
  X,
  Code2,
} from 'lucide-react';
import { Language } from '../../types';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAITutor: () => void;
  activeLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenAITutor,
  activeLanguage = 'python',
  onSelectLanguage,
  title = 'Student Dashboard',
}) => {
  const { user, logout, recentNotification, clearNotification } = useAuth();
  const levelInfo = user ? calculateLevel(user.xp) : null;

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-30 text-slate-100">
      {/* Dynamic View Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-white">{title}</h1>
      </div>

      {/* Right Section: Stats & Controls */}
      <div className="flex items-center gap-3 sm:gap-6">
        {user ? (
          <>
            {/* Daily Streak Pill */}
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="text-orange-500 text-sm">🔥</span>
              <span className="text-sm font-bold text-slate-100">{user.streak || 1} Days</span>
            </div>

            {/* XP Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="text-indigo-400 text-sm">💎</span>
              <span className="text-sm font-bold text-slate-100">{user.xp.toLocaleString()} XP</span>
            </div>

            {/* AI Tutor Assistant Quick Launcher */}
            <button
              onClick={onOpenAITutor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">AI Tutor</span>
            </button>

            {/* User Dropdown / Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
