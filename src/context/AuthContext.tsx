import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  fetchUserProfile,
  saveUserProfile,
  fetchUserProgress,
  saveUserProgress,
  fetchUserAchievements,
  unlockUserAchievement,
  getLocalFallbackUser,
} from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { UserProfile, LanguageProgress, Achievement, Language } from '../types';
import { ACHIEVEMENTS, calculateLevel } from '../data/achievements';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginDemoUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  gainXP: (amount: number, reason?: string) => Promise<void>;
  completeLesson: (language: Language, lessonId: string, quizScore?: number) => Promise<void>;
  completeChallenge: (language: Language, challengeId: string, score: number) => Promise<void>;
  progress: Record<Language, LanguageProgress>;
  unlockedAchievements: Record<string, { unlockedAt: string }>;
  recentNotification: string | null;
  clearNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const [progress, setProgress] = useState<Record<Language, LanguageProgress>>({
    python: {
      language: 'python',
      completedLessons: [],
      currentLessonId: 'py-intro',
      quizScores: {},
      challengeScores: {},
      updatedAt: new Date().toISOString(),
    },
    c: {
      language: 'c',
      completedLessons: [],
      currentLessonId: 'c-intro',
      quizScores: {},
      challengeScores: {},
      updatedAt: new Date().toISOString(),
    },
    java: {
      language: 'java',
      completedLessons: [],
      currentLessonId: 'java-intro',
      quizScores: {},
      challengeScores: {},
      updatedAt: new Date().toISOString(),
    },
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, { unlockedAt: string }>>({});

  const clearNotification = () => setRecentNotification(null);

  // Sync user profile & data
  const loadUserData = async (uid: string, email: string, name: string) => {
    try {
      let profile = await fetchUserProfile(uid);
      if (!profile) {
        profile = {
          uid,
          email,
          displayName: name || email.split('@')[0] || 'Codify Student',
          xp: 150,
          level: 1,
          streak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferredLanguage: 'python',
        };
        await saveUserProfile(profile);
      }

      // Check daily streak
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastActiveDate !== today) {
        const last = new Date(profile.lastActiveDate);
        const cur = new Date(today);
        const diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          profile.streak += 1;
        } else if (diffDays > 1) {
          profile.streak = 1;
        }
        profile.lastActiveDate = today;
        await saveUserProfile(profile);
      }

      setUser(profile);

      // Load progress
      const [pyProg, cProg, javaProg, achs] = await Promise.all([
        fetchUserProgress(uid, 'python'),
        fetchUserProgress(uid, 'c'),
        fetchUserProgress(uid, 'java'),
        fetchUserAchievements(uid),
      ]);

      setProgress({
        python: pyProg || progress.python,
        c: cProg || progress.c,
        java: javaProg || progress.java,
      });

      setUnlockedAchievements(achs || {});
    } catch (e) {
      console.warn('Error loading user data:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        await loadUserData(fbUser.uid, fbUser.email || '', fbUser.displayName || '');
      } else {
        setFirebaseUser(null);
        // If guest fallback exists in local storage
        const local = getLocalFallbackUser();
        if (local) {
          setUser(local);
        } else {
          // initialize a default student guest profile
          const defaultGuest: UserProfile = {
            uid: 'guest_student',
            email: 'student@codify.edu',
            displayName: 'Alex Chen',
            xp: 250,
            level: 1,
            streak: 3,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            preferredLanguage: 'python',
          };
          setUser(defaultGuest);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await loadUserData(cred.user.uid, cred.user.email || '', cred.user.displayName || '');
  };

  const signup = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: name,
      xp: 100,
      level: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredLanguage: 'python',
    };
    await saveUserProfile(newProfile);
    setUser(newProfile);
    setRecentNotification(`Welcome to Codify, ${name}! You received 100 Starter XP.`);
  };

  const loginDemoUser = async () => {
    const demoProfile: UserProfile = {
      uid: 'demo_user_' + Math.random().toString(36).substring(2, 7),
      email: 'demo.student@codify.dev',
      displayName: 'Demo Student',
      xp: 450,
      level: 2,
      streak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredLanguage: 'python',
    };
    setUser(demoProfile);
    saveUserProfile(demoProfile);
    setRecentNotification('Logged in as Demo Student with sample progress & XP!');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    setRecentNotification('Password reset link has been dispatched to your email.');
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setFirebaseUser(null);
  };

  const gainXP = async (amount: number, reason?: string) => {
    if (!user) return;
    const newXp = user.xp + amount;
    const { level: newLevel } = calculateLevel(newXp);
    const updated = {
      ...user,
      xp: newXp,
      level: newLevel,
    };
    setUser(updated);
    await saveUserProfile(updated);

    if (newLevel > user.level) {
      setRecentNotification(`Level Up! You reached Level ${newLevel}! +${amount} XP ${reason ? `(${reason})` : ''}`);
    } else {
      setRecentNotification(`+${amount} XP earned! ${reason || ''}`);
    }
  };

  const completeLesson = async (language: Language, lessonId: string, quizScore?: number) => {
    if (!user) return;

    const currentLangProg = progress[language];
    const completedSet = new Set(currentLangProg.completedLessons);
    const isNewCompletion = !completedSet.has(lessonId);
    completedSet.add(lessonId);

    const updatedQuizScores = { ...currentLangProg.quizScores };
    if (quizScore !== undefined) {
      updatedQuizScores[lessonId] = quizScore;
    }

    const updatedProg: LanguageProgress = {
      ...currentLangProg,
      completedLessons: Array.from(completedSet),
      currentLessonId: lessonId,
      quizScores: updatedQuizScores,
      updatedAt: new Date().toISOString(),
    };

    setProgress((prev) => ({ ...prev, [language]: updatedProg }));
    await saveUserProgress(user.uid, updatedProg);

    if (isNewCompletion) {
      await gainXP(50, `Completed ${lessonId}`);
    }

    // Check achievement triggers
    const totalCompleted =
      progress.python.completedLessons.length +
      progress.c.completedLessons.length +
      progress.java.completedLessons.length +
      (isNewCompletion ? 1 : 0);

    if (totalCompleted >= 1 && !unlockedAchievements['first-program']) {
      await unlockUserAchievement(user.uid, 'first-program', 'First Program');
      setUnlockedAchievements((prev) => ({
        ...prev,
        'first-program': { unlockedAt: new Date().toISOString() },
      }));
    }
    if (totalCompleted >= 10 && !unlockedAchievements['ten-lessons']) {
      await unlockUserAchievement(user.uid, 'ten-lessons', '10 Lessons Completed');
      setUnlockedAchievements((prev) => ({
        ...prev,
        'ten-lessons': { unlockedAt: new Date().toISOString() },
      }));
    }
  };

  const completeChallenge = async (language: Language, challengeId: string, score: number) => {
    if (!user) return;
    const currentLangProg = progress[language];
    const updatedScores = {
      ...currentLangProg.challengeScores,
      [challengeId]: score,
    };
    const updatedProg: LanguageProgress = {
      ...currentLangProg,
      challengeScores: updatedScores,
      updatedAt: new Date().toISOString(),
    };

    setProgress((prev) => ({ ...prev, [language]: updatedProg }));
    await saveUserProgress(user.uid, updatedProg);
    await gainXP(score, `Solved challenge ${challengeId}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        signup,
        loginDemoUser,
        resetPassword,
        logout,
        gainXP,
        completeLesson,
        completeChallenge,
        progress,
        unlockedAchievements,
        recentNotification,
        clearNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
