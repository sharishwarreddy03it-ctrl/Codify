import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculateLevel } from '../../data/achievements';
import {
  LayoutDashboard,
  PlaySquare,
  Trophy,
  BarChart3,
  User,
  Sparkles,
  ChevronRight,
  Code2,
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'python'
  | 'c'
  | 'java'
  | 'hands-on'
  | 'practice'
  | 'progress'
  | 'profile';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const levelInfo = user ? calculateLevel(user.xp) : null;

  const handleTabClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-[#111827] border-r border-slate-800 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Brand Logo Header */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <span className="font-bold text-xl">C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Codify
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-1 mt-4">
            {/* Dashboard Link */}
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            {/* Section: Curriculum */}
            <div className="pt-5 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Curriculum
            </div>

            {/* Python Track */}
            <button
              onClick={() => handleTabClick('python')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'python'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-mono font-bold text-yellow-500">Py</span>
                <span>Python</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">v3.12</span>
            </button>

            {/* C Language Track */}
            <button
              onClick={() => handleTabClick('c')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'c'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-mono font-bold text-blue-400">C</span>
                <span>C Language</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">C17</span>
            </button>

            {/* Java Core Track */}
            <button
              onClick={() => handleTabClick('java')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'java'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-mono font-bold text-red-400">Jv</span>
                <span>Java Core</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">JDK21</span>
            </button>

            {/* Section: Tools & Practice */}
            <div className="pt-5 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tools & Practice
            </div>

            {/* Hands-On Training */}
            <button
              onClick={() => handleTabClick('hands-on')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'hands-on'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlaySquare className="w-5 h-5" />
              <span>Training IDE</span>
            </button>

            {/* Challenges */}
            <button
              onClick={() => handleTabClick('practice')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'practice'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>Challenges</span>
            </button>

            {/* Analytics */}
            <button
              onClick={() => handleTabClick('progress')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* User Account Footer Card in Sidebar */}
        <div className="p-4 mt-auto border-t border-slate-800">
          {user ? (
            <div
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-3 p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AS'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-white">{user.displayName || 'Alex Sterling'}</p>
                <p className="text-[10px] text-slate-400">
                  Level {levelInfo?.level || 1} • {user.streak || 1}d Streak
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleTabClick('profile')}
              className="w-full py-2 px-3 text-xs font-semibold text-indigo-400 border border-indigo-400/20 rounded-lg hover:bg-indigo-400/5 transition-colors text-center"
            >
              Sign In to Account
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
