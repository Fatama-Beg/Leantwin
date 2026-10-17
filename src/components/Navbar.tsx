import React from 'react';
import { useApp } from '../context/AppContext';
import { ClassLevel } from '../types';
import {
  BookOpen,
  User,
  LogOut,
  Server,
  Layers,
  Settings
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenDockerHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenDockerHub }) => {
  const { currentUser, logout, activeClass, setActiveClass } = useApp();

  if (!currentUser) return null;

  const classTabs: { level: ClassLevel; title: string; label: string }[] = [
    { level: 6, title: 'চারুপাঠ', label: 'শ্রেণি ৬' },
    { level: 7, title: 'সপ্তবর্ণা', label: 'শ্রেণি ৭' },
    { level: 8, title: 'সাহিত্য-কণিকা', label: 'শ্রেণি ৮' }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'এডমিন',
          bg: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'teacher':
        return {
          label: 'শিক্ষক',
          bg: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'student':
        return {
          label: 'শিক্ষার্থী',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      default:
        return { label: role, bg: 'bg-slate-100 text-slate-800' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  NCTB বাংলা শিক্ষা
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                চারুপাঠ (৬) • সপ্তবর্ণা (৭) • সাহিত্য-কণিকা (৮)
              </p>
            </div>
          </div>

          {/* Class Switcher (Center) - Available to browse for students and teachers */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {classTabs.map((tab) => {
              const isActive = activeClass === tab.level;
              return (
                <button
                  key={tab.level}
                  onClick={() => setActiveClass(tab.level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Layers className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{tab.label}:</span>
                  <span className={isActive ? 'text-emerald-700 font-bold' : ''}>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* User Controls: Docker Hub, Profile Modal Trigger, Logout */}
          <div className="flex items-center gap-2">
            
            {/* Docker runner hub (useful for demonstration and admin) */}
            <button
              onClick={onOpenDockerHub}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 transition-colors shadow-2xs"
              title="লোকাল Docker ও Python কনফিগারেশন"
            >
              <Server className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Docker & Python Hub</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
              title="আমার প্রোফাইল ও ছবি পরিবর্তন করুন"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 block leading-none">
                  প্রোফাইল সেটিংস
                </span>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1"
              title="লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>

          </div>

        </div>

        {/* Mobile Class Switcher */}
        <div className="flex md:hidden items-center justify-between gap-1 py-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 shrink-0">পাঠ্য বই:</span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {classTabs.map((tab) => {
              const isActive = activeClass === tab.level;
              return (
                <button
                  key={tab.level}
                  onClick={() => setActiveClass(tab.level)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label} ({tab.title})
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
};
