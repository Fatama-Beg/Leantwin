import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NCTBChapter, Quiz } from '../../types';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import { TextbookReader } from './TextbookReader';
import { VideoClassViewer } from './VideoClassViewer';
import { QuizTakingModal } from './QuizTakingModal';
import { AIBanglaTutor } from './AIBanglaTutor';
import {
  BookOpen,
  Video,
  Award,
  Sparkles,
  FileText,
  Download,
  Calendar,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, activeClass, quizzes, submissions, materials, incrementMaterialDownloads, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'textbook' | 'videos' | 'quizzes' | 'ai-tutor' | 'materials'>('textbook');
  const [activeQuizToTake, setActiveQuizToTake] = useState<Quiz | null>(null);

  if (!currentUser) return null;

  const currentSubject = SUBJECT_MAP[activeClass];
  const classQuizzes = quizzes.filter((q) => q.classLevel === activeClass);
  const classMaterials = materials.filter((m) => m.classLevel === activeClass);
  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id && s.classLevel === activeClass);

  const handleAskAIAboutChapter = (chapter: NCTBChapter) => {
    setActiveTab('ai-tutor');
  };

  const handleDownloadMaterial = (mat: typeof materials[0]) => {
    incrementMaterialDownloads(mat.id);
    const blob = new Blob([mat.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mat.title.replace(/\s+/g, '_')}.${mat.type === 'rtf' ? 'rtf' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`"${mat.title}" ফাইলটি ডাউনলোড করা হয়েছে।`);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Welcome & Class Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                স্বাগতম, {currentUser.name}!
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                শিক্ষার্থী
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              বর্তমানে অধ্যয়ন করছ: <strong className="text-emerald-700">শ্রেণি {activeClass === 6 ? '৬ (চারুপাঠ)' : activeClass === 7 ? '৭ (সপ্তবর্ণা)' : '৮ (সাহিত্য-কণিকা)'}</strong>
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center min-w-[90px]">
            <span className="block text-lg font-black text-emerald-800">
              {mySubmissions.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">কুইজ সম্পন্ন</span>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center min-w-[90px]">
            <span className="block text-lg font-black text-blue-800">
              {mySubmissions.length > 0
                ? `${Math.round(mySubmissions.reduce((acc, s) => acc + s.percentage, 0) / mySubmissions.length)}%`
                : '১০০%'}
            </span>
            <span className="text-[11px] font-semibold text-blue-600">গড় ফলাফল</span>
          </div>
        </div>
      </div>

      {/* Main Feature Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'textbook' as const, label: 'পাঠ্যবই রিডার (NCTB)', icon: BookOpen },
          { id: 'ai-tutor' as const, label: 'AI বাংলা শিক্ষক (RAG)', icon: Sparkles, badge: 'স্মার্ট' },
          { id: 'quizzes' as const, label: 'কুইজ ও তাৎক্ষণিক ফলাফল', icon: Award, count: classQuizzes.length },
          { id: 'videos' as const, label: 'ভিডিও ক্লাস', icon: Video },
          { id: 'materials' as const, label: 'পাঠ্য উপকরণ ও RTF নোট', icon: FileText, count: classMaterials.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'textbook' && (
        <TextbookReader onAskAIAboutChapter={handleAskAIAboutChapter} />
      )}

      {activeTab === 'ai-tutor' && (
        <AIBanglaTutor />
      )}

      {activeTab === 'videos' && (
        <VideoClassViewer />
      )}

      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                অধ্যায়ভিত্তিক কুইজ ও তাৎক্ষণিক মূল্যায়ন ({currentSubject.title})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                সঠিক উত্তর নির্বাচন করার সাথে সাথে ফলাফল, শতাংশ এবং উত্তরের ব্যাখ্যা দেখতে পাবেন।
              </p>
            </div>
          </div>

          {/* Quizzes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classQuizzes.map((quiz) => {
              const previousAttempt = mySubmissions.find((s) => s.quizId === quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {quiz.chapterTitle}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {quiz.questions.length}টি প্রশ্ন • {quiz.timeLimitMinutes} মিনিট
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">
                      {quiz.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      প্রণয়ন করেছেন: {quiz.teacherName}
                    </p>

                    {previousAttempt && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 flex items-center justify-between">
                        <span className="font-semibold">সর্বশেষ ফলাফল:</span>
                        <span className="font-bold text-emerald-700">
                          {previousAttempt.score}/{previousAttempt.totalQuestions} ({previousAttempt.percentage}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">তাৎক্ষণিক ফলাফল ট্র্যাকিং</span>
                    <button
                      onClick={() => setActiveQuizToTake(quiz)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                    >
                      <span>{previousAttempt ? 'পুনরায় কুইজ দিন' : 'কুইজ শুরু করুন'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previous Submissions History */}
          {mySubmissions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                আপনার পূর্ববর্তী কুইজ অংশগ্রহণের ইতিহাস
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">কুইজের নাম</th>
                      <th className="py-2.5 px-3">প্রাপ্ত নম্বর</th>
                      <th className="py-2.5 px-3">শতাংশ</th>
                      <th className="py-2.5 px-3">তারিখ ও সময়</th>
                      <th className="py-2.5 px-3">মূল্যায়ন মন্তব্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mySubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {sub.quizTitle}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">
                          {sub.score} / {sub.totalQuestions}
                        </td>
                        <td className="py-2.5 px-3 font-bold">
                          {sub.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {new Date(sub.submittedAt).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">
                          {sub.feedback}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                শিক্ষকের দেওয়া পাঠ্য উপাদান ও RTF ফাইল ({currentSubject.title})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                গল্প ও কবিতার সারসংক্ষেপ, শব্দার্থ এবং সৃজনশীল নোটস ডাউনলোড বা পড়ার জন্য প্রস্তুত।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      অধ্যায়: {mat.chapterTitle}
                    </span>
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {mat.type} ফাইল
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {mat.title}
                  </h4>

                  <p className="text-xs text-slate-500">
                    আপলোড করেছেন: {mat.teacherName}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 line-clamp-3 leading-relaxed">
                    {mat.content}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {mat.downloadsCount} বার ডাউনলোড
                  </span>
                  <button
                    onClick={() => handleDownloadMaterial(mat)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ফাইল ডাউনলোড</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Quiz Taking Modal */}
      {activeQuizToTake && (
        <QuizTakingModal
          quiz={activeQuizToTake}
          isOpen={Boolean(activeQuizToTake)}
          onClose={() => setActiveQuizToTake(null)}
        />
      )}

    </div>
  );
};
