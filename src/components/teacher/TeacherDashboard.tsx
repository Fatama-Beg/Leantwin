import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadMaterialModal } from './UploadMaterialModal';
import { AddVideoModal } from './AddVideoModal';
import { CreateQuizModal } from './CreateQuizModal';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import {
  FileText,
  Video,
  Award,
  Users,
  Plus,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Search
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    activeClass,
    materials,
    removeMaterial,
    videos,
    removeVideo,
    quizzes,
    removeQuiz,
    submissions
  } = useApp();

  const [activeTab, setActiveTab] = useState<'materials' | 'videos' | 'quizzes' | 'submissions'>('materials');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  if (!currentUser) return null;

  const currentSubject = SUBJECT_MAP[activeClass];
  const classMaterials = materials.filter((m) => m.classLevel === activeClass);
  const classVideos = videos.filter((v) => v.classLevel === activeClass);
  const classQuizzes = quizzes.filter((q) => q.classLevel === activeClass);
  const classSubmissions = submissions.filter((s) => s.classLevel === activeClass);

  return (
    <div className="space-y-6">
      
      {/* Teacher Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                শিক্ষক ড্যাশবোর্ড: {currentUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                শিক্ষক প্যানেল
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.designation || 'বাংলা সাহিত্য শিক্ষক'} • বর্তমানে পরিচালনা করছেন: <strong className="text-blue-700">শ্রেণি {activeClass === 6 ? '৬ (চারুপাঠ)' : activeClass === 7 ? '৭ (সপ্তবর্ণা)' : '৮ (সাহিত্য-কণিকা)'}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>পাঠ্য উপাদান আপলোড</span>
          </button>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-2xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>ভিডিও ক্লাস যোগ করুন</span>
          </button>
          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-2xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>নতুন কুইজ তৈরি</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'materials' as const, label: 'পাঠ্য উপাদান ও RTF ফাইল', icon: FileText, count: classMaterials.length },
          { id: 'videos' as const, label: 'ভিডিও ক্লাসসমূহ', icon: Video, count: classVideos.length },
          { id: 'quizzes' as const, label: 'কুইজসমূহ', icon: Award, count: classQuizzes.length },
          { id: 'submissions' as const, label: 'শিক্ষার্থীদের তাৎক্ষণিক ফলাফল', icon: Users, count: classSubmissions.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      
      {/* 1. Class Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              {currentSubject.title} (শ্রেণি {activeClass})-এর পাঠ্য উপাদানসমূহ
            </h3>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              + নতুন নোট আপলোড
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      অধ্যায়: {mat.chapterTitle}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {mat.type}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {mat.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {mat.content}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {mat.downloadsCount} বার ডাউনলোড
                  </span>
                  <button
                    onClick={() => removeMaterial(mat.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded-md transition-colors"
                    title="উপাদানটি মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Video Classes */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              {currentSubject.title} (শ্রেণি {activeClass})-এর ভিডিও ক্লাসসমূহ
            </h3>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              + নতুন ভিডিও ক্লাস যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classVideos.map((vid) => (
              <div
                key={vid.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800">
                      {vid.chapterTitle}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {vid.duration}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {vid.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {vid.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    ভিউজ: {vid.views}
                  </span>
                  <button
                    onClick={() => removeVideo(vid.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded-md transition-colors"
                    title="ভিডিও ক্লাস মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              {currentSubject.title} (শ্রেণি {activeClass})-এর কুইজসমূহ
            </h3>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="text-xs font-bold text-amber-600 hover:text-amber-800"
            >
              + নতুন কুইজ তৈরি করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                      অধ্যায়: {quiz.chapterTitle}
                    </span>
                    <span className="text-xs text-slate-500">
                      {quiz.timeLimitMinutes} মিনিট
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {quiz.title}
                  </h4>

                  <p className="text-xs text-slate-600">
                    মোট প্রশ্ন: <strong className="text-slate-900">{quiz.questions.length}</strong>টি বহুনির্বাচনী প্রশ্ন
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    অংশগ্রহণ করেছে: {submissions.filter((s) => s.quizId === quiz.id).length} জন শিক্ষার্থী
                  </span>
                  <button
                    onClick={() => removeQuiz(quiz.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded-md transition-colors"
                    title="কুইজ মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Instant Student Submissions & Score Tracking Table */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                শিক্ষার্থীদের তাৎক্ষণিক ফলাফল ট্র্যাকিং ({currentSubject.title})
              </h3>
              <p className="text-xs text-slate-500">
                শিক্ষার্থীরা কুইজ সম্পন্ন করা মাত্র স্বয়ংক্রিয়ভাবে প্রাপ্ত নম্বর ও শতাংশ এখানে যুক্ত হয়
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              মোট সাবমিশন: {classSubmissions.length}টি
            </span>
          </div>

          {classSubmissions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              এই শ্রেণিতে এখনও কোনো শিক্ষার্থী কুইজ সাবমিট করেনি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">শিক্ষার্থীর নাম</th>
                    <th className="py-2.5 px-3">কুইজের শিরোনাম</th>
                    <th className="py-2.5 px-3">প্রাপ্ত নম্বর</th>
                    <th className="py-2.5 px-3">শতাংশ</th>
                    <th className="py-2.5 px-3">তারিখ ও সময়</th>
                    <th className="py-2.5 px-3">ফিডব্যাক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {sub.studentName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">
                        {sub.quizTitle}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">
                        {sub.score} / {sub.totalQuestions}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          sub.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.percentage >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(sub.submittedAt).toLocaleTimeString('bn-BD', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} ({new Date(sub.submittedAt).toLocaleDateString('bn-BD')})
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">
                        {sub.feedback}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <AddVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
      <CreateQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

    </div>
  );
};
