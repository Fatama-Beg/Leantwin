import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherManagement } from './TeacherManagement';
import { StudentManagement } from './StudentManagement';
import { RAGKnowledgeBase } from './RAGKnowledgeBase';
import { DockerDeployGuide } from './DockerDeployGuide';
import {
  ShieldCheck,
  School,
  GraduationCap,
  Database,
  Server,
  Layers,
  Award,
  FileText,
  Video
} from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: 'teachers' | 'students' | 'rag' | 'docker';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'teachers' }) => {
  const { users, materials, videos, quizzes, submissions, chapters } = useApp();
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'rag' | 'docker'>(initialTab);

  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const studentCount = users.filter((u) => u.role === 'student').length;

  return (
    <div className="space-y-6">
      
      {/* Admin Stat Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">শিক্ষকবৃন্দ</span>
            <School className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{teacherCount}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">নিবন্ধিত শিক্ষক</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">শিক্ষার্থীবৃন্দ</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{studentCount}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">শ্রেণি ৬-৮</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">পাঠ্য উপাদান</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{materials.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">নোট ও RTF ফাইল</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">ভিডিও ক্লাস</span>
            <Video className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{videos.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">অনলাইন লেকচার</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">কুইজ ও পরীক্ষা</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{quizzes.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{submissions.length}টি সাবমিশন</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">RAG ইনডেক্স</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{chapters.length}</span>
          <span className="text-[10px] text-teal-700 font-bold block mt-0.5">NCTB চ্যাপ্টার</span>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'teachers' as const, label: 'শিক্ষক ব্যবস্থাপনা', icon: School },
          { id: 'students' as const, label: 'শিক্ষার্থী ব্যবস্থাপনা', icon: GraduationCap },
          { id: 'rag' as const, label: 'RAG নলেজবেস ও টেক্সটবুক ডাটা', icon: Database },
          { id: 'docker' as const, label: 'Docker ও Python লোকাল হাব', icon: Server, badge: 'লোকাল রান' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-900'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subviews */}
      {activeTab === 'teachers' && <TeacherManagement />}
      {activeTab === 'students' && <StudentManagement />}
      {activeTab === 'rag' && <RAGKnowledgeBase />}
      {activeTab === 'docker' && <DockerDeployGuide />}

    </div>
  );
};
