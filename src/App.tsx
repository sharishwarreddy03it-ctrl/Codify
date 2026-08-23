import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { LanguageLearningView } from './components/learn/LanguageLearningView';
import { LessonDetailView } from './components/learn/LessonDetailView';
import { HandsOnSandboxView } from './components/sandbox/HandsOnSandboxView';
import { PracticeChallengesView } from './components/practice/PracticeChallengesView';
import { ProgressAnalyticsView } from './components/progress/ProgressAnalyticsView';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { AITutorDrawer } from './components/common/AITutorDrawer';
import { LESSONS } from './data/courses';
import { Language } from './types';
import { Menu } from 'lucide-react';

function MainApp() {
  const { user, loading } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [sandboxLanguage, setSandboxLanguage] = useState<Language>('python');

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Landing Page Mode (if user clicks "Explore" or isn't logged in and wants to see landing)
  const [showLanding, setShowLanding] = useState<boolean>(true);

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLessonId(null);
    if (lang === 'python') setActiveTab('python');
    else if (lang === 'c') setActiveTab('c');
    else if (lang === 'java') setActiveTab('java');
    setShowLanding(false);
  };

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowLanding(false);
  };

  const handleOpenSandbox = (lang: Language = 'python') => {
    setSandboxLanguage(lang);
    setActiveTab('hands-on');
    setSelectedLessonId(null);
    setShowLanding(false);
  };

  const handleOpenChallenges = () => {
    setActiveTab('practice');
    setSelectedLessonId(null);
    setShowLanding(false);
  };

  const currentLesson = selectedLessonId
    ? LESSONS.find((l) => l.id === selectedLessonId)
    : null;

  const handleNextLesson = () => {
    if (!currentLesson) return;
    const currentIndex = LESSONS.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex >= 0 && currentIndex < LESSONS.length - 1) {
      setSelectedLessonId(LESSONS[currentIndex + 1].id);
    } else {
      setSelectedLessonId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Initializing Codify Learning Platform...</p>
      </div>
    );
  }

  // If user explicitly chose to view Landing or is not logged in initially
  if (!user) {
    return (
      <>
        <LandingPage
          onStartLearning={(lang) => {
            setShowLanding(false);
            if (lang) handleSelectLanguage(lang);
          }}
          onOpenLogin={() => handleOpenAuth('signin')}
          onOpenSignup={() => handleOpenAuth('signup')}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  const getTitle = () => {
    if (selectedLessonId && currentLesson) {
      return `${currentLesson.language.toUpperCase()}: ${currentLesson.title}`;
    }
    switch (activeTab) {
      case 'dashboard':
        return 'Student Dashboard';
      case 'python':
        return 'Python Curriculum';
      case 'c':
        return 'C Programming';
      case 'java':
        return 'Java Core';
      case 'hands-on':
        return 'Interactive Training IDE';
      case 'practice':
        return 'Challenges & Drills';
      case 'progress':
        return 'Progress Analytics';
      case 'profile':
        return 'Student Profile';
      default:
        return 'Codify';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Mobile menu toggle button */}
      <div className="lg:hidden fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl flex items-center justify-center border border-indigo-400/30"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedLessonId(null);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Minimalist Header */}
        <Header
          title={getTitle()}
          onOpenAuth={() => handleOpenAuth('signin')}
          onOpenAITutor={() => setIsAITutorOpen(true)}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {selectedLessonId && currentLesson ? (
            <LessonDetailView
              lesson={currentLesson}
              onBack={() => setSelectedLessonId(null)}
              onNextLesson={handleNextLesson}
              onOpenAITutor={() => setIsAITutorOpen(true)}
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardView
              onSelectLanguage={handleSelectLanguage}
              onOpenLesson={handleOpenLesson}
              onOpenSandbox={handleOpenSandbox}
              onOpenChallenges={handleOpenChallenges}
            />
          ) : activeTab === 'python' ? (
            <LanguageLearningView
              language="python"
              onOpenLesson={handleOpenLesson}
              onOpenSandbox={(lang) => handleOpenSandbox(lang)}
            />
          ) : activeTab === 'c' ? (
            <LanguageLearningView
              language="c"
              onOpenLesson={handleOpenLesson}
              onOpenSandbox={(lang) => handleOpenSandbox(lang)}
            />
          ) : activeTab === 'java' ? (
            <LanguageLearningView
              language="java"
              onOpenLesson={handleOpenLesson}
              onOpenSandbox={(lang) => handleOpenSandbox(lang)}
            />
          ) : activeTab === 'hands-on' ? (
            <HandsOnSandboxView
              initialLanguage={sandboxLanguage}
              onOpenAITutor={() => setIsAITutorOpen(true)}
            />
          ) : activeTab === 'practice' ? (
            <PracticeChallengesView onOpenAITutor={() => setIsAITutorOpen(true)} />
          ) : activeTab === 'progress' ? (
            <ProgressAnalyticsView />
          ) : activeTab === 'profile' ? (
            <ProfileView onOpenAuthModal={handleOpenAuth} />
          ) : null}
        </main>
      </div>

      {/* Floating AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        currentLanguage={
          currentLesson?.language || (activeTab === 'python' || activeTab === 'c' || activeTab === 'java' ? activeTab : 'python')
        }
        currentLessonTitle={currentLesson?.title || ''}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
