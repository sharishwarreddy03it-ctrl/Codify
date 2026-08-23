import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  fetchUserProfile,
  saveUserProfile,
  fetchUserProgress,
  saveUserProgress,
  fetchUserAchievements,
  unlockUserAchievement,
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
    let isMounted = true;

    // Safety timeout: don't leave the app stuck on the loading screen forever.
    const loadingTimeout = window.setTimeout(() => {
      if (isMounted) {
        console.warn('Firebase authentication initialization timed out.');
        setLoading(false);
      }
    }, 30000);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      try {
        if (fbUser) {
          setFirebaseUser(fbUser);
          await loadUserData(
            fbUser.uid,
            fbUser.email || '',
            fbUser.displayName || ''
          );
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Firebase authentication initialization failed:', error);

        if (isMounted) {
          setFirebaseUser(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      window.clearTimeout(loadingTimeout);
      unsubscribe();
    };
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
    // Demo login is still a real Firebase Authentication session.
    // The account is created automatically the first time the demo is used.
    const demoEmail = 'demo.student@codify.dev';
    const demoPassword = 'CodifyDemo#2026!';

    try {
      let cred;

      try {
        cred = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      } catch (error: any) {
        // Create the Firebase demo account only when it does not exist yet.
        if (error?.code !== 'auth/user-not-found') {
          throw error;
        }

        cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
        await updateProfile(cred.user, { displayName: 'Demo Student' });
      }

      await loadUserData(cred.user.uid, cred.user.email || demoEmail, cred.user.displayName || 'Demo Student');
      setRecentNotification('Logged in as Demo Student with Firebase Authentication.');
    } catch (error: any) {
      console.error('Demo login failed:', error);
      throw new Error(error?.message || 'Demo login failed. Please check Firebase Email/Password authentication.');
    }
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