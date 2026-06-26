import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Share2, 
  Check, 
  X, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Copy,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Quiz, QuizHistoryEntry } from '../types';
import { getCategoryDetails } from '../utils/categories';

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  timeTakenSeconds: number;
  userAnswers: (number | null)[];
  onRestart: () => void;
  onGoHome: () => void;
}

export default function QuizResults({ 
  quiz, 
  score, 
  timeTakenSeconds, 
  userAnswers, 
  onRestart, 
  onGoHome 
}: QuizResultsProps) {
  const [copied, setCopied] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const categoryDetails = getCategoryDetails(quiz.category);

  // Custom feedback based on score
  const getFeedbackMessage = () => {
    if (percentage === 100) return { title: 'Perfect Score!', desc: 'You are an absolute master in this category! Outstanding job.' };
    if (percentage >= 80) return { title: 'Excellent Work!', desc: 'You have a highly robust understanding of this topic!' };
    if (percentage >= 50) return { title: 'Good Attempt!', desc: 'Nice job. A bit of review and you will get a perfect score!' };
    return { title: 'Keep Learning!', desc: 'Great practice. Read through the explanations below to master the concepts!' };
  };

  const feedback = getFeedbackMessage();

  const handleShare = () => {
    const text = `🏆 I scored ${score}/${quiz.questions.length} (${percentage}%) on the "${quiz.title}" quiz in the Quiz App! \nCategory: ${quiz.category}\nCan you beat my score? ⚡️`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleQuestionExpand = (index: number) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(index);
    }
  };

  // SVG parameters for circular score chart
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="quiz-results-container">
      {/* SUMMARY CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-10 mb-8 text-center"
        id="results-summary-card"
      >
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${categoryDetails.color}`}>
          {quiz.category}
        </span>
        
        <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-slate-900 mb-2">{feedback.title}</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">{feedback.desc}</p>

        {/* CIRCULAR PROGRESS */}
        <div className="relative w-40 h-40 mx-auto mb-8" id="svg-score-chart">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100 fill-transparent"
              strokeWidth={strokeWidth}
            />
            {/* Foreground progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              className="fill-transparent stroke-indigo-600"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif font-bold text-4xl text-slate-900 leading-none">{percentage}%</span>
            <span className="text-xs font-semibold text-slate-400 mt-1 font-mono">{score} / {quiz.questions.length} CORRECT</span>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto p-4 bg-slate-50/80 border border-slate-100 rounded-2xl mb-8" id="results-stats-strip">
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>TOTAL TIME</span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-800">
              {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s
            </div>
          </div>
          <div className="text-center py-2 border-l border-slate-200">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-semibold mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>XP EARNED</span>
            </div>
            <div className="font-mono text-lg font-bold text-emerald-600">
              +{score * 15} XP
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" id="results-action-buttons">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 font-medium text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer text-slate-700"
            id="btn-results-retry"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={handleShare}
            className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 font-medium text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer text-slate-700"
            id="btn-results-share"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied Results!' : 'Share Score'}
          </button>

          <button
            onClick={onGoHome}
            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 font-medium text-sm text-white rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            id="btn-results-home"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </motion.div>

      {/* QUESTION REVIEW ACCORDION */}
      <h3 className="font-serif font-semibold text-lg text-slate-900 mb-4" id="review-section-title">
        Review Answer Explanations
      </h3>

      <div className="space-y-4" id="results-review-accordion">
        {quiz.questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswerIndex;
          const isExpanded = expandedQuestion === index;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border rounded-2xl overflow-hidden transition-colors ${
                isCorrect 
                  ? 'border-emerald-100 hover:border-emerald-200' 
                  : userAnswer === null 
                  ? 'border-amber-100 hover:border-amber-200' 
                  : 'border-rose-100 hover:border-rose-200'
              }`}
              id={`review-item-${index}`}
            >
              <button
                onClick={() => toggleQuestionExpand(index)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                id={`btn-review-toggle-${index}`}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-xs ${
                    isCorrect ? 'bg-emerald-500' : userAnswer === null ? 'bg-amber-500' : 'bg-rose-500'
                  }`}>
                    {isCorrect ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : userAnswer === null ? <Clock className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-slate-400">QUESTION {index + 1}</span>
                    <h4 className="font-semibold text-sm sm:text-base text-slate-800 leading-snug mt-0.5">{question.question}</h4>
                  </div>
                </div>
                <div className="text-slate-400 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* EXPANDED PANEL */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-50 bg-slate-50/50" id={`review-panel-${index}`}>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optIdx) => {
                      const isCorrectOption = optIdx === question.correctAnswerIndex;
                      const isUserSelection = optIdx === userAnswer;
                      
                      let optionStyle = "border-slate-100 bg-white text-slate-600";
                      let pillLabel = null;

                      if (isCorrectOption) {
                        optionStyle = "border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold";
                        pillLabel = <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Correct Option</span>;
                      } else if (isUserSelection) {
                        optionStyle = "border-rose-200 bg-rose-50 text-rose-900 font-semibold";
                        pillLabel = <span className="text-[10px] uppercase tracking-wider font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">Your Choice</span>;
                      }

                      return (
                        <div 
                          key={optIdx} 
                          className={`p-3 border rounded-xl text-xs sm:text-sm flex items-center justify-between ${optionStyle}`}
                          id={`review-option-${index}-${optIdx}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                              isCorrectOption ? 'bg-emerald-100 text-emerald-800' :
                              isUserSelection ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{option}</span>
                          </div>
                          {pillLabel}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-100/70 border border-slate-200/50 rounded-xl p-4 text-xs sm:text-sm text-slate-600 leading-relaxed" id={`review-explanation-${index}`}>
                    <div className="font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">Concept Explanation:</div>
                    {question.explanation}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
