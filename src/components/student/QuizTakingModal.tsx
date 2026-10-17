import React, { useState } from 'react';
import { Quiz } from '../../types';
import { useApp } from '../../context/AppContext';
import { QuizEvaluationResult } from '../../utils/quizEvaluation';
import {
  X,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface QuizTakingModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizTakingModal: React.FC<QuizTakingModalProps> = ({ quiz, isOpen, onClose }) => {
  const { submitQuiz } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(quiz.questions.length).fill(-1)
  );
  const [result, setResult] = useState<QuizEvaluationResult | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentQ = quiz.questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === quiz.questions.length - 1;

  const handleSelectOption = (optIndex: number) => {
    if (result) return; // already submitted
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmit = () => {
    const evalResult = submitQuiz(quiz.id, selectedAnswers);
    setResult(evalResult);
  };

  const handleRetake = () => {
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                শ্রেণি {quiz.classLevel === 6 ? '৬ (চারুপাঠ)' : quiz.classLevel === 7 ? '৭ (সপ্তবর্ণা)' : '৮ (সাহিত্য-কণিকা)'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                অধ্যায়: {quiz.chapterTitle}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mt-1">
              {quiz.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Results are available, show Results View */}
        {result ? (
          <div className="py-6 space-y-6">
            
            {/* Score Card */}
            <div className={`p-6 rounded-2xl text-center border ${
              result.percentage >= 80
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : result.percentage >= 50
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-white shadow-sm border">
                <Award className={`w-8 h-8 ${
                  result.percentage >= 80 ? 'text-emerald-600' : result.percentage >= 50 ? 'text-amber-600' : 'text-rose-600'
                }`} />
              </div>
              <h4 className="text-2xl font-black mb-1">
                প্রাপ্ত নম্বর: {result.score} / {result.totalQuestions}
              </h4>
              <p className="text-sm font-bold opacity-80 mb-2">
                সফলতার হার: {result.percentage}%
              </p>
              <p className="text-sm font-medium max-w-md mx-auto leading-relaxed">
                {result.feedbackMessage}
              </p>
            </div>

            {/* Answer Breakdown */}
            <div className="space-y-4">
              <h5 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                প্রশ্নের বিস্তারিত সমাধান ও ব্যাখ্যা:
              </h5>

              {result.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-sm ${
                    item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-rose-200 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900">
                      {idx + 1}. {item.questionText}
                    </span>
                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> ভুল
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1 mb-2">
                    <p className="text-slate-600">
                      আপনার উত্তর: <span className="font-semibold">{item.userAnswer >= 0 ? quiz.questions[idx].options[item.userAnswer] : 'উত্তর দেওয়া হয়নি'}</span>
                    </p>
                    {!item.isCorrect && (
                      <p className="text-emerald-800 font-semibold">
                        সঠিক উত্তর: {quiz.questions[idx].options[item.correctAnswer]}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                    💡 <span className="font-medium">ব্যাখ্যা:</span> {item.explanation}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                পুনরায় পরীক্ষা দিন
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors"
              >
                সম্পন্ন
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Taking View */
          <div className="py-6 space-y-6">
            
            {/* Progress Bar & Counter */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>প্রশ্ন {currentQuestionIndex + 1} / {quiz.questions.length}</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <Clock className="w-3.5 h-3.5" /> সময়সীমা: {quiz.timeLimitMinutes} মিনিট
              </span>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
                }}
              />
            </div>

            {/* Question Text */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-base leading-relaxed">
                {currentQuestionIndex + 1}. {currentQ.question}
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {oIdx === 0 ? 'ক' : oIdx === 1 ? 'খ' : oIdx === 2 ? 'গ' : 'ঘ'}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
              >
                পূর্ববর্তী প্রশ্ন
              </button>

              {isLast ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  কুইজ সাবমিট করুন ও তাৎক্ষণিক ফলাফল দেখুন
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  পরবর্তী প্রশ্ন
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
