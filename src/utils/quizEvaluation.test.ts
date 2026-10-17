import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateQuizSubmission } from './quizEvaluation.ts';
import { Quiz, User } from '../types';

const mockQuiz: Quiz = {
  id: 'quiz-1',
  title: 'সততার পুরস্কার মূল্যায়ন কুইজ',
  classLevel: 6,
  subject: 'চারুপাঠ',
  chapterTitle: 'সততার পুরস্কার',
  teacherId: 't1',
  teacherName: 'আহমদ রফিক',
  timeLimitMinutes: 10,
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      question: 'প্রথম ব্যক্তির গায়ে কী রোগ ছিল?',
      options: ['টাক', 'কুষ্ঠ (ধবল)', 'অন্ধ', 'জ্বর'],
      correctIndex: 1,
      explanation: 'প্রথম ব্যক্তির গায়ে ধবল বা কুষ্ঠ রোগ ছিল।'
    },
    {
      id: 'q2',
      question: 'তৃতীয় ব্যক্তি কী পশু চেয়েছিলেন?',
      options: ['উট', 'গাভী', 'ছাগল', 'ঘোড়া'],
      correctIndex: 2,
      explanation: 'তৃতীয় ব্যক্তি ছাগল প্রার্থনা করেছিলেন।'
    }
  ]
};

const mockStudent: User = {
  id: 's1',
  name: 'তানভীর হাসান',
  email: 'tanvir@student.edu',
  role: 'student',
  classLevel: 6,
  createdAt: new Date().toISOString(),
  status: 'active'
};

test('evaluateQuizSubmission scores 100% when all correct', () => {
  const result = evaluateQuizSubmission(mockQuiz, [1, 2], mockStudent);
  assert.equal(result.score, 2);
  assert.equal(result.totalQuestions, 2);
  assert.equal(result.percentage, 100);
  assert.equal(result.evaluation.passed, true);
  assert.ok(result.feedback.includes('অসাধারণ'));
});

test('evaluateQuizSubmission scores 50% when 1 out of 2 is correct', () => {
  const result = evaluateQuizSubmission(mockQuiz, [1, 0], mockStudent);
  assert.equal(result.score, 1);
  assert.equal(result.percentage, 50);
  assert.equal(result.evaluation.passed, true);
  assert.equal(result.evaluation.breakdown[0].isCorrect, true);
  assert.equal(result.evaluation.breakdown[1].isCorrect, false);
});

test('evaluateQuizSubmission handles all wrong answers', () => {
  const result = evaluateQuizSubmission(mockQuiz, [0, 0], mockStudent);
  assert.equal(result.score, 0);
  assert.equal(result.percentage, 0);
  assert.equal(result.evaluation.passed, false);
  assert.ok(result.feedback.includes('মনোযোগ'));
});
