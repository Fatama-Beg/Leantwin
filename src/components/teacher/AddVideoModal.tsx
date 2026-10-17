import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassLevel } from '../../types';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import { X, Video, Play } from 'lucide-react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, chapters, addVideo } = useApp();
  const [classLevel, setClassLevel] = useState<ClassLevel>(6);
  const [chapterTitle, setChapterTitle] = useState('');
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('kJQP7kiw5Fk');
  const [duration, setDuration] = useState('20:00');
  const [description, setDescription] = useState('');

  if (!isOpen || !currentUser) return null;

  const currentSubject = SUBJECT_MAP[classLevel];
  const availableChapters = chapters.filter((c) => c.classLevel === classLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Clean youtube ID if full URL pasted
    let cleanId = youtubeId.trim();
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1]?.split('&')[0] || cleanId;
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1]?.split('?')[0] || cleanId;
    }

    addVideo({
      title,
      classLevel,
      subject: currentSubject.title,
      chapterTitle: chapterTitle || availableChapters[0]?.chapterTitle || 'সাধারণ আলোচনা',
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      youtubeId: cleanId || 'kJQP7kiw5Fk',
      duration: duration || '15:00',
      description: description || `${currentSubject.title} পাঠ্যবইয়ের ${chapterTitle} অধ্যায়ের পূর্ণাঙ্গ বিশ্লেষণমূলক ক্লাস।`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                নতুন ভিডিও ক্লাস যুক্ত করুন
              </h3>
              <p className="text-xs text-slate-500">শিক্ষার্থীদের জন্য অনলাইন লেকচার ভিডিও</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* Class Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              শ্রেণি ও পাঠ্যবই:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { lvl: 6 as ClassLevel, label: 'শ্রেণি ৬ (চারুপাঠ)' },
                { lvl: 7 as ClassLevel, label: 'শ্রেণি ৭ (সপ্তবর্ণা)' },
                { lvl: 8 as ClassLevel, label: 'শ্রেণি ৮ (সাহিত্য-কণিকা)' }
              ].map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => setClassLevel(item.lvl)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    classLevel === item.lvl
                      ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অধ্যায় নির্বাচন:
            </label>
            <select
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="">অধ্যায় নির্বাচন করুন...</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.chapterTitle}>
                  {ch.chapterTitle} ({ch.genre})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ক্লাসের শিরোনাম (Video Title):
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: কুলি-মজুর কবিতার উদ্দীপক ও ব্যাখ্যা"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* YouTube Video URL or ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              YouTube ভিডিও লিংক বা ID:
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: kJQP7kiw5Fk বা https://www.youtube.com/watch?v=..."
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ক্লাসের সময়কাল (Duration):
            </label>
            <input
              type="text"
              placeholder="যেমন: ১৮:৪৫"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              সংক্ষিপ্ত বিবরণ (Description):
            </label>
            <textarea
              rows={3}
              placeholder="ক্লাসের আলোচ্য বিষয় সম্পর্কে শিক্ষার্থীদের দিকনির্দেশনা..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            ভিডিও ক্লাস প্রকাশ করুন
          </button>
        </form>

      </div>
    </div>
  );
};
