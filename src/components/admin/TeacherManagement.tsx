import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  School,
  Plus,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  X,
  Search
} from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  const { users, addUser, removeUser } = useApp();
  const teachers = users.filter((u) => u.role === 'teacher');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      role: 'teacher',
      designation: designation || 'সহকারী শিক্ষক (বাংলা সাহিত্য)',
      phone: phone || '+880 1800-000000',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    setName('');
    setEmail('');
    setDesignation('');
    setPhone('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <School className="w-5 h-5 text-purple-600" />
            শিক্ষক ব্যবস্থাপনা (Teacher Management)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বাংলা বিষয়ের দায়িত্বপ্রাপ্ত শিক্ষকদের তালিকা, পদবি ও নতুন শিক্ষক অন্তর্ভুক্তি
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষকের নাম বা ইমেইল খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 w-48 sm:w-64"
            />
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শিক্ষক যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {teacher.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-purple-700 block">
                      {teacher.designation || 'বাংলা শিক্ষক'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  সক্রিয়
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                {teacher.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                যুক্ত হয়েছেন: {new Date(teacher.createdAt).toLocaleDateString('bn-BD')}
              </span>
              <button
                onClick={() => removeUser(teacher.id)}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold p-1 transition-colors"
                title="শিক্ষক অপসারণ করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>রিমুভ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                নতুন শিক্ষক নিবন্ধন (Add Teacher)
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষকের পূর্ণ নাম:
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আহমদ রফিক"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইমেইল ঠিকানা:
                </label>
                <input
                  type="email"
                  required
                  placeholder="teacher@school.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পদবি বা বিষয়:
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সিনিয়র সহকারী শিক্ষক (চারুপাঠ ও সপ্তবর্ণা)"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  placeholder="+880 1800-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm mt-2"
              >
                শিক্ষক যুক্ত করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
