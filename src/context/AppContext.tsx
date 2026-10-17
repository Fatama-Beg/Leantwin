import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ClassLevel,
  NCTBChapter,
  ClassMaterial,
  VideoClass,
  Quiz,
  QuizSubmission,
  RAGQueryMessage
} from '../types';
import { INITIAL_USERS } from '../data/initialUsers';
import { INITIAL_MATERIALS, INITIAL_VIDEOS } from '../data/initialMaterials';
import { INITIAL_QUIZZES, INITIAL_SUBMISSIONS } from '../data/initialQuizzes';
import { NCTB_CHAPTERS } from '../data/nctbCorpus';
import { searchNCTBCorpus, generateBengaliAnswerFromContext } from '../utils/ragEngine';
import { evaluateQuizSubmission, QuizEvaluationResult } from '../utils/quizEvaluation';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password?: string, preferredRole?: UserRole) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'status'>) => User;
  removeUser: (userId: string) => void;
  activeClass: ClassLevel;
  setActiveClass: (cl: ClassLevel) => void;
  materials: ClassMaterial[];
  addMaterial: (mat: Omit<ClassMaterial, 'id' | 'uploadedAt' | 'downloadsCount'>) => void;
  removeMaterial: (id: string) => void;
  incrementMaterialDownloads: (id: string) => void;
  videos: VideoClass[];
  addVideo: (vid: Omit<VideoClass, 'id' | 'createdAt' | 'views'>) => void;
  removeVideo: (id: string) => void;
  incrementVideoViews: (id: string) => void;
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  removeQuiz: (id: string) => void;
  submissions: QuizSubmission[];
  submitQuiz: (quizId: string, userAnswers: number[]) => QuizEvaluationResult;
  ragMessages: RAGQueryMessage[];
  sendRAGQuery: (query: string, preferredModel?: 'gemini-2.5-flash' | 'qwen2.5vl:3b') => Promise<void>;
  isRAGLoading: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  chapters: NCTBChapter[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nctb_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('nctb_current_user_id');
    if (!savedId) return null;
    return users.find((u) => u.id === savedId) || null;
  });

  const [activeClass, setActiveClass] = useState<ClassLevel>(() => {
    if (currentUser?.classLevel) return currentUser.classLevel;
    return 6;
  });

  const [materials, setMaterials] = useState<ClassMaterial[]>(() => {
    const saved = localStorage.getItem('nctb_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [videos, setVideos] = useState<VideoClass[]>(() => {
    const saved = localStorage.getItem('nctb_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('nctb_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem('nctb_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [ragMessages, setRagMessages] = useState<RAGQueryMessage[]>([
    {
      id: 'rag-welcome',
      sender: 'assistant',
      text: 'আসসালামু আলাইকুম! আমি তোমার NCTB বাংলা শিক্ষক ও AI সহকারী। তুমি ষষ্ঠ শ্রেণির "চারুপাঠ", সপ্তম শ্রেণির "সপ্তবর্ণা" অথবা অষ্টম শ্রেণির "সাহিত্য-কণিকা" বইয়ের যেকোনো গল্প, কবিতা, শব্দার্থ বা মূলভাব নিয়ে প্রশ্ন করতে পারো।',
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'qwen2.5vl:3b'
    }
  ]);

  const [isRAGLoading, setIsRAGLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('nctb_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nctb_current_user_id', currentUser.id);
      if (currentUser.classLevel) {
        setActiveClass(currentUser.classLevel);
      }
    } else {
      localStorage.removeItem('nctb_current_user_id');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nctb_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('nctb_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('nctb_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('nctb_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const login = (email: string, password?: string, preferredRole?: UserRole): boolean => {
    const found = users.find((u) => {
      if (preferredRole && u.role !== preferredRole) return false;
      return u.email.toLowerCase() === email.trim().toLowerCase();
    });

    if (found) {
      setCurrentUser(found);
      if (found.classLevel) {
        setActiveClass(found.classLevel);
      }
      showToast(`স্বাগতম, ${found.name}! আপনি সফলভাবে প্রবেশ করেছেন।`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('আপনি লগআউট করেছেন।');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    showToast('আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।');
  };

  const addUser = (newUser: Omit<User, 'id' | 'createdAt' | 'status'>): User => {
    const user: User = {
      ...newUser,
      id: `usr-${newUser.role}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setUsers((prev) => [user, ...prev]);
    showToast(`"${user.name}" সফলভাবে যুক্ত হয়েছেন।`);
    return user;
  };

  const removeUser = (userId: string) => {
    const toRemove = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`"${toRemove?.name || 'ব্যবহারকারী'}" সফলভাবে অপসারিত হয়েছেন।`);
  };

  const addMaterial = (newMat: Omit<ClassMaterial, 'id' | 'uploadedAt' | 'downloadsCount'>) => {
    const material: ClassMaterial = {
      ...newMat,
      id: `mat-${Date.now().toString(36)}`,
      uploadedAt: new Date().toISOString(),
      downloadsCount: 0
    };
    setMaterials((prev) => [material, ...prev]);
    showToast(`পাঠ্য উপাদান "${material.title}" আপলোড সম্পন্ন হয়েছে।`);
  };

  const removeMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('পাঠ্য উপাদানটি মুছে ফেলা হয়েছে।');
  };

  const incrementMaterialDownloads = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m))
    );
  };

  const addVideo = (newVid: Omit<VideoClass, 'id' | 'createdAt' | 'views'>) => {
    const video: VideoClass = {
      ...newVid,
      id: `vid-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      views: 0
    };
    setVideos((prev) => [video, ...prev]);
    showToast(`ভিডিও ক্লাস "${video.title}" যুক্ত করা হয়েছে।`);
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    showToast('ভিডিও ক্লাসটি মুছে ফেলা হয়েছে।');
  };

  const incrementVideoViews = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, views: v.views + 1 } : v))
    );
  };

  const addQuiz = (newQuiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const quiz: Quiz = {
      ...newQuiz,
      id: `quiz-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    setQuizzes((prev) => [quiz, ...prev]);
    showToast(`নতুন কুইজ "${quiz.title}" সফলভাবে তৈরি হয়েছে।`);
  };

  const removeQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    showToast('কুইজটি মুছে ফেলা হয়েছে।');
  };

  const submitQuiz = (quizId: string, userAnswers: number[]): QuizEvaluationResult => {
    const targetQuiz = quizzes.find((q) => q.id === quizId);
    if (!targetQuiz) throw new Error('কুইজ পাওয়া যায়নি');
    if (!currentUser) throw new Error('প্রথমে লগইন করুন');

    const result = evaluateQuizSubmission(targetQuiz, userAnswers, currentUser);
    setSubmissions((prev) => [result, ...prev]);
    showToast(`কুইজ ফলাফল: ${result.evaluation.score}/${result.evaluation.totalQuestions} (${result.evaluation.percentage}%)`);
    return result.evaluation;
  };

  const sendRAGQuery = async (
    query: string,
    preferredModel: 'gemini-2.5-flash' | 'qwen2.5vl:3b' = 'qwen2.5vl:3b'
  ) => {
    if (!query.trim()) return;

    const userMsg: RAGQueryMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      classLevel: activeClass
    };

    setRagMessages((prev) => [...prev, userMsg]);
    setIsRAGLoading(true);

    try {
      let responseData: any = null;
      try {
        const resp = await fetch('/api/rag/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            class_level: activeClass,
            model: preferredModel
          })
        });
        if (resp.ok) {
          responseData = await resp.json();
        }
      } catch (err) {
        // Fall back to client-side RAG engine
      }

      if (responseData && responseData.answer) {
        const assistantMsg: RAGQueryMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          text: responseData.answer,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
          classLevel: activeClass,
          sources: responseData.sources,
          modelUsed: responseData.model_used || preferredModel
        };
        setRagMessages((prev) => [...prev, assistantMsg]);
      } else {
        const matches = searchNCTBCorpus(query, activeClass);
        const { answer, sources } = generateBengaliAnswerFromContext(query, matches);

        const assistantMsg: RAGQueryMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          text: answer,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
          classLevel: activeClass,
          sources,
          modelUsed: preferredModel
        };
        setRagMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (error) {
      console.error('RAG Error:', error);
      const errorMsg: RAGQueryMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: 'দুঃখিত, তথ্য অনুসন্ধানে কিছুটা বিলম্ব হচ্ছে। অনুগ্রহ করে প্রশ্নটি আবার করুন।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };
      setRagMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsRAGLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        updateProfile,
        users,
        addUser,
        removeUser,
        activeClass,
        setActiveClass,
        materials,
        addMaterial,
        removeMaterial,
        incrementMaterialDownloads,
        videos,
        addVideo,
        removeVideo,
        incrementVideoViews,
        quizzes,
        addQuiz,
        removeQuiz,
        submissions,
        submitQuiz,
        ragMessages,
        sendRAGQuery,
        isRAGLoading,
        toastMessage,
        showToast,
        chapters: NCTB_CHAPTERS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
