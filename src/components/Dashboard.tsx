import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  HelpCircle, 
  Edit2, 
  Code, 
  Atom, 
  Compass, 
  Film, 
  Brain, 
  PenTool,
  Clock,
  Award,
  ChevronRight,
  Smile,
  X
} from 'lucide-react';
import { Quiz, UserStats, QuizHistoryEntry } from '../types';
import { getCategoryDetails } from '../utils/categories';

interface DashboardProps {
  quizzes: Quiz[];
  stats: UserStats;
  history: QuizHistoryEntry[];
  onSelectQuiz: (quiz: Quiz) => void;
  onCreateQuizClick: () => void;
  onDeleteCustomQuiz: (quizId: string) => void;
  onUpdateStats: (newStats: UserStats) => void;
  onClearHistory: () => void;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Code,
  Atom,
  Compass,
  Film,
  Brain,
  PenTool
};

const avatarEmojis = ['🧠', '🚀', '💻', '🔬', '🎓', '🎨', '🦁', '🦊', '🐼', '🦄', '🤖', '👾'];

export default function Dashboard({
  quizzes,
  stats,
  history,
  onSelectQuiz,
  onCreateQuizClick,
  onDeleteCustomQuiz,
  onUpdateStats,
  onClearHistory
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [tempNickname, setTempNickname] = useState(stats.nickname);
  const [tempAvatar, setTempAvatar] = useState(stats.avatarSeed);

  const categories = ['All', 'Web Development', 'Science & Nature', 'History', 'Pop Culture', 'General Knowledge', 'Custom'];

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Custom') return matchesSearch && quiz.isCustom;
    
    // Normalize matching for categories
    return matchesSearch && quiz.category === selectedCategory;
  });

  const handleSaveProfile = () => {
    if (!tempNickname.trim()) return;
    onUpdateStats({
      ...stats,
      nickname: tempNickname.trim(),
      avatarSeed: tempAvatar
    });
    setShowEditProfile(false);
  };

  const getAccuracyRate = () => {
    if (stats.totalQuestionsAttempted === 0) return 0;
    return Math.round((stats.correctAnswersCount / stats.totalQuestionsAttempted) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" id="dashboard-container">
      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" id="profile-modal-backdrop">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100"
            id="profile-modal-content"
          >
            <div className="flex justify-between items-center mb-4" id="profile-modal-header">
              <h3 className="font-semibold text-lg text-slate-900">Customize Profile</h3>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6" id="profile-modal-body">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Nickname</label>
                <input
                  type="text"
                  maxLength={15}
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm font-semibold"
                  placeholder="Enter nickname..."
                  id="input-profile-nickname"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Choose Avatar</label>
                <div className="grid grid-cols-4 gap-2" id="avatar-selector-grid">
                  {avatarEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setTempAvatar(emoji)}
                      className={`h-12 text-2xl flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${
                        tempAvatar === emoji 
                          ? 'border-indigo-600 bg-indigo-50/50 scale-105' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              id="btn-save-profile"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      )}

      {/* HERO / WELCOME CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" id="dashboard-hero-section">
        {/* PROFILE CARD */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden" id="dashboard-welcome-banner">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-4">
              <span className="text-5xl shrink-0 p-2.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                {stats.avatarSeed}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-xl sm:text-2xl tracking-tight italic text-white">
                    Welcome back, {stats.nickname}!
                  </h1>
                  <button 
                    onClick={() => {
                      setTempNickname(stats.nickname);
                      setTempAvatar(stats.avatarSeed);
                      setShowEditProfile(true);
                    }}
                    className="p-1 text-indigo-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                    title="Edit Profile"
                    id="btn-edit-profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-indigo-200 text-xs sm:text-sm mt-0.5 font-medium">Ready to flex your neurons today?</p>
              </div>
            </div>

            <button
              onClick={onCreateQuizClick}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white rounded-full transition-all shadow-lg shadow-indigo-600/10 cursor-pointer border border-indigo-400/25"
              id="btn-create-quiz-top"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Quiz
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 z-10" id="stats-ribbon">
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-300">Total Score</span>
              <span className="font-mono text-lg font-bold mt-0.5 block">{stats.totalScore.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-300">Accuracy</span>
              <span className="font-mono text-lg font-bold mt-0.5 block">{getAccuracyRate()}%</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-300">Quizzes Taken</span>
              <span className="font-mono text-lg font-bold mt-0.5 block">{stats.quizzesTaken}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-300">Active Streak</span>
                <span className="font-mono text-lg font-bold mt-0.5 block">{stats.streakDays} days</span>
              </div>
              <Flame className={`w-5 h-5 ${stats.streakDays > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            </div>
          </div>
        </div>

        {/* RECENT HISTORY PREVIEW */}
        <div className="bg-white border border-slate-100 shadow-xs rounded-3xl p-6 flex flex-col justify-between" id="recent-history-section">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-semibold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-indigo-500" />
                Recent Attempts
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={onClearHistory}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-700 uppercase cursor-pointer"
                  id="btn-clear-history"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-44 overflow-y-auto pr-1" id="history-items-list">
              {history.length === 0 ? (
                <div className="text-center py-6" id="history-empty-state">
                  <Smile className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-xs">No quizzes attempted yet.</p>
                </div>
              ) : (
                history.map((entry) => {
                  const details = getCategoryDetails(entry.category);
                  return (
                    <div 
                      key={entry.id}
                      className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate">{entry.quizTitle}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 uppercase tracking-wide font-mono font-medium">{entry.date}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-800 block">{entry.score} / {entry.totalQuestions}</span>
                        <span className="text-[10px] font-bold text-indigo-600 block">{Math.round((entry.score / entry.totalQuestions) * 100)}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4" id="recent-history-footer">
            <p className="text-[10px] text-slate-400 leading-normal font-medium">
              Every correct answer earns you 15 XP points towards your rank! Complete quizzes to maintain your daily streak.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" id="filters-toolbar">
        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none shrink-0" id="category-pills">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:max-w-xs" id="search-input-wrapper">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
            id="input-search-quizzes"
          />
        </div>
      </div>

      {/* MOBILE BUILDER FLOAT TRIGGER */}
      <div className="sm:hidden mb-6">
        <button
          onClick={onCreateQuizClick}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      {/* QUIZ GRID */}
      <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2" id="grid-header">
        <Award className="w-5 h-5 text-indigo-500" />
        Available Quizzes ({filteredQuizzes.length})
      </h2>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center" id="grid-empty-state">
          <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 mb-1">No quizzes found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Try adjusting your search terms or search filter, or construct a custom quiz yourself right away!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="quizzes-grid">
          {filteredQuizzes.map((quiz, index) => {
            const categoryDetails = getCategoryDetails(quiz.category);
            const CategoryIcon = categoryIcons[categoryDetails.iconName] || HelpCircle;

            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all group"
                id={`quiz-card-${quiz.id}`}
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${categoryDetails.color}`}>
                      <CategoryIcon className="w-3 h-3" />
                      {quiz.category}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        quiz.difficulty === 'Easy' ? 'text-emerald-600' :
                        quiz.difficulty === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {quiz.difficulty}
                      </span>
                      {quiz.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete your custom quiz "${quiz.title}"?`)) {
                              onDeleteCustomQuiz(quiz.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Custom Quiz"
                          id={`btn-delete-quiz-${quiz.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-semibold text-slate-800 text-base sm:text-lg mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-6">
                    {quiz.description}
                  </p>
                </div>

                {/* Footer specs & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <div className="text-[11px] text-slate-400 font-semibold font-mono space-y-0.5">
                    <div className="block">{quiz.questions.length} QUESTIONS</div>
                    <div className="block">{quiz.timeLimitSeconds}S PER TIMER</div>
                  </div>

                  <button
                    onClick={() => onSelectQuiz(quiz)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 group-hover:bg-indigo-600 text-white font-semibold text-xs rounded-full transition-all shadow-xs cursor-pointer"
                    id={`btn-play-quiz-${quiz.id}`}
                  >
                    <span>Start Quiz</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
