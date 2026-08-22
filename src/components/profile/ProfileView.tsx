import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ACHIEVEMENTS, calculateLevel } from '../../data/achievements';
import { LESSONS } from '../../data/courses';
import {
  User,
  Mail,
  Calendar,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  Download,
  KeyRound,
  LogOut,
  Sparkles,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenAuthModal: (mode: 'signin' | 'signup' | 'forgot') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAuthModal }) => {
  const { user, progress, unlockedAchievements, logout, resetPassword } = useAuth();
  const [resetSent, setResetSent] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  if (!user) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl max-w-md mx-auto my-12">
        <User className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Student Profile</h2>
        <p className="text-xs text-slate-400 mb-6">
          Sign in to view your learning records, achievements, and certificate credentials.
        </p>
        <button
          onClick={() => onOpenAuthModal('signin')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const levelInfo = calculateLevel(user.xp);
  const totalCompletedLessons =
    progress.python.completedLessons.length +
    progress.c.completedLessons.length +
    progress.java.completedLessons.length;

  const handlePasswordReset = async () => {
    try {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (e) {
      alert('Unable to send password reset email. Please try again.');
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-indigo-600/30 shrink-0">
          {user.displayName.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white">{user.displayName}</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Level {levelInfo.level} Scholar
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCertificate(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Certificate</span>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/30 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-2xl font-bold text-white">{user.xp}</div>
          <div className="text-xs text-slate-400 mt-0.5">Total XP Points</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-2xl font-bold text-amber-400">{user.streak} Days</div>
          <div className="text-xs text-slate-400 mt-0.5">Daily Streak</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-2xl font-bold text-emerald-400">{totalCompletedLessons}</div>
          <div className="text-xs text-slate-400 mt-0.5">Lessons Completed</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-2xl font-bold text-purple-400">{unlockedAchievements.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Badges Earned</div>
        </div>
      </div>

      {/* Account Settings & Security */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>Security & Account Credentials</span>
        </h2>
        <p className="text-xs text-slate-400">
          Your account is secured via Firebase Authentication with encrypted identity tokens.
        </p>

        {resetSent && (
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Password reset instructions sent to {user.email}!</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handlePasswordReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-slate-400" />
            <span>Send Password Reset Email</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-950 border-4 border-amber-500/40 rounded-3xl p-8 text-center text-slate-100 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>

            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-widest font-mono text-amber-400 font-bold">
                Certificate of Technical Accomplishment
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
                Codify Interactive Academy
              </h2>
            </div>

            <p className="text-xs text-slate-400">This officially certifies that</p>
            <div className="text-2xl font-extrabold text-indigo-300 underline decoration-indigo-500 underline-offset-8">
              {user.displayName}
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              has completed rigorous interactive coursework in <strong className="text-white">Python, C, and Java</strong>, demonstrating proficiency in data structures, algorithms, memory management, and software architecture.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <div>XP: {user.xp}</div>
              <div>Level: {levelInfo.level}</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
