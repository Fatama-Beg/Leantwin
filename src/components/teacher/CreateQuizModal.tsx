import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassLevel, QuizQuestion } from '../../types';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import { X, Award, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, chapters, addQuiz } = useApp();
  const [classLevel, setClassLevel] = useState<ClassLevel>(6);
  const [chapterTitle, setChapterTitle] = useState('');
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}-1`,
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    }
  ]);

  if (!isOpen || !currentUser) return null;

  const currentSubject = SUBJECT_MAP[classLevel];
  const availableChapters = chapters.filter((c) => c.classLevel === classLevel);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${questions.length + 1}`,
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].question = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, text: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = text;
    setQuestions(updated);
  };

  const handleCorrectIndexChange = (qIdx: number, optIdx: number) => {
    const updated = [...questions];
    updated[qIdx].correctIndex = optIdx;
    setQuestions(updated);
  };

  const handleExplanationChange = (qIdx: number, text: string) => {
    const updated = [...questions];
    updated[qIdx].explanation = text;
    setQuestions(updated);
  };

  // AI-assisted sample question populator
  const handleAutoFillFromNCTB = () => {
    const targetChapter = availableChapters.find((c) => c.chapterTitle === chapterTitle) || availableChapters[0];
    if (!targetChapter) return;

    setTitle(`${targetChapter.chapterTitle} অধ্যায় ভিত্তিক মূল্যায়ন কুইজ`);
    setChapterTitle(targetChapter.chapterTitle);
    setQuestions([
      {
        id: `q-auto-1`,
        question: `"${targetChapter.chapterTitle}" রচনাটি কে লিখেছেন?`,
        options: [targetChapter.author, 'কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীমউদ্দীন'],
        correctIndex: 0,
        explanation: `রচনাটি লিখেছেন ${targetChapter.author}।`
      },
      {
        id: `q-auto-2`,
        question: `"${targetChapter.chapterTitle}" রচনার মূল শিক্ষা বা উপপাদ্য কী?`,
        options: [
          targetChapter.moralLesson,
          'শুধুমাত্র পার্থিব সুখ উপভোগ করা',
          'সবসময় ঘুরে বেড়ানো',
          'শহরের চাকচিক্যময় জীবনযাপন'
        ],
        correctIndex: 0,
        explanation: `মূল শিক্ষা: ${targetChapter.moralLesson}`
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    // Validate that questions have non-empty text
    const validQuestions = questions.filter(
      (q) => q.question.trim() && q.options.some((o) => o.trim())
    );

    if (validQuestions.length === 0) return;

    addQuiz({
      title,
      classLevel,
      subject: currentSubject.title,
      chapterTitle: chapterTitle || availableChapters[0]?.chapterTitle || 'সাধারণ অধ্যায়',
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      timeLimitMinutes: timeLimit,
      questions: validQuestions
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                নতুন কুইজ তৈরি ও তাৎক্ষণিক ট্র্যাকিং সেটআপ
              </h3>
              <p className="text-xs text-slate-500">বহুনির্বাচনী প্রশ্ন (MCQ) এবং উত্তরের ব্যাখ্যা তৈরি করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* Class Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                শ্রেণি ও পাঠ্যবই:
              </label>
              <div className="flex gap-2">
                {[
                  { lvl: 6 as ClassLevel, label: '৬ (চারুপাঠ)' },
                  { lvl: 7 as ClassLevel, label: '৭ (সপ্তবর্ণা)' },
                  { lvl: 8 as ClassLevel, label: '৮ (সাহিত্য-কণিকা)' }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => setClassLevel(item.lvl)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      classLevel === item.lvl
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillFromNCTB}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>NCTB থেকে প্রশ্ন জেনারেট করুন</span>
            </button>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অধ্যায় নির্বাচন:
            </label>
            <select
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="">অধ্যায় নির্বাচন করুন...</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.chapterTitle}>
                  {ch.chapterTitle} ({ch.author})
                </option>
              ))}
            </select>
          </div>

          {/* Quiz Title & Time Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কুইজের শিরোনাম:
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: চারুপাঠ - সততার পুরস্কার অধ্যায় মূল্যায়ন কুইজ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সময়সীমা (মিনিট):
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                প্রশ্ন ও অপশনসমূহ ({questions.length}টি প্রশ্ন)
              </label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আরেকটি প্রশ্ন যোগ করুন</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    প্রশ্ন {qIdx + 1}:
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="প্রশ্ন মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  placeholder="প্রশ্নের বাক্য লিখুন..."
                  value={q.question}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border bg-white ${
                          isCorrect ? 'border-emerald-500 ring-1 ring-emerald-400' : 'border-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={isCorrect}
                          onChange={() => handleCorrectIndexChange(qIdx, optIdx)}
                          className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                        />
                        <span className="text-xs font-bold text-slate-500 shrink-0">
                          {optIdx === 0 ? 'ক.' : optIdx === 1 ? 'খ.' : optIdx === 2 ? 'গ.' : 'ঘ.'}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`অপশন ${optIdx + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          className="w-full text-xs border-0 focus:ring-0 p-0 text-slate-800"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div>
                  <input
                    type="text"
                    placeholder="উত্তরের ব্যাখ্যা (শিক্ষার্থী কুইজ দেওয়ার পর দেখতে পাবে)..."
                    value={q.explanation}
                    onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                    className="w-full px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-slate-600"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            কুইজ তৈরি ও প্রকাশ করুন
          </button>
        </form>

      </div>
    </div>
  );
};
