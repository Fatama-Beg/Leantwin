import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeBangla, searchNCTBCorpus, generateBengaliAnswerFromContext } from './ragEngine.ts';

test('tokenizeBangla correctly splits and cleans Bengali punctuation', () => {
  const tokens = tokenizeBangla('সততার পুরস্কার গল্পের মূল শিক্ষা কী?');
  assert.ok(tokens.includes('সততার'));
  assert.ok(tokens.includes('পুরস্কার'));
  assert.ok(tokens.includes('গল্পের'));
  assert.ok(tokens.includes('শিক্ষা'));
});

test('searchNCTBCorpus finds "সততার পুরস্কার" for Class 6', () => {
  const matches = searchNCTBCorpus('সততার পুরস্কার মূল শিক্ষা', 6);
  assert.ok(matches.length > 0);
  assert.equal(matches[0].chapter.chapterTitle, 'সততার পুরস্কার');
  assert.equal(matches[0].chapter.classLevel, 6);
  assert.equal(matches[0].chapter.bookTitle, 'চারুপাঠ');
});

test('searchNCTBCorpus finds "কাবুলিওয়ালা" for Class 7 with author Tagore', () => {
  const matches = searchNCTBCorpus('কাবুলিওয়ালা রবীন্দ্রনাথ ঠাকুর মিনি', 7);
  assert.ok(matches.length > 0);
  assert.equal(matches[0].chapter.chapterTitle, 'কাবুলিওয়ালা');
  assert.equal(matches[0].chapter.author, 'রবীন্দ্রনাথ ঠাকুর');
});

test('searchNCTBCorpus finds "অতিথির স্মৃতি" for Class 8', () => {
  const matches = searchNCTBCorpus('অতিথির স্মৃতি শরৎচন্দ্র চট্টোপাধ্যায় দেওঘর', 8);
  assert.ok(matches.length > 0);
  assert.equal(matches[0].chapter.chapterTitle, 'অতিথির স্মৃতি');
});

test('generateBengaliAnswerFromContext produces well-formed answer with sources', () => {
  const matches = searchNCTBCorpus('কুলি মজুর কাজী নজরুল ইসলাম', 7);
  assert.ok(matches.length > 0);
  const result = generateBengaliAnswerFromContext('কুলি-মজুর কবিতার মূল শিক্ষা কী?', matches);
  assert.ok(result.answer.includes('কুলি-মজুর'));
  assert.ok(result.answer.includes('কাজী নজরুল ইসলাম'));
  assert.ok(result.sources.length > 0);
  assert.equal(result.sources[0].chapterTitle, 'কুলি-মজুর');
});
