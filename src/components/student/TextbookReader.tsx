import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NCTBChapter } from '../../types';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import {
  BookOpen,
  FileText,
  Download,
  HelpCircle,
  Sparkles,
  BookMarked,
  Lightbulb,
  Tag,
  Check
} from 'lucide-react';

interface TextbookReaderProps {
  onAskAIAboutChapter?: (chapter: NCTBChapter) => void;
}

export const TextbookReader: React.FC<TextbookReaderProps> = ({ onAskAIAboutChapter }) => {
  const { chapters, activeClass, showToast } = useApp();
  const currentSubject = SUBJECT_MAP[activeClass];

  const classChapters = chapters.filter((c) => c.classLevel === activeClass);
  const [selectedChapter, setSelectedChapter] = useState<NCTBChapter>(classChapters[0] || chapters[0]);

  // Update selected if class changes
  React.useEffect(() => {
    const firstForClass = chapters.find((c) => c.classLevel === activeClass);
    if (firstForClass) {
      setSelectedChapter(firstForClass);
    }
  }, [activeClass, chapters]);

  const handleDownloadRTF = (chapter: NCTBChapter) => {
    // Generate valid RTF file blob and trigger download
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Bangla;}}
\\viewkind4\\uc1\\pard\\lang1093\\f0\\fs24
\\b ${chapter.bookTitle} - শ্রেণি ${chapter.classLevel === 6 ? '৬' : chapter.classLevel === 7 ? '৭' : '৮'}\\b0\\par
\\b অধ্যায়: ${chapter.chapterTitle}\\b0\\par
\\b লেখক/কবি: ${chapter.author} (${chapter.genre})\\b0\\par
\\par
\\b সারসংক্ষেপ:\\b0\\par
${chapter.summary}\\par
\\par
\\b মূল শিক্ষা:\\b0\\par
${chapter.moralLesson}\\par
\\par
\\b শব্দার্থ ও টীকাসমূহ:\\b0\\par
${chapter.wordMeanings.map((w, idx) => `${idx + 1}. ${w.word} - ${w.meaning}`).join('\\par\n')}\\par
\\par
\\b মূল পাঠাংশ:\\b0\\par
${chapter.fullTextSnippet}\\par
}`;

    const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = chapter.rtfFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`"${chapter.rtfFileName}" সফলভাবে ডাউনলোড হয়েছে।`);
  };

  return (
    <div className="space-y-6">
      {/* Book Header Banner */}
      <div className={`p-6 rounded-2xl bg-gradient-to-r ${currentSubject.color} text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)
            </span>
            <span className="text-xs text-white/80 font-medium">
              শ্রেণি {activeClass === 6 ? '৬' : activeClass === 7 ? '৭' : '৮'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentSubject.title} পাঠ্যবই
          </h2>
          <p className="text-white/80 text-sm max-w-xl">
            {currentSubject.description}। প্রতিটি গল্পের শব্দার্থ, মূলভাব ও RTF ফাইল সংরক্ষিত আছে।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center">
            <span className="block text-2xl font-black">{classChapters.length}</span>
            <span className="text-[11px] text-white/80">অধ্যায় সংকলিত</span>
          </div>
        </div>
      </div>

      {/* Main Split: Left Chapter List, Right Chapter Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chapters Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-emerald-600" />
            সূচিপত্র ({currentSubject.title})
          </h3>

          <div className="space-y-2">
            {classChapters.map((ch, idx) => {
              const isSelected = selectedChapter?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{ch.chapterTitle}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      {ch.genre}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pl-8">
                    <span>লেখক: {ch.author}</span>
                    <span className="text-[11px]">পৃষ্ঠা: {ch.pageNumber}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Chapter Detail View */}
        {selectedChapter && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Chapter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {selectedChapter.genre}
                  </span>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs font-medium text-slate-500">
                    পাঠ্যবই পৃষ্ঠা: {selectedChapter.pageNumber}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {selectedChapter.chapterTitle}
                </h2>
                <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                  ✍️ {selectedChapter.author}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadRTF(selectedChapter)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  title="RTF ফরম্যাটে নোট ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RTF ফাইল ডাউনলোড</span>
                </button>
                {onAskAIAboutChapter && (
                  <button
                    onClick={() => onAskAIAboutChapter(selectedChapter)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>AI-কে প্রশ্ন করুন</span>
                  </button>
                )}
              </div>
            </div>

            {/* Moral / Key Lesson Highlight */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-0.5">
                  মূল শিক্ষা ও বার্তা (Moral Lesson)
                </h4>
                <p className="text-sm leading-relaxed font-medium">
                  {selectedChapter.moralLesson}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                গল্প/কবিতার মূলভাব ও সারসংক্ষেপ
              </h4>
              <p className="text-slate-700 leading-relaxed text-sm bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                {selectedChapter.summary}
              </p>
            </div>

            {/* Dictionary: Word Meanings */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                শব্দার্থ ও টীকা (Word Meanings)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedChapter.wordMeanings.map((wm, wIdx) => (
                  <div
                    key={wIdx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white hover:border-emerald-200 transition-colors text-xs"
                  >
                    <span className="font-bold text-slate-900">{wm.word}</span>
                    <span className="text-slate-600 italic">{wm.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Excerpt */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                পাঠ্যবইয়ের নির্বাচিত অংশ (Text Excerpt)
              </h4>
              <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 font-serif leading-relaxed text-sm border border-emerald-900">
                "{selectedChapter.fullTextSnippet}"
              </div>
            </div>

            {/* Key Syllabus Topics */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 mr-2">সিলেবাসের মূল বিষয়বস্তু:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {selectedChapter.keyTopics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
