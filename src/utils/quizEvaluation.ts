import { Quiz, QuizSubmission, User } from '../types';

export interface QuizEvaluationResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  breakdown: {
    questionIndex: number;
    questionText: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  feedbackMessage: string;
}

export function evaluateQuizSubmission(
  quiz: Quiz,
  userAnswers: number[],
  student: User
): QuizSubmission & { evaluation: QuizEvaluationResult } {
  let correctCount = 0;
  const breakdown = quiz.questions.map((q, idx) => {
    const userAnswer = userAnswers[idx] ?? -1;
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      questionIndex: idx,
      questionText: q.question,
      userAnswer,
      correctAnswer: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const total = quiz.questions.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = percentage >= 50;

  let feedbackMessage = '';
  if (percentage === 100) {
    feedbackMessage = 'অসাধারণ! আপনি প্রতিটি প্রশ্নের সঠিক উত্তর দিয়েছেন। আপনার প্রস্তুতি অত্যন্ত চমৎকার!';
  } else if (percentage >= 80) {
    feedbackMessage = 'খুব ভালো ফলাফল! অল্প কিছু উত্তর ছাড়া বেশিরভাগই সঠিক হয়েছে। চালিয়ে যান!';
  } else if (percentage >= 50) {
    feedbackMessage = 'সন্তোষজনক! আপনি পাস করেছেন। পাঠ্যবইটি আরেকবার মনোযোগ দিয়ে পড়লে আরও ভালো করবেন।';
  } else {
    feedbackMessage = 'আরও মনোযোগ দেওয়া প্রয়োজন। অধ্যায়টির মূলভাব এবং শব্দার্থ ভালো করে পড়ে আবার চেষ্টা করুন।';
  }

  const submission: QuizSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    studentId: student.id,
    studentName: student.name,
    classLevel: quiz.classLevel,
    score: correctCount,
    totalQuestions: total,
    percentage,
    userAnswers,
    submittedAt: new Date().toISOString(),
    feedback: feedbackMessage
  };

  return {
    ...submission,
    evaluation: {
      score: correctCount,
      totalQuestions: total,
      percentage,
      passed,
      breakdown,
      feedbackMessage
    }
  };
}
