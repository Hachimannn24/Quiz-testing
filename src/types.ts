export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  timeLimitSeconds: number; // seconds per question
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isCustom?: boolean;
}

export interface QuizHistoryEntry {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  date: string;
  answers: (number | null)[]; // indices of user selections (null for skipped/timeout)
}

export interface UserStats {
  nickname: string;
  avatarSeed: string; // to generate nice placeholder avatars
  totalScore: number;
  quizzesTaken: number;
  correctAnswersCount: number;
  totalQuestionsAttempted: number;
  streakDays: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
}

export interface CategoryDetails {
  name: string;
  iconName: string; // matching lucide icons
  color: string; // Tailwind bg-class
  textColor: string; // Tailwind text-class
  borderColor: string; // Tailwind border-class
  description: string;
}
