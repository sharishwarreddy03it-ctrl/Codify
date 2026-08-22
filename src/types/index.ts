export type Language = 'python' | 'c' | 'java';

export type Level = 'beginner' | 'intermediate' | 'advanced';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ChallengeCategory =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'algorithms'
  | 'data-structures'
  | 'interview'
  | 'real-world';

export type Challenge = CodingChallenge;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  createdAt: string;
  updatedAt: string;
  preferredLanguage?: Language;
}

export interface QuizOption {
  id: string;
  text: string;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'predict-output' | 'fill-blank' | 'debug';
  codeSnippet?: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
  hint?: string;
}

export interface InteractiveExample {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  expectedOutput?: string;
  hints: string[];
  explanation: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
  explanation?: string;
}

export interface PracticeExercise {
  id: string;
  title: string;
  instruction: string;
  initialCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hint: string;
  xpReward: number;
}

export interface Lesson {
  id: string;
  language: Language;
  level: 'beginner' | 'intermediate' | 'advanced';
  topicId: string;
  topicTitle: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  order: number;
  conceptContent: string; // Markdown / formatted explanation
  keyTakeaways: string[];
  interactiveExamples: InteractiveExample[];
  quizQuestions: QuizQuestion[];
  practiceExercise?: PracticeExercise;
  xpReward: number;
}

export interface Topic {
  id: string;
  language: Language;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  iconName: string;
  lessonIds: string[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  language: Language;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  solutionCode?: string;
  testCases: TestCase[];
  hints: string[];
  xpReward: number;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'coding' | 'streak' | 'mastery';
  xpReward: number;
  threshold: number;
  unlocked?: boolean;
  unlockedAt?: string;
}

export interface LanguageProgress {
  language: Language;
  completedLessons: string[];
  currentLessonId: string;
  quizScores: Record<string, number>; // lessonId -> percentage
  challengeScores: Record<string, number>; // challengeId -> score
  updatedAt: string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  exitCode: number;
  executionTimeMs: number;
  testResults?: {
    testCaseId: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    hidden?: boolean;
  }[];
  allPassed?: boolean;
}
