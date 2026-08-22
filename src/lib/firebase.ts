import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { UserProfile, LanguageProgress, Achievement, Language } from "../types";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Helper for local mock storage in case of offline or demo preview
const LOCAL_STORAGE_KEY_USER = "codify_local_user";
const LOCAL_STORAGE_KEY_PROGRESS = "codify_local_progress";
const LOCAL_STORAGE_KEY_ACHIEVEMENTS = "codify_local_achievements";

// Save / Get local fallback
export function getLocalFallbackUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveLocalFallbackUser(user: UserProfile) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    // ignore
  }
}

// User Profile Operations
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn("Firestore fetch error, using local fallback:", err);
  }
  return getLocalFallbackUser();
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  saveLocalFallbackUser(profile);
  try {
    const userRef = doc(db, "users", profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore write error, saved locally:", err);
  }
}

// Language Progress Operations
export async function fetchUserProgress(uid: string, language: Language): Promise<LanguageProgress | null> {
  try {
    const progRef = doc(db, "users", uid, "progress", language);
    const snap = await getDoc(progRef);
    if (snap.exists()) {
      return snap.data() as LanguageProgress;
    }
  } catch (err) {
    console.warn(`Firestore get progress error for ${language}:`, err);
  }

  // Check local storage
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PROGRESS}_${language}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }

  return {
    language,
    completedLessons: [],
    currentLessonId: `${language}-intro`,
    quizScores: {},
    challengeScores: {},
    updatedAt: new Date().toISOString(),
  };
}

export async function saveUserProgress(uid: string, progress: LanguageProgress): Promise<void> {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PROGRESS}_${progress.language}`, JSON.stringify(progress));
  } catch (e) {}

  try {
    const progRef = doc(db, "users", uid, "progress", progress.language);
    await setDoc(progRef, {
      ...progress,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore write progress error:", err);
  }
}

// Save challenge solution
export async function recordChallengeCompletion(
  uid: string,
  challengeId: string,
  language: Language,
  code: string,
  score: number,
  passed: boolean
): Promise<void> {
  try {
    const chalRef = doc(db, "users", uid, "challenges", challengeId);
    await setDoc(chalRef, {
      challengeId,
      language,
      status: passed ? "completed" : "attempted",
      score,
      userCode: code,
      completedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn("Error saving challenge in firestore:", e);
  }
}

// Fetch all achievements
export async function fetchUserAchievements(uid: string): Promise<Record<string, { unlockedAt: string }>> {
  const result: Record<string, { unlockedAt: string }> = {};
  try {
    const snap = await getDocs(collection(db, "users", uid, "achievements"));
    snap.forEach((d) => {
      result[d.id] = d.data() as { unlockedAt: string };
    });
  } catch (err) {
    console.warn("Error fetching achievements:", err);
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
  }
  return result;
}

export async function unlockUserAchievement(uid: string, achievementId: string, title: string): Promise<void> {
  try {
    const achRef = doc(db, "users", uid, "achievements", achievementId);
    await setDoc(achRef, {
      id: achievementId,
      title,
      unlockedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Error saving achievement:", err);
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS);
    const existing = raw ? JSON.parse(raw) : {};
    existing[achievementId] = { unlockedAt: new Date().toISOString() };
    localStorage.setItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(existing));
  } catch (e) {}
}
