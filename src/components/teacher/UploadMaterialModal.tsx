import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassLevel, SubjectName } from '../../types';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, chapters, addMaterial } = useApp();
  const [classLevel, setClassLevel] = useState<ClassLevel>(6);
  const [chapterTitle, setChapterTitle] = useState('');
  const [title, setTitle] = useState('');
  const [materialType, setMaterialType] = useState<'rtf' | 'pdf' | 'notes' | 'summary'>('rtf');
  const [content, setContent] = useState('');

  if (!isOpen || !currentUser) return null;

  const currentSubject = SUBJECT_MAP[classLevel];
  const availableChapters = chapters.filter((c) => c.classLevel === classLevel);

  const handleClassChange = (lvl: ClassLevel) => {
    setClassLevel(lvl);
    const firstChapter = chapters.find((c) => c.classLevel === lvl);
    if (firstChapter) {
      setChapterTitle(firstChapter.chapterTitle);
    }
  };

  const handleUseRTFTemplate = () => {
    const ch = availableChapters.find((c) => c.chapterTitle === chapterTitle) || availableChapters[0];
    const template = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Bangla;}}
\\viewkind4\\uc1\\pard\\lang1093\\f0\\fs24
\\b ${currentSubject.title} - শ্রেণি ${classLevel === 6 ? '৬' : classLevel === 7 ? '৭' : '৮'}\\b0\\par
\\b অধ্যায়: ${chapterTitle || ch?.chapterTitle}\\b0\\par
\\b শিক্ষক: ${currentUser.name}\\b0\\par
\\par
\\b সারসংক্ষেপ:\\b0\\par
${ch?.summary || 'এখানে পাঠ্যবইয়ের সারসংক্ষেপ লিখুন...'}\\par
\\par
\\b মূল শিক্ষা:\\b0\\par
${ch?.moralLesson || 'এখানে মূল শিক্ষা লিখুন...'}\\par
}`;
    setContent(template);
    setTitle(`${chapterTitle || ch?.chapterTitle}: শিক্ষকের বিশেষ ক্লাসনোট ও শব্দার্থ গাইড`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addMaterial({
      title,
      classLevel,
      subject: currentSubject.title,
      chapterTitle: chapterTitle || availableChapters[0]?.chapterTitle || 'সাধারণ অধ্যায়',
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      type: materialType,
      content
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                নতুন পাঠ্য উপাদান ও নোট আপলোড
              </h3>
              <p className="text-xs text-slate-500">শিক্ষক হিসেবে শিক্ষার্থীদের জন্য সামগ্রী প্রদান</p>
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
          
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              শ্রেণি ও পাঠ্যবই নির্বাচন:
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
                  onClick={() => handleClassChange(item.lvl)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    classLevel === item.lvl
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              সংশ্লিষ্ট অধ্যায় নির্বাচন:
            </label>
            <select
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">অধ্যায় নির্বাচন করুন...</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.chapterTitle}>
                  {ch.chapterTitle} ({ch.genre} - {ch.author})
                </option>
              ))}
            </select>
          </div>

          {/* Material Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              উপাদানের ধরন:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'rtf' as const, label: 'RTF ফাইল' },
                { type: 'pdf' as const, label: 'পিডিএফ গাইড' },
                { type: 'notes' as const, label: 'ক্লাসনোট' },
                { type: 'summary' as const, label: 'সারসংক্ষেপ' }
              ].map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setMaterialType(t.type)}
                  className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                    materialType === t.type
                      ? 'border-blue-600 bg-blue-600 text-white font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              উপাদানের শিরোনাম (Title):
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: সততার পুরস্কার অধ্যায়ের সৃজনশীল প্রশ্নোত্তর গাইড"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content & RTF template loader */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                বিষয়বস্তু বা RTF কোড:
              </label>
              <button
                type="button"
                onClick={handleUseRTFTemplate}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                + NCTB টেমপ্লেট লোড করুন
              </button>
            </div>
            <textarea
              rows={6}
              required
              placeholder="এখানে নোটের বিস্তারিত বা RTF টেক্সট লিখুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            পাঠ্য উপাদান আপলোড নিশ্চিত করুন
          </button>
        </form>

      </div>
    </div>
  );
};
