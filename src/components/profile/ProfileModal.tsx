import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Camera, Save, School, Phone, Mail, Award, BookOpen } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [school, setSchool] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || PRESET_AVATARS[0]);
      setSchool(currentUser.school || 'মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়');
      setRollNumber(currentUser.rollNumber || '০১');
      setDesignation(currentUser.designation || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      avatar,
      school,
      rollNumber: currentUser.role === 'student' ? rollNumber : undefined,
      designation: currentUser.role === 'teacher' ? designation : undefined,
      bio
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                আমার প্রোফাইল ও তথ্য পরিবর্তন
              </h3>
              <p className="text-xs text-slate-500">
                ভূমিকা: <strong className="text-emerald-700 uppercase">{currentUser.role === 'admin' ? 'এডমিন' : currentUser.role === 'teacher' ? 'শিক্ষক' : 'শিক্ষার্থী'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* Avatar Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              প্রোফাইল ছবি (Profile Photo):
            </label>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={avatar || PRESET_AVATARS[0]}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
              />
              <div className="flex-1 space-y-1">
                <input
                  type="url"
                  placeholder="ছবির সরাসরি লিংক (URL) লিখুন..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-400 block">
                  নিচের প্রস্তুত ছবিগুলো থেকেও পছন্দ করতে পারেন:
                </span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((avUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(avUrl)}
                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 shrink-0 transition-transform ${
                    avatar === avUrl ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avUrl} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পূর্ণ নাম:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Email (Readonly for identification) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ইমেইল ঠিকানা (ইউজার আইডি):
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              মোবাইল নম্বর:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* School / Institution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিদ্যালয় বা শিক্ষা প্রতিষ্ঠানের নাম:
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="যেমন: মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Role Specific Details */}
          {currentUser.role === 'student' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রোল নম্বর / শ্রেণি আইডি:
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="যেমন: ০৫"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {currentUser.role === 'teacher' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পদবি ও দায়িত্ব:
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="যেমন: সিনিয়র সহকারী শিক্ষক (বাংলা)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              সংক্ষিপ্ত পরিচিতি (Bio):
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="নিজের সম্পর্কে এক বা দুই লাইন..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </form>

      </div>
    </div>
  );
};
