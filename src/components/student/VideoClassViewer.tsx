import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoClass } from '../../types';
import { SUBJECT_MAP } from '../../data/nctbCorpus';
import {
  Video,
  Play,
  Clock,
  Eye,
  CheckCircle,
  User,
  Sparkles
} from 'lucide-react';

export const VideoClassViewer: React.FC = () => {
  const { videos, activeClass, incrementVideoViews, showToast } = useApp();
  const currentSubject = SUBJECT_MAP[activeClass];

  const classVideos = videos.filter((v) => v.classLevel === activeClass);
  const [selectedVideo, setSelectedVideo] = useState<VideoClass | null>(classVideos[0] || null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  // Update selected if class changes
  React.useEffect(() => {
    const firstForClass = videos.find((v) => v.classLevel === activeClass);
    setSelectedVideo(firstForClass || null);
  }, [activeClass, videos]);

  const handleSelectVideo = (vid: VideoClass) => {
    setSelectedVideo(vid);
    incrementVideoViews(vid.id);
  };

  const toggleCompleted = (id: string) => {
    if (completedVideos.includes(id)) {
      setCompletedVideos(completedVideos.filter((vId) => vId !== id));
      showToast('ক্লাসটি অসম্পূর্ণ হিসেবে চিহ্নিত করা হয়েছে।');
    } else {
      setCompletedVideos([...completedVideos, id]);
      showToast('অভিনন্দন! ক্লাসটি সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-600" />
            শিক্ষকের ভিডিও ক্লাস সমূহ ({currentSubject.title})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            শ্রেণি {activeClass === 6 ? '৬' : activeClass === 7 ? '৭' : '৮'}-এর বাংলা পাঠ্যবইয়ের প্রতিটি অধ্যায়ের ওপর বিষয়ভিত্তিক ভিডিও লেকচার
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-2">
          <span>সম্পন্ন হয়েছে:</span>
          <span className="font-bold text-emerald-700">
            {classVideos.filter((v) => completedVideos.includes(v.id)).length} / {classVideos.length}
          </span>
        </div>
      </div>

      {classVideos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">এই শ্রেণিতে এখনও কোনো ভিডিও ক্লাস যোগ করা হয়নি</h3>
          <p className="text-xs text-slate-500 mt-1">শিক্ষক ড্যাশবোর্ড থেকে শিক্ষক নতুন ভিডিও ক্লাস আপলোড করতে পারবেন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video Player Screen (8 Cols) */}
          {selectedVideo && (
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center border border-slate-800 shadow-md">
                {/* Embed or simulated high-fidelity player */}
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      অধ্যায়: {selectedVideo.chapterTitle}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedVideo.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleCompleted(selectedVideo.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      completedVideos.includes(selectedVideo.id)
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{completedVideos.includes(selectedVideo.id) ? 'ক্লাসটি সম্পন্ন হয়েছে' : 'সম্পন্ন চিহ্নিত করুন'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    শিক্ষক: {selectedVideo.teacherName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {selectedVideo.views} বার দেখা হয়েছে
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          )}

          {/* Video Playlist (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-800">
              প্লেলিস্ট ({classVideos.length}টি ক্লাস)
            </h4>

            <div className="space-y-2">
              {classVideos.map((vid) => {
                const isPlaying = selectedVideo?.id === vid.id;
                const isDone = completedVideos.includes(vid.id);

                return (
                  <button
                    key={vid.id}
                    onClick={() => handleSelectVideo(vid)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isPlaying
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 relative">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      {isDone && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {vid.title}
                      </h5>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span>{vid.chapterTitle}</span>
                        <span>{vid.duration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
