import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import {
  Sparkles,
  Send,
  BookOpen,
  Cpu,
  BookmarkCheck,
  HelpCircle,
  CheckCircle,
  FileText
} from 'lucide-react';

export const AIBanglaTutor: React.FC = () => {
  const { ragMessages, sendRAGQuery, isRAGLoading, activeClass } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [preferredModel, setPreferredModel] = useState<'qwen2.5vl:3b' | 'gemini-2.5-flash'>('qwen2.5vl:3b');

  const currentSubject = SUBJECT_MAP[activeClass];

  const suggestedPrompts = {
    6: [
      'সততার পুরস্কার গল্পের মূল শিক্ষা কী?',
      'মানুষ জাতি কবিতায় কবি সত্যেন্দ্রনাথ দত্ত কী বার্তা দিয়েছেন?',
      'মিনু গল্পে শুকতারার সাথে মিনুর কী সম্পর্ক?',
      'ঝিঙে ফুল কবিতায় প্রকৃতির রূপ কেমন করে ফুটে উঠেছে?'
    ],
    7: [
      'কাবুলিওয়ালা গল্পে রহমত ও মিনির বন্ধুত্বের স্বরূপ ব্যাখ্যা করো।',
      'কুলি-মজুর কবিতায় কবি কাজী নজরুল ইসলাম শ্রমজীবী মানুষের অবদান কীভাবে তুলে ধরেছেন?',
      'মরু-ভাস্কর প্রবন্ধে হযরত মুহাম্মদ (স.)-এর কোন গুণগুলো তুলে ধরা হয়েছে?',
      'আমার বাড়ি কবিতায় গ্রামীণ আতিথেয়তার কী বর্ণনা রয়েছে?'
    ],
    8: [
      'অতিথির স্মৃতি গল্পে অবলা প্রাণীর প্রতি মমত্ববোধ কীভাবে ফুটে উঠেছে?',
      'মানব-ধর্ম কবিতায় লালন শাহের অসাম্প্রদায়িক দর্শনের মূলভাব কী?',
      'বঙ্গভূমির প্রতি কবিতায় মাইকেল মধুসূদন দত্তের দেশপ্রেম বর্ণনা করো।',
      'সুখী মানুষ নাটিকায় সুখী মানুষের সন্ধান পাওয়ার তাৎপর্য কী?'
    ]
  }[activeClass] || [];

  const handleSend = (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isRAGLoading) return;
    sendRAGQuery(text, preferredModel);
    if (!queryToSend) {
      setInputQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight">AI বাংলা গৃহশিক্ষক (RAG Tutor)</h3>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                NCTB সিলেবাস সমর্থিত
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {currentSubject.title} (শ্রেণি {activeClass}) পাঠ্যবইয়ের নির্ভুল রেফারেন্স ও উদ্ধৃতিসহ প্রশ্নোত্তর
            </p>
          </div>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
          <Cpu className="w-3.5 h-3.5 text-teal-300 ml-1.5" />
          <button
            onClick={() => setPreferredModel('qwen2.5vl:3b')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              preferredModel === 'qwen2.5vl:3b'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Qwen 2.5-VL 3B (Docker/Ollama Local)"
          >
            Qwen 2.5 (3B)
          </button>
          <button
            onClick={() => setPreferredModel('gemini-2.5-flash')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              preferredModel === 'gemini-2.5-flash'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Google Gemini API Engine"
          >
            Gemini Flash
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          নমুনা প্রশ্ন:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isRAGLoading}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full border border-slate-200/90 whitespace-nowrap transition-colors shadow-2xs font-medium shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {ragMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-emerald-300 border border-slate-700'
                }`}
              >
                {isUser ? 'তু' : 'AI'}
              </div>

              {/* Message Box */}
              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Citation & Sources (For RAG Assistant responses) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NCTB পাঠ্যবই উৎস ও উদ্ধৃতি (RAG Citations):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 text-xs text-slate-700"
                        >
                          <div className="flex items-center justify-between font-semibold text-emerald-950 mb-1">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-emerald-700" />
                              {src.bookTitle}: {src.chapterTitle}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-900 font-bold">
                              {src.relevance}% ম্যাচ
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2 italic text-[11px]">
                            "{src.snippet}"
                          </p>
                          <div className="mt-1 text-[10px] text-slate-400">
                            লেখক: {src.author}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <span className="font-mono">ইঞ্জিন: {msg.modelUsed}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isRAGLoading && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 w-fit text-xs text-slate-600 animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>NCTB পাঠ্যবই ডেটাবেজ (RAG) অনুসন্ধান করা হচ্ছে...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`শ্রেণি ${activeClass}-এর ${currentSubject.title} পাঠ্যবই নিয়ে যেকোনো প্রশ্ন করুন...`}
          className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isRAGLoading}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>পাঠান</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
