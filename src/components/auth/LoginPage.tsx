import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, ClassLevel } from '../../types';
import {
  BookOpen,
  LogIn,
  UserPlus,
  ShieldCheck,
  School,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Server
} from 'lucide-react';

interface LoginPageProps {
  onOpenDockerGuide?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenDockerGuide }) => {
  const { users, login, addUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('tanvir.class6@student.edu.bd');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole>('student');

  // Register form
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regClass, setRegClass] = useState<ClassLevel>(6);
  const [regSchool, setRegSchool] = useState('মতিঝিল মডেল স্কুল ও কলেজ');
  const [regRoll, setRegRoll] = useState('০৫');
  const [regDesignation, setRegDesignation] = useState('সহকারী শিক্ষক (বাংলা)');

  const handleRoleSelectQuick = (role: UserRole) => {
    setSelectedRoleForLogin(role);
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin');
      if (admin) setLoginEmail(admin.email);
    } else if (role === 'teacher') {
      const teacher = users.find((u) => u.role === 'teacher');
      if (teacher) setLoginEmail(teacher.email);
    } else {
      const student = users.find((u) => u.role === 'student');
      if (student) setLoginEmail(student.email);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast('অনুগ্রহ করে ইমেইল লিখুন।');
      return;
    }

    const success = login(loginEmail, loginPassword, selectedRoleForLogin);
    if (!success) {
      showToast('ইমেইল মেলেনি। নমুনা তালিকা থেকে নির্বাচন করুন অথবা নিবন্ধন করুন।');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    const defaultAvatar = regRole === 'admin'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : regRole === 'teacher'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

    const newUser = addUser({
      name: regName,
      email: regEmail,
      role: regRole,
      classLevel: regRole === 'student' ? regClass : undefined,
      school: regSchool,
      rollNumber: regRole === 'student' ? regRoll : undefined,
      designation: regRole === 'teacher' ? regDesignation : undefined,
      phone: regPhone || '+880 1700-000000',
      avatar: defaultAvatar
    });

    login(newUser.email, undefined, newUser.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-emerald-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
              NCTB বাংলা শিক্ষা
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              শ্রেণি ৬ (চারুপাঠ) • শ্রেণি ৭ (সপ্তবর্ণা) • শ্রেণি ৮ (সাহিত্য-কণিকা)
            </p>
          </div>
        </div>

        {onOpenDockerGuide && (
          <button
            onClick={onOpenDockerGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 text-xs font-bold transition-colors shadow-2xs"
          >
            <Server className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Docker & Python Runner</span>
          </button>
        )}
      </div>

      {/* Main Form Center Card */}
      <div className="max-w-xl w-full mx-auto my-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Tab Header (Login vs Register) */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-2 gap-2">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-700" />
            <span>লগইন করুন (Login)</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-700" />
            <span>নতুন নিবন্ধন (Register)</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* LOGIN TAB */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              
              {/* Role Selector Header */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  কোন ভূমিকায় প্রবেশ করতে চান?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'student' as UserRole, label: 'শিক্ষার্থী', icon: GraduationCap },
                    { role: 'teacher' as UserRole, label: 'শিক্ষক', icon: School },
                    { role: 'admin' as UserRole, label: 'এডমিন', icon: ShieldCheck }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = selectedRoleForLogin === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => handleRoleSelectQuick(item.role)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSel
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs ring-2 ring-emerald-500/20'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${isSel ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="text-xs block">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preset Accounts for instant demo */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <span className="font-semibold text-slate-500 block mb-1.5">
                  দ্রুত টেস্ট অ্যাকাউন্ট নির্বাচন করুন:
                </span>
                <div className="space-y-1.5">
                  {users
                    .filter((u) => u.role === selectedRoleForLogin)
                    .slice(0, 3)
                    .map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setLoginEmail(u.email)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                          loginEmail === u.email
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        <span className="truncate">{u.name} ({u.role === 'student' ? `শ্রেণি ${u.classLevel}` : u.role === 'teacher' ? 'শিক্ষক' : 'এডমিন'})</span>
                        <span className="text-[10px] opacity-80 shrink-0">{u.email}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইমেইল ঠিকানা:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="আপনার নিবন্ধিত ইমেইল লিখুন"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পাসওয়ার্ড:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড লিখুন"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
                >
                  <span>লগইন করুন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                অ্যাকাউন্ট নেই?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>

            </div>
          )}

          {/* REGISTER TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  নিবন্ধনের ভূমিকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'student' as UserRole, label: 'শিক্ষার্থী', icon: GraduationCap },
                    { role: 'teacher' as UserRole, label: 'শিক্ষক', icon: School },
                    { role: 'admin' as UserRole, label: 'এডমিন', icon: ShieldCheck }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = regRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setRegRole(item.role)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSel
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class Selection for Student */}
              {regRole === 'student' && (
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      পাঠ্য শ্রেণি ও বই নির্বাচন করুন:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { cl: 6 as ClassLevel, label: 'শ্রেণি ৬ (চারুপাঠ)' },
                        { cl: 7 as ClassLevel, label: 'শ্রেণি ৭ (সপ্তবর্ণা)' },
                        { cl: 8 as ClassLevel, label: 'শ্রেণি ৮ (সাহিত্য-কণিকা)' }
                      ].map((item) => (
                        <button
                          key={item.cl}
                          type="button"
                          onClick={() => setRegClass(item.cl)}
                          className={`p-2 rounded-lg border text-[11px] font-semibold transition-all ${
                            regClass === item.cl
                              ? 'border-emerald-600 bg-emerald-700 text-white font-bold'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      শ্রেণি রোল নম্বর:
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ০১"
                      value={regRoll}
                      onChange={(e) => setRegRoll(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Designation for Teacher */}
              {regRole === 'teacher' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শিক্ষকের পদবি:
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সহকারী প্রধান শিক্ষক ও বাংলা শিক্ষক"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              {/* Common Fields */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পূর্ণ নাম:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো: জামিল হোসেন"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইমেইল ঠিকানা:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পাসওয়ার্ড:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিদ্যালয় বা প্রতিষ্ঠানের নাম:
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="+880 1700-000000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-3"
              >
                <span>নিবন্ধন সম্পন্ন করুন ও প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  লগইন করুন
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500">
        NCTB বাংলা সাহিত্য শিক্ষা প্ল্যাটফর্ম • জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড অনুসরণে নির্মিত
      </div>

    </div>
  );
};
