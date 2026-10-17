import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, ClassLevel, SubjectName } from '../types';
import { X, UserPlus, LogIn, GraduationCap, School, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { users, currentUser, setCurrentUser, addUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [classLevel, setClassLevel] = useState<ClassLevel>(6);
  
  // Registration form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      role: selectedRole,
      classLevel: selectedRole === 'student' ? classLevel : undefined,
      designation: selectedRole === 'teacher' ? (designation || 'সহকারী শিক্ষক (বাংলা)') : undefined,
      phone: phone || '+880 1700-000000',
      avatar: selectedRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : selectedRole === 'teacher'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    });

    onClose();
  };

  const handleSelectDemoUser = (user: typeof users[0]) => {
    setCurrentUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              ব
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                {mode === 'login' ? 'রোল ভিত্তিক লগইন ও প্রোফাইল পরিবর্তন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
              </h3>
              <p className="text-xs text-slate-500">NCTB বাংলা শিক্ষা প্ল্যাটফর্ম</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl my-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 inline-block mr-1.5" />
            দ্রুত লগইন (রোল অনুযায়ী)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 inline-block mr-1.5" />
            নতুন নিবন্ধন (Register)
          </button>
        </div>

        {mode === 'login' ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">
              সরাসরি যেকোনো রোলে প্রবেশ করতে নিচের প্রোফাইলগুলো থেকে নির্বাচন করুন:
            </p>

            {/* Quick Role Sections */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                অ্যাডমিন (Admin)
              </label>
              {users
                .filter((u) => u.role === 'admin')
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      currentUser?.id === u.id
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{u.name}</span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          সিস্টেম অ্যাডমিন
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    {currentUser?.id === u.id && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                শিক্ষকবৃন্দ (Teachers)
              </label>
              {users
                .filter((u) => u.role === 'teacher')
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      currentUser?.id === u.id
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{u.name}</span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          শিক্ষক
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{u.designation || u.email}</p>
                    </div>
                    {currentUser?.id === u.id && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                শিক্ষার্থীবৃন্দ (Students - শ্রেণি ৬, ৭, ৮)
              </label>
              {users
                .filter((u) => u.role === 'student')
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      currentUser?.id === u.id
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{u.name}</span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          শ্রেণি {u.classLevel === 6 ? '৬ (চারুপাঠ)' : u.classLevel === 7 ? '৭ (সপ্তবর্ণা)' : '৮ (সাহিত্য-কণিকা)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    {currentUser?.id === u.id && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                আপনার ভূমিকা নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'student' as UserRole, label: 'শিক্ষার্থী', icon: GraduationCap },
                  { role: 'teacher' as UserRole, label: 'শিক্ষক', icon: School },
                  { role: 'admin' as UserRole, label: 'অ্যাডমিন', icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSel
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedRole === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  পাঠ্য শ্রেণি নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { cl: 6 as ClassLevel, label: 'শ্রেণি ৬ (চারুপাঠ)' },
                    { cl: 7 as ClassLevel, label: 'শ্রেণি ৭ (সপ্তবর্ণা)' },
                    { cl: 8 as ClassLevel, label: 'শ্রেণি ৮ (সাহিত্য-কণিকা)' }
                  ].map((lvl) => (
                    <button
                      key={lvl.cl}
                      type="button"
                      onClick={() => setClassLevel(lvl.cl)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                        classLevel === lvl.cl
                          ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedRole === 'teacher' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পদবি বা বিষয়:
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সিনিয়র সহকারী শিক্ষক (বাংলা সাহিত্য)"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                পূর্ণ নাম:
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মো: আরিফুল ইসলাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ইমেইল ঠিকানা:
              </label>
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                মোবাইল নম্বর:
              </label>
              <input
                type="text"
                placeholder="+880 1700-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              নিবন্ধন সম্পন্ন করুন ও প্রবেশ করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
