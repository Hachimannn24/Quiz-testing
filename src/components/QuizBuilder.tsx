import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  FileText,
  Clock,
  LayoutGrid,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Quiz, Question } from '../types';

interface QuizBuilderProps {
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
  existingQuizzesCount: number;
}

export default function QuizBuilder({ onSave, onCancel, existingQuizzesCount }: QuizBuilderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General Knowledge');
  const [customCategory, setCustomCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(20);
  
  // Start with one template question
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: ''
    }
  ]);

  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]);
    // Auto expand the newly created question
    setExpandedQuestionIndex(questions.length);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('Your quiz must have at least one question!');
      return;
    }
    setQuestions(prev => prev.filter((_, idx) => idx !== index));
    if (expandedQuestionIndex === index) {
      setExpandedQuestionIndex(Math.max(0, index - 1));
    } else if (expandedQuestionIndex > index) {
      setExpandedQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index].question = text;
      return updated;
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qIndex].options];
      opts[optIndex] = text;
      updated[qIndex].options = opts;
      return updated;
    });
  };

  const handleCorrectAnswerSelect = (qIndex: number, optIndex: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIndex].correctAnswerIndex = optIndex;
      return updated;
    });
  };

  const handleExplanationChange = (qIndex: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIndex].explanation = text;
      return updated;
    });
  };

  const validateQuiz = (): boolean => {
    const errList: string[] = [];
    
    if (!title.trim()) errList.push('Quiz Title is required.');
    if (!description.trim()) errList.push('Quiz Description is required.');
    
    const finalCategory = category === 'Other' ? customCategory : category;
    if (category === 'Other' && !customCategory.trim()) {
      errList.push('Please specify a custom category.');
    }

    if (timeLimitSeconds < 5 || timeLimitSeconds > 120) {
      errList.push('Time limit must be between 5 and 120 seconds.');
    }

    questions.forEach((q, idx) => {
      if (!q.question.trim()) {
        errList.push(`Question ${idx + 1} is empty.`);
      }
      q.options.forEach((opt, oIdx) => {
        if (!opt.trim()) {
          errList.push(`Question ${idx + 1}, Option ${String.fromCharCode(65 + oIdx)} is blank.`);
        }
      });
      if (!q.explanation.trim()) {
        errList.push(`Question ${idx + 1} requires an explanation of the answer.`);
      }
    });

    setErrors(errList);
    return errList.length === 0;
  };

  const handleSave = () => {
    if (!validateQuiz()) {
      // Scroll to error banner
      const banner = document.getElementById('error-banner');
      if (banner) {
        banner.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const finalCategory = category === 'Other' ? customCategory : category;

    const quizToSave: Quiz = {
      id: `custom-quiz-${Date.now()}-${existingQuizzesCount}`,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory.trim(),
      difficulty,
      timeLimitSeconds,
      isCustom: true,
      questions: questions.map((q, idx) => ({
        ...q,
        id: `q-custom-${idx}-${Date.now()}`
      }))
    };

    onSave(quizToSave);
  };

  const categoriesList = [
    'General Knowledge',
    'Web Development',
    'Science & Nature',
    'History',
    'Pop Culture',
    'Other'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="quiz-builder-container">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100" id="builder-header">
        <div>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Quiz Creator
          </h1>
          <p className="text-slate-500 text-sm mt-1">Design a brand new quiz to challenge yourself or others!</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          title="Cancel"
          id="btn-builder-close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ERROR BANNER */}
      {errors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-8" id="error-banner">
          <div className="flex items-center gap-2 text-rose-800 font-semibold mb-2">
            <AlertCircle className="w-5 h-5" />
            <span>Please fix the following validation errors:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-rose-700 pl-2">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* METADATA FORM */}
      <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-6 sm:p-8 mb-8" id="builder-metadata-section">
        <h3 className="font-serif font-semibold text-lg text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Quiz Details
        </h3>

        <div className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Ultimate JavaScript Closure Mastery"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm sm:text-base font-medium"
              id="input-quiz-title"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give a short overview describing the difficulty, focus, or prerequisite study topics..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm font-medium resize-none leading-relaxed"
              id="input-quiz-desc"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* CATEGORY */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm font-medium cursor-pointer"
                id="select-quiz-category"
              >
                {categoriesList.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* DIFFICULTY */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm font-medium cursor-pointer"
                id="select-quiz-difficulty"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* TIMER */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Timer Per Question</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={timeLimitSeconds}
                  onChange={(e) => setTimeLimitSeconds(Math.max(1, parseInt(e.target.value) || 0))}
                  min={5}
                  max={120}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm font-medium"
                  id="input-quiz-timer"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">secs</span>
              </div>
            </div>
          </div>

          {/* CUSTOM CATEGORY INPUT */}
          <AnimatePresence>
            {category === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Custom Category Name</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g., Anime Trivia, Mechanical Engineering, Food & Wine"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm font-medium"
                  id="input-quiz-custom-category"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* QUESTIONS SECTION */}
      <div className="mb-8" id="builder-questions-section">
        <div className="flex items-center justify-between mb-6" id="questions-header">
          <h3 className="font-serif font-semibold text-lg text-slate-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-500" />
            Quiz Questions ({questions.length})
          </h3>
        </div>

        <div className="space-y-4" id="questions-builder-list">
          {questions.map((q, qIdx) => {
            const isExpanded = expandedQuestionIndex === qIdx;

            return (
              <div 
                key={qIdx}
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all ${
                  isExpanded ? 'border-indigo-200 ring-2 ring-indigo-500/5' : 'border-slate-100 hover:border-slate-200'
                }`}
                id={`question-builder-item-${qIdx}`}
              >
                {/* QUESTION ACCORDION ROW */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestionIndex(isExpanded ? -1 : qIdx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  id={`btn-toggle-q-edit-${qIdx}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {qIdx + 1}
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-slate-800 truncate">
                      {q.question.trim() ? q.question : <span className="text-slate-400 italic">Empty Question...</span>}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-400 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveQuestion(qIdx);
                      }}
                      disabled={questions.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                      title="Delete Question"
                      id={`btn-delete-q-${qIdx}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* ACCORDION CONTENT */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 p-5 sm:p-6 space-y-5 bg-slate-50/20"
                    >
                      {/* QUESTION PROMPT */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Question Prompt</label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                          placeholder="e.g., What is the capital of Australia?"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-sm sm:text-base font-semibold"
                          id={`input-q-text-${qIdx}`}
                        />
                      </div>

                      {/* OPTIONS & CORRECT CHOICE */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Answer Options & Correct Answer</label>
                          <span className="text-[10px] text-slate-400 italic font-semibold">Select the radio bullet to flag the correct answer</span>
                        </div>

                        <div className="space-y-3">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctAnswerIndex === oIdx;

                            return (
                              <div 
                                key={oIdx} 
                                className={`flex items-center gap-3 p-3 rounded-xl border bg-white ${
                                  isCorrect ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                                }`}
                                id={`q-opt-container-${qIdx}-${oIdx}`}
                              >
                                <input
                                  type="radio"
                                  name={`correct-answer-radio-${qIdx}`}
                                  checked={isCorrect}
                                  onChange={() => handleCorrectAnswerSelect(qIdx, oIdx)}
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 shrink-0 cursor-pointer"
                                  title="Mark as correct"
                                  id={`radio-opt-${qIdx}-${oIdx}`}
                                />
                                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                                  isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                  className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm font-medium"
                                  id={`input-opt-${qIdx}-${oIdx}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* EXPLANATION */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Educational Explanation</span>
                        </label>
                        <textarea
                          value={q.explanation}
                          onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                          placeholder="Why is this answer correct? Provide a brief lesson, fact, or memory aid to help players learn!"
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none transition-colors text-xs sm:text-sm font-medium resize-none leading-relaxed"
                          id={`textarea-explanation-${qIdx}`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ADD QUESTION BUTTON */}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 text-slate-500 hover:text-indigo-600 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all cursor-pointer"
          id="btn-add-question"
        >
          <Plus className="w-4 h-4" />
          Add Another Question
        </button>
      </div>

      {/* SAVE / CANCEL BUTTONS */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100" id="builder-footer">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-full transition-colors cursor-pointer"
          id="btn-builder-cancel"
        >
          Discard Quiz
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          id="btn-builder-save"
        >
          <Save className="w-4 h-4" />
          Create Quiz
        </button>
      </div>
    </div>
  );
}
