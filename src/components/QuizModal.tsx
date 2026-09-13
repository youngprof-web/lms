import React, { useState, useEffect } from 'react';
import { Quiz } from '../types';
import { Award, Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onSubmitResult: (score: number, maxScore: number, percentage: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onSubmitResult }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number; percentage: number; passed: boolean } | null>(null);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    let earnedPoints = 0;
    let totalPoints = 0;

    quiz.questions.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) {
        earnedPoints += q.points;
      }
    });

    const percentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
    const passed = percentage >= quiz.passPercentage;

    const res = { score: earnedPoints, maxScore: totalPoints, percentage, passed };
    setResult(res);
    setIsSubmitted(true);
    onSubmitResult(earnedPoints, totalPoints, percentage);
  };

  const currentQ = quiz.questions[currentQuestionIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Module Evaluation
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mt-1">{quiz.title}</h2>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-mono text-xs font-bold border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Results Screen or Active Question */}
        {isSubmitted && result ? (
          <div className="text-center py-6 space-y-5">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              result.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {result.passed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <div>
              <h3 className="text-2xl font-bold font-heading text-slate-900">
                {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Not Passed'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                You scored <strong className="text-slate-800">{result.score}</strong> out of <strong className="text-slate-800">{result.maxScore}</strong> points ({result.percentage}%).
              </p>
              <div className="text-[11px] text-slate-400 mt-1">
                Passing Requirement: {quiz.passPercentage}% • Recorded to Google Sheets Gradebook
              </div>
            </div>

            {/* Answer Review List */}
            <div className="text-left max-h-60 overflow-y-auto space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {quiz.questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className="text-xs space-y-1">
                    <div className="font-bold text-slate-800">
                      {idx + 1}. {q.questionText}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                        Your answer: {answers[q.id] || '(No response)'}
                      </span>
                      {!isCorrect && (
                        <span className="text-slate-500 font-medium">
                          • Correct: {q.correctAnswer}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Done & Return to Course
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Question Progress Tracker */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
              <span>{currentQ.points} Points</span>
            </div>

            {/* Question Text */}
            <div className="text-base font-bold text-slate-900 leading-snug">
              {currentQ.questionText}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentQ.id, opt)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {currentQuestionIdx < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  Next Question
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
