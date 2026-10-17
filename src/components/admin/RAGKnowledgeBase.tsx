import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassLevel, NCTBChapter } from '../../types';
import { searchNCTBCorpus } from '../../utils/ragEngine';
import {
  Database,
  Search,
  Sparkles,
  BookOpen,
  FileCode,
  Tag,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

export const RAGKnowledgeBase: React.FC = () => {
  const { chapters } = useApp();
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'all'>('all');
  const [testQuery, setTestQuery] = useState('সততার শিক্ষা');
  const [selectedChapter, setSelectedChapter] = useState<NCTBChapter>(chapters[0]);

  const filteredChapters = chapters.filter(
    (c) => selectedClass === 'all' || c.classLevel === selectedClass
  );

  const testResults = testQuery.trim()
    ? searchNCTBCorpus(testQuery, selectedClass === 'all' ? undefined : selectedClass)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 font-mono text-xs font-bold border border-teal-400/30">
              RAG KNOWLEDGE BASE
            </span>
            <span className="text-xs text-slate-400">PostgreSQL nctb_knowledge_chunks</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            NCTB পাঠ্যবই RAG নলেজবেস ও ভেক্টর ইনডেক্স
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            চারুপাঠ (৬ষ্ঠ), সপ্তবর্ণা (৭ম), এবং সাহিত্য-কণিকা (৮ম) পাঠ্যবইয়ের অধ্যায়সমূহ, শব্দার্থ ও মূলভাব সংরক্ষিত ডাটাবেজ। Qwen 2.5-VL এবং Gemini মডেল এই ভান্ডার থেকে তাৎক্ষণিক রেফারেন্স সংগ্রহ করে।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-center">
            <span className="block text-2xl font-black text-teal-300">{chapters.length}</span>
            <span className="text-[10px] text-slate-300 font-medium">ইনডেক্সড অধ্যায়</span>
          </div>
        </div>
      </div>

      {/* RAG Test Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            RAG সিমুলেশন ও রিট্রিভাল টেস্ট স্যান্ডবক্স (Live Semantic Retrieval Test)
          </h3>
          <span className="text-xs text-slate-400 font-mono">BM25 / Keyword Similarity</span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="টেস্ট কুয়েরি লিখুন (যেমন: কাবুলিওয়ালা গল্পে মিনির সম্পর্ক, অন্ধ ব্যক্তির সততা)..."
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {testResults.map((res, rIdx) => (
              <div
                key={rIdx}
                className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-teal-950">
                  <span>{res.chapter.chapterTitle} ({res.chapter.bookTitle})</span>
                  <span className="px-1.5 py-0.5 rounded bg-teal-200 text-teal-900 text-[10px] font-mono">
                    স্কোর: {res.score}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px]">
                  "{res.snippet}"
                </p>
                <div className="text-[10px] text-slate-400">
                  ম্যাচিং টোকেন: {res.matchedTerms.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapters Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chapters by Class */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              সংরক্ষিত পাঠ্যবই অধ্যায়সমূহ
            </h4>
            
            {/* Class filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as any)}
              className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">সকল বই</option>
              <option value="6">চারুপাঠ (৬ষ্ঠ)</option>
              <option value="7">সপ্তবর্ণা (৭ম)</option>
              <option value="8">সাহিত্য-কণিকা (৮ম)</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredChapters.map((ch) => {
              const isSelected = selectedChapter?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {ch.chapterTitle}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {ch.bookTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>লেখক: {ch.author}</span>
                    <span className="font-mono text-[10px] text-teal-700">{ch.rtfFileName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chunk Inspector */}
        {selectedChapter && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {selectedChapter.bookTitle} (শ্রেণি {selectedChapter.classLevel})
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {selectedChapter.chapterTitle} - {selectedChapter.author}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                পৃষ্ঠা: {selectedChapter.pageNumber}
              </span>
            </div>

            {/* Moral lesson */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <span className="font-bold text-amber-900 block mb-0.5">📌 মূল শিক্ষা (Moral Vector):</span>
              {selectedChapter.moralLesson}
            </div>

            {/* Summary */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-800">সারসংক্ষেপ (RAG Context Summary):</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedChapter.summary}
              </p>
            </div>

            {/* Word Meanings dictionary */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-800">শব্দার্থ ও টীকা ডিকশনারি ({selectedChapter.wordMeanings.length}টি শব্দ):</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {selectedChapter.wordMeanings.map((wm, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px]">
                    <strong className="text-slate-900">{wm.word}</strong>: <span className="text-slate-600">{wm.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RTF File Metadata */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <FileCode className="w-3.5 h-3.5 text-teal-600" />
                ফাইল: {selectedChapter.rtfFileName}
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> ইনডেক্সিং সম্পূর্ণ
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
