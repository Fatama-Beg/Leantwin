export type UserRole = 'admin' | 'teacher' | 'student';

export type ClassLevel = 6 | 7 | 8;

export type SubjectName = 'চারুপাঠ' | 'সপ্তবর্ণা' | 'সাহিত্য-কণিকা';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classLevel?: ClassLevel; // for student
  designation?: string;    // for teacher (e.g. সিনিয়র বাংলা শিক্ষক)
  phone?: string;
  avatar?: string;
  school?: string;
  rollNumber?: string;
  bio?: string;
  password?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface NCTBChapter {
  id: string;
  classLevel: ClassLevel;
  bookTitle: SubjectName;
  chapterTitle: string;
  author: string;
  genre: 'গল্প' | 'কবিতা' | 'প্রবন্ধ' | 'নাটিকা' | 'ভ্রমণকাহিনী';
  pageNumber: string;
  summary: string;
  moralLesson: string;
  wordMeanings: { word: string; meaning: string }[];
  keyTopics: string[];
  fullTextSnippet: string;
  rtfFileName: string;
}

export interface ClassMaterial {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: SubjectName;
  chapterTitle: string;
  teacherId: string;
  teacherName: string;
  type: 'rtf' | 'pdf' | 'notes' | 'summary';
  fileUrl?: string;
  content: string;
  uploadedAt: string;
  downloadsCount: number;
}

export interface VideoClass {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: SubjectName;
  chapterTitle: string;
  teacherId: string;
  teacherName: string;
  youtubeId: string;
  duration: string;
  description: string;
  createdAt: string;
  views: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: SubjectName;
  chapterTitle: string;
  teacherId: string;
  teacherName: string;
  questions: QuizQuestion[];
  timeLimitMinutes: number;
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  classLevel: ClassLevel;
  score: number;
  totalQuestions: number;
  percentage: number;
  userAnswers: number[];
  submittedAt: string;
  feedback: string;
}

export interface RAGQueryMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  classLevel?: ClassLevel;
  bookTitle?: SubjectName;
  sources?: {
    bookTitle: string;
    chapterTitle: string;
    author: string;
    snippet: string;
    relevance: number;
  }[];
  modelUsed?: 'gemini-2.5-flash' | 'qwen2.5vl:3b';
}
