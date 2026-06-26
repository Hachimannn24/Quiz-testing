/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { defaultQuizzes } from './data/defaultQuizzes';
import { Quiz, UserStats, QuizHistoryEntry } from './types';
import Dashboard from './components/Dashboard';
import QuizPlayer from './components/QuizPlayer';
import QuizResults from './components/QuizResults';
import QuizBuilder from './components/QuizBuilder';
import { Trophy, Compass } from 'lucide-react';

const LOCAL_STATS_KEY = 'quiz_app_user_stats';
const LOCAL_CUSTOM_QUIZZES_KEY = 'quiz_app_custom_quizzes';
const LOCAL_HISTORY_KEY = 'quiz_app_history';

const DEFAULT_STATS: UserStats = {
  nickname: 'Trivia Challenger',
  avatarSeed: '🧠',
  totalScore: 60,
  quizzesTaken: 1,
  correctAnswersCount: 4,
  totalQuestionsAttempted: 5,
  streakDays: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0]
};

const DEFAULT_HISTORY: QuizHistoryEntry[] = [
  {
    id: 'example-history-1',
    quizId: 'web-dev-basics',
    quizTitle: 'Modern Web Development',
    category: 'Web Development',
    score: 4,
    totalQuestions: 5,
    timeTakenSeconds: 42,
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    answers: [1, 2, 0, 1, 1]
  }
];

export default function App() {
  const [view, setView] = useState<'dashboard' | 'playing' | 'results' | 'builder'>('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_STATS);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);

  // Results temporary states
  const [activeScore, setActiveScore] = useState<number>(0);
  const [activeTimeTaken, setActiveTimeTaken] = useState<number>(0);
  const [activeAnswers, setActiveAnswers] = useState<(number | null)[]>([]);

  // 1. Initial Load of Storage
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(LOCAL_STATS_KEY);
      if (storedStats) {
        setUserStats(JSON.parse(storedStats));
      } else {
        localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(DEFAULT_STATS));
      }

      const storedCustom = localStorage.getItem(LOCAL_CUSTOM_QUIZZES_KEY);
      if (storedCustom) {
        setCustomQuizzes(JSON.parse(storedCustom));
      }

      const storedHistory = localStorage.getItem(LOCAL_HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory(DEFAULT_HISTORY);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
      }
    } catch (e) {
      console.error('Failed to load storage values:', e);
    }
  }, []);

  // Merge pre-made and custom quizzes
  const allQuizzes = useMemo(() => {
    return [...defaultQuizzes, ...customQuizzes];
  }, [customQuizzes]);

  // Utility to format date nicely
  const getLocalDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayDateString = (): string => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getLocalDateString(d);
  };

  const handleUpdateStats = (newStats: UserStats) => {
    setUserStats(newStats);
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(newStats));
  };

  // 2. Play Actions
  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setView('playing');
  };

  const handleQuitActiveQuiz = () => {
    setSelectedQuiz(null);
    setView('dashboard');
  };

  // 3. Score Processing & Storage Update
  const handleQuizComplete = (score: number, timeTakenSeconds: number, answers: (number | null)[]) => {
    if (!selectedQuiz) return;

    const todayStr = getLocalDateString(new Date());
    const yesterdayStr = getYesterdayDateString();

    let newStreak = userStats.streakDays;
    
    if (userStats.lastPlayedDate === null) {
      newStreak = 1;
    } else if (userStats.lastPlayedDate === yesterdayStr) {
      newStreak += 1;
    } else if (userStats.lastPlayedDate !== todayStr) {
      // If they didn't play today or yesterday, streak breaks
      newStreak = 1;
    }

    const xpEarned = score * 15; // 15 XP per correct answer
    const questionsCount = selectedQuiz.questions.length;

    const updatedStats: UserStats = {
      ...userStats,
      totalScore: userStats.totalScore + xpEarned,
      quizzesTaken: userStats.quizzesTaken + 1,
      correctAnswersCount: userStats.correctAnswersCount + score,
      totalQuestionsAttempted: userStats.totalQuestionsAttempted + questionsCount,
      streakDays: newStreak,
      lastPlayedDate: todayStr
    };

    // Create history entry
    const newHistoryEntry: QuizHistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      category: selectedQuiz.category,
      score,
      totalQuestions: questionsCount,
      timeTakenSeconds,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      answers
    };

    const updatedHistory = [newHistoryEntry, ...history];

    // Save states
    setUserStats(updatedStats);
    setHistory(updatedHistory);
    setActiveScore(score);
    setActiveTimeTaken(timeTakenSeconds);
    setActiveAnswers(answers);

    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(updatedStats));
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updatedHistory));

    setView('results');
  };

  // 4. Custom Quizzes Actions
  const handleSaveCustomQuiz = (newQuiz: Quiz) => {
    const updatedCustom = [newQuiz, ...customQuizzes];
    setCustomQuizzes(updatedCustom);
    localStorage.setItem(LOCAL_CUSTOM_QUIZZES_KEY, JSON.stringify(updatedCustom));
    setView('dashboard');
  };

  const handleDeleteCustomQuiz = (quizId: string) => {
    const updatedCustom = customQuizzes.filter(q => q.id !== quizId);
    setCustomQuizzes(updatedCustom);
    localStorage.setItem(LOCAL_CUSTOM_QUIZZES_KEY, JSON.stringify(updatedCustom));
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire quiz attempt history? This cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem(LOCAL_HISTORY_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900" id="app-root">
      {/* GLOBAL HUD BAR */}
      <header className="sticky top-0 bg-slate-50/85 backdrop-blur-md border-b border-slate-100 py-4 px-6 z-30" id="global-header">
        <div className="max-w-6xl mx-auto flex items-center justify-between" id="header-inner">
          <div 
            onClick={view !== 'playing' ? () => setView('dashboard') : undefined} 
            className={`flex items-center gap-2.5 ${view !== 'playing' ? 'cursor-pointer' : ''}`}
            id="brand-logo"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-serif font-black shadow-md shadow-indigo-600/10">
              Q
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-slate-900">QuizCraft</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase block tracking-wider font-mono -mt-1">Brains Arena</span>
            </div>
          </div>

          <div className="flex items-center gap-4" id="header-profile-quickstats">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800" id="header-points">
              <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span className="font-mono">{userStats.totalScore.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* CORE VIEWPORT */}
      <main className="flex-grow py-4" id="view-viewport">
        {view === 'dashboard' && (
          <Dashboard
            quizzes={allQuizzes}
            stats={userStats}
            history={history}
            onSelectQuiz={handleSelectQuiz}
            onCreateQuizClick={() => setView('builder')}
            onDeleteCustomQuiz={handleDeleteCustomQuiz}
            onUpdateStats={handleUpdateStats}
            onClearHistory={handleClearHistory}
          />
        )}

        {view === 'playing' && selectedQuiz && (
          <QuizPlayer
            quiz={selectedQuiz}
            onComplete={handleQuizComplete}
            onQuit={handleQuitActiveQuiz}
          />
        )}

        {view === 'results' && selectedQuiz && (
          <QuizResults
            quiz={selectedQuiz}
            score={activeScore}
            timeTakenSeconds={activeTimeTaken}
            userAnswers={activeAnswers}
            onRestart={() => setView('playing')}
            onGoHome={() => {
              setSelectedQuiz(null);
              setView('dashboard');
            }}
          />
        )}

        {view === 'builder' && (
          <QuizBuilder
            onSave={handleSaveCustomQuiz}
            onCancel={() => setView('dashboard')}
            existingQuizzesCount={customQuizzes.length}
          />
        )}
      </main>

      {/* GLOBAL MINIMALIST FOOTER */}
      <footer className="py-6 border-t border-slate-100 text-center text-slate-400 text-xs font-medium" id="global-footer">
        <p>© {new Date().getFullYear()} QuizCraft Studio. Crafted for brain training and educational trivia excellence.</p>
      </footer>
    </div>
  );
}
