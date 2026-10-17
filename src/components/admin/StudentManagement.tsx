import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassLevel, User } from '../../types';
import {
  GraduationCap,
  Plus,
  Trash2,
  Mail,
  Phone,
  Search,
  X,
  Award
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { users, addUser, removeUser, submissions } = useApp();
  const [selectedClassFilter, setSelectedClassFilter] = useState<ClassLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(6);
  const [phone, setPhone] = useState('');

  const students = users.filter((u) => u.role === 'student');

  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClassFilter === 'all' || s.classLevel === selectedClassFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      role: 'student',
      classLevel,
      phone: phone || '+880 1700-000000',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    });

    setName('');
    setEmail('');
    setPhone('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            শিক্ষার্থী ব্যবস্থাপনা (Student Management)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            শ্রেণি ৬, ৭ ও ৮-এর শিক্ষার্থীদের তথ্য, কুইজ পারফরম্যান্স ও শিক্ষার্থী অন্তর্ভুক্তি
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'all' as const, label: 'সকল শ্রেণি' },
              { id: 6 as const, label: 'শ্রেণি ৬ (চারুপাঠ)' },
              { id: 7 as const, label: 'শ্রেণি ৭ (সপ্তবর্ণা)' },
              { id: 8 as const, label: 'শ্রেণি ৮ (সাহিত্য-কণিকা)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedClassFilter(f.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  selectedClassFilter === f.id
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শিক্ষার্থী যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষার্থী খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            মোট প্রদর্শিত: {filteredStudents.length} জন
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">শিক্ষার্থী</th>
                <th className="py-3 px-4">শ্রেণি ও পাঠ্যবই</th>
                <th className="py-3 px-4">ইমেইল ও যোগাযোগ</th>
                <th className="py-3 px-4">কুইজ সম্পন্ন</th>
                <th className="py-3 px-4">নিবন্ধন তারিখ</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const stSubmissions = submissions.filter((s) => s.studentId === st.id);
                const avgScore = stSubmissions.length > 0
                  ? Math.round(stSubmissions.reduce((a, b) => a + b.percentage, 0) / stSubmissions.length)
                  : null;

                return (
                  <tr key={st.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-bold text-slate-900">{st.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        st.classLevel === 6
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.classLevel === 7
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        শ্রেণি {st.classLevel === 6 ? '৬ (চারুপাঠ)' : st.classLevel === 7 ? '৭ (সপ্তবর্ণা)' : '৮ (সাহিত্য-কণিকা)'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{st.email}</div>
                      <div className="text-[11px] text-slate-400">{st.phone || '–'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{stSubmissions.length}টি কুইজ</span>
                        {avgScore !== null && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                            (গড়: {avgScore}%)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(st.createdAt).toLocaleDateString('bn-BD')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => removeUser(st.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded-md transition-colors"
                        title="শিক্ষার্থী অপসারণ করুন"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                নতুন শিক্ষার্থী যোগ করুন
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শ্রেণি ও পাঠ্যবই নির্বাচন:
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
                      onClick={() => setClassLevel(item.cl)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                        classLevel === item.cl
                          ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষার্থীর পূর্ণ নাম:
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর হাসান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইমেইল ঠিকানা:
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm mt-2"
              >
                শিক্ষার্থী যুক্ত করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
