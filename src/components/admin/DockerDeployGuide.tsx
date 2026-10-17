import React, { useState } from 'react';
import { LOCAL_DEPLOY_FILES, DeployFile } from '../../data/localDeployFiles';
import { useApp } from '../../context/AppContext';
import {
  Server,
  Terminal,
  Copy,
  Check,
  Download,
  Database,
  Cpu,
  Layers,
  ExternalLink,
  Code2
} from 'lucide-react';

export const DockerDeployGuide: React.FC = () => {
  const { showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<DeployFile>(LOCAL_DEPLOY_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('কোড ক্লিপবোর্ডে কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = (file: DeployFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`"${file.name}" ফাইলটি সফলভাবে ডাউনলোড হয়েছে।`);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-mono text-xs font-bold border border-teal-400/30">
              LOCAL MACHINE DEPLOYMENT HUB
            </span>
            <span className="text-xs text-slate-400">
              Python 3.11 + Docker + PostgreSQL + Qwen 2.5-VL:3b
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            লোকাল মেশিনে সম্পূর্ণ প্রজেক্ট চালানোর পূর্ণাঙ্গ ফাইল ও গাইড
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            আপনার মেশিনে বা ক্লায়েন্ট ডেমোতে চালানোর জন্য প্রয়োজনীয় সমস্ত Docker, Python FastAPI এবং PostgreSQL স্ক্রিপ্ট নিচে দেওয়া হলো। এক ক্লিকে কোড কপি অথবা ফাইল ডাউনলোড করতে পারেন।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="block text-xl font-mono font-bold text-teal-300">FastAPI</span>
            <span className="text-[10px] text-slate-400">Python Backend</span>
          </div>
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="block text-xl font-mono font-bold text-blue-400">PostgreSQL</span>
            <span className="text-[10px] text-slate-400">Relational DB</span>
          </div>
        </div>
      </div>

      {/* 3 Simple Local Run Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
            ১
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            Ollama ও Qwen 2.5 মডেল
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার মেশিনে Ollama ডাউনলোড করে টার্মিনালে নিচের কমান্ডটি রান করুন:
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 text-teal-300 font-mono text-xs flex items-center justify-between">
            <code>ollama run qwen2.5vl:3b</code>
            <button
              onClick={() => handleCopy('ollama run qwen2.5vl:3b')}
              className="text-slate-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-black text-sm flex items-center justify-center">
            ২
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            Docker Compose বিল্ড ও রান
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            <code className="text-slate-800 font-semibold">python-backend</code> ফোল্ডারে গিয়ে Docker চালু করুন:
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 text-teal-300 font-mono text-xs flex items-center justify-between">
            <code>docker-compose up -d --build</code>
            <button
              onClick={() => handleCopy('cd python-backend && docker-compose up -d --build')}
              className="text-slate-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-black text-sm flex items-center justify-center">
            ৩
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            ফ্রন্টএন্ড ইন্টারফেস ওপেন
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            ব্রাউজারে লোকালহোস্ট ওপেন করুন এবং সবাইকে সরাসরি ডেমো প্রদর্শন করুন:
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 text-teal-300 font-mono text-xs flex items-center justify-between">
            <code>http://localhost:3000</code>
            <span className="text-[10px] text-emerald-400 font-bold">READY</span>
          </div>
        </div>

      </div>

      {/* Interactive Code Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* File Tabs Header */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {LOCAL_DEPLOY_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(selectedFile.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
            </button>

            <button
              onClick={() => handleDownloadFile(selectedFile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* File Description */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>{selectedFile.description}</span>
          <span className="font-mono text-[11px] text-slate-500">পাথ: python-backend/{selectedFile.path}</span>
        </div>

        {/* Code Block */}
        <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed">
          <pre>{selectedFile.content}</pre>
        </div>

      </div>

    </div>
  );
};
