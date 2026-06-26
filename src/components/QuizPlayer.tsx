import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Timer, 
  ArrowRight, 
  Pause, 
  Play, 
  AlertCircle, 
  Code, 
  Atom, 
  Compass, 
  Film, 
  Brain, 
  PenTool,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { Quiz, Question } from '../types';
import { getCategoryDetails } from '../utils/categories';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number, timeTakenSeconds: number, answers: (number | null)[]) => void;
  onQuit: () => void;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Code,
  Atom,
  Compass,
  Film,
  Brain,
  PenTool
};

export default function QuizPlayer({ quiz, onComplete, onQuit }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  
  // Stats tracking
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const categoryDetails = getCategoryDetails(quiz.category);
  const CategoryIcon = categoryIcons[categoryDetails.iconName] || HelpCircle;

  // Track overall elapsed time
  useEffect(() => {
    if (!isPaused && !isAnswered && !showQuitConfirm) {
      totalTimeRef.current = setInterval(() => {
        setTotalTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (totalTimeRef.current) clearInterval(totalTimeRef.current);
    };
  }, [isPaused, isAnswered, showQuitConfirm]);

  // Question countdown timer
  useEffect(() => {
    setTimeLeft(quiz.timeLimitSeconds);
    setIsAnswered(false);
    setSelectedOptionIndex(null);
  }, [currentQuestionIndex, quiz.timeLimitSeconds]);

  useEffect(() => {
    if (isPaused || isAnswered || showQuitConfirm) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isPaused, isAnswered, showQuitConfirm]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setAnswers(prev => [...prev, null]); // null indicates timed out
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered || isPaused) return;
    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final score
      const score = answers.reduce((acc, curr, index) => {
        if (curr === quiz.questions[index].correctAnswerIndex) {
          return acc + 1;
        }
        return acc;
      }, 0);
      onComplete(score, totalTimeTaken, answers);
    }
  };

  // Sound generator/Visual effect haptics could go here, let's keep it beautifully visual
  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-slate-600 bg-slate-50 border-slate-200';
    if (timeLeft > 4) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200 pulse-red';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="quiz-player-container">
      {/* QUIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showQuitConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" id="quit-modal-backdrop">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100"
              id="quit-modal-content"
            >
              <div className="flex items-center gap-3 text-rose-600 mb-4" id="quit-modal-header">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-semibold text-lg text-slate-900">Abandon Quiz?</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Are you sure you want to quit this quiz? Your progress for this session will be permanently lost.
              </p>
              <div className="flex gap-3 justify-end" id="quit-modal-actions">
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg transition-colors cursor-pointer"
                  id="btn-cancel-quit"
                >
                  Keep Playing
                </button>
                <button
                  onClick={onQuit}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
                  id="btn-confirm-quit"
                >
                  Yes, Quit Quiz
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAUSE MODAL */}
      <AnimatePresence>
        {isPaused && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-40" id="pause-modal-backdrop">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center border border-slate-100"
              id="pause-modal-content"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4" id="pause-modal-icon">
                <Pause className="w-8 h-8 fill-indigo-600" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 mb-2">Quiz Paused</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Take a breath! Your timer and scores are held safely where you left them.
              </p>
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                id="btn-resume-quiz"
              >
                <Play className="w-4 h-4 fill-white" />
                Resume Quiz
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUIZ HEADER */}
      <div className="flex items-center justify-between mb-6" id="player-header">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
            title="Quit Quiz"
            id="btn-player-quit"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${categoryDetails.color}`}>
                <CategoryIcon className="w-3 h-3" />
                {quiz.category}
              </span>
              <span className="text-xs font-medium text-slate-400">•</span>
              <span className={`text-xs font-semibold ${
                quiz.difficulty === 'Easy' ? 'text-emerald-600' :
                quiz.difficulty === 'Medium' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {quiz.difficulty}
              </span>
            </div>
            <h1 className="font-semibold text-lg text-slate-900 truncate max-w-[200px] sm:max-w-xs">{quiz.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3" id="player-timer-controls">
          <button
            onClick={() => setIsPaused(true)}
            disabled={isAnswered}
            className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Pause Timer"
            id="btn-player-pause"
          >
            <Pause className="w-4 h-4" />
          </button>
          
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-all ${getTimerColor()}`} id="timer-display">
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* QUESTION PROGRESS BAR */}
      <div className="mb-8" id="progress-container">
        <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-2">
          <span>QUESTION {currentQuestionIndex + 1} OF {quiz.questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-indigo-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-6 sm:p-8 mb-6" id="question-card">
        <h2 className="font-serif italic font-medium text-xl sm:text-2xl text-slate-900 leading-snug mb-8" id="question-text">
          {currentQuestion.question}
        </h2>

        {/* OPTIONS STACK */}
        <div className="space-y-3" id="options-stack">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;
            
            let cardStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
            let statusIcon = null;

            if (isAnswered) {
              if (isCorrectAnswer) {
                // Highlight correct answer in green
                cardStyle = "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-xs";
                statusIcon = <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>;
              } else if (isSelected) {
                // Highlight incorrect user choice in red
                cardStyle = "border-rose-200 bg-rose-50 text-rose-900";
                statusIcon = <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center"><X className="w-3.5 h-3.5 stroke-[3]" /></div>;
              } else {
                // Other options fade out slightly
                cardStyle = "border-slate-100 bg-white opacity-40 text-slate-500";
              }
            } else if (isSelected) {
              cardStyle = "border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-600/10";
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                whileTap={{ scale: isAnswered ? 1 : 0.99 }}
                className={`w-full text-left p-4 rounded-2xl border-2 font-medium text-sm sm:text-base flex items-center justify-between transition-all duration-200 ${cardStyle} ${isAnswered ? '' : 'cursor-pointer'}`}
                id={`option-${index}`}
              >
                <div className="flex items-center gap-4 pr-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-semibold ${
                    isAnswered && isCorrectAnswer ? 'bg-emerald-100 text-emerald-800' :
                    isAnswered && isSelected ? 'bg-rose-100 text-rose-800' :
                    isSelected ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-normal">{option}</span>
                </div>
                {statusIcon}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* EXPLANATION DRAWER */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`border rounded-2xl p-5 mb-6 overflow-hidden ${
              selectedOptionIndex === currentQuestion.correctAnswerIndex
                ? 'bg-emerald-50/30 border-emerald-100 text-emerald-950'
                : selectedOptionIndex === null
                ? 'bg-amber-50/30 border-amber-100 text-amber-950'
                : 'bg-rose-50/30 border-rose-100 text-rose-950'
            }`}
            id="explanation-drawer"
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                selectedOptionIndex === currentQuestion.correctAnswerIndex ? 'bg-emerald-100 text-emerald-700' :
                selectedOptionIndex === null ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {selectedOptionIndex === currentQuestion.correctAnswerIndex ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  {selectedOptionIndex === currentQuestion.correctAnswerIndex ? 'Correct Answer!' : 
                   selectedOptionIndex === null ? 'Time limit reached!' : 'Incorrect Choice'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-between" id="player-footer">
        <div className="text-xs font-semibold text-slate-400 font-mono">
          TIME ELAPSED: {totalTimeTaken}s
        </div>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold text-sm rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          id="btn-next-question"
        >
          <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
