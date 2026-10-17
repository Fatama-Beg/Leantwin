import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/auth/LoginPage';
import { ProfileModal } from './components/profile/ProfileModal';
import { NotificationToast } from './components/NotificationToast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { DockerDeployGuide } from './components/admin/DockerDeployGuide';
import { Server, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDockerModalOpen, setIsDockerModalOpen] = useState(false);

  // If user is not logged in, show dedicated Login & Register page
  if (!currentUser) {
    return (
      <>
        <LoginPage onOpenDockerGuide={() => setIsDockerModalOpen(true)} />

        {/* Docker Deployment Hub Modal */}
        {isDockerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Docker & Python Local Runner Hub
                    </h3>
                    <p className="text-xs text-slate-500">আপনার নিজস্ব লোকাল মেশিনে অফলাইনে সম্পূর্ণ প্রজেক্ট চালানোর ফাইলসমূহ</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDockerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <DockerDeployGuide />
              </div>
            </div>
          </div>
        )}

        <NotificationToast />
      </>
    );
  }

  // When logged in, strictly render the respective role page
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Clean Navbar */}
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDockerHub={() => setIsDockerModalOpen(true)}
      />

      {/* Main Container - strictly renders ONLY the user's role dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentUser.role === 'admin' && (
          <AdminDashboard />
        )}

        {currentUser.role === 'teacher' && (
          <TeacherDashboard />
        )}

        {currentUser.role === 'student' && (
          <StudentDashboard />
        )}

      </main>

      {/* Clean Professional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              NCTB বাংলা শিক্ষা
            </span>
            <span>•</span>
            <span>জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড অনুসরণে পরিচালিত</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setIsDockerModalOpen(true)}
              className="text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
            >
              <Server className="w-3.5 h-3.5 text-teal-600" />
              <span>লোকাল ডকার ও পাইথন ফাইলস</span>
            </button>
          </div>
        </div>
      </footer>

      {/* My Profile & Photo Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Docker Deployment Hub Modal */}
      {isDockerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Docker & Python Local Runner Hub
                  </h3>
                  <p className="text-xs text-slate-500">আপনার নিজস্ব লোকাল মেশিনে অফলাইনে সম্পূর্ণ প্রজেক্ট চালানোর ফাইলসমূহ</p>
                </div>
              </div>
              <button
                onClick={() => setIsDockerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <DockerDeployGuide />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <NotificationToast />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
