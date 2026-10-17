import { NCTB_CHAPTERS } from '../data/nctbCorpus';
import { ClassLevel, NCTBChapter, SubjectName } from '../types';

export interface RAGMatch {
  chapter: NCTBChapter;
  score: number;
  matchedTerms: string[];
  snippet: string;
}

export function tokenizeBangla(text: string): string[] {
  if (!text) return [];
  // Split on punctuation, whitespace, and Bengali danda (।)
  return text
    .toLowerCase()
    .replace(/[।,;:!?"'()[\]{}।\-\/\\—]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

export function searchNCTBCorpus(
  query: string,
  classLevel?: ClassLevel,
  subject?: SubjectName,
  limit: number = 3
): RAGMatch[] {
  const queryTokens = tokenizeBangla(query);
  if (queryTokens.length === 0) return [];

  const candidates = NCTB_CHAPTERS.filter((chap) => {
    if (classLevel && chap.classLevel !== classLevel) return false;
    if (subject && chap.bookTitle !== subject) return false;
    return true;
  });

  const scored: RAGMatch[] = candidates.map((chapter) => {
    let score = 0;
    const matchedTerms: string[] = [];

    // Title match: high weight
    const titleTokens = tokenizeBangla(chapter.chapterTitle);
    const authorTokens = tokenizeBangla(chapter.author);
    const summaryTokens = tokenizeBangla(chapter.summary);
    const moralTokens = tokenizeBangla(chapter.moralLesson);
    const keyTopicTokens = chapter.keyTopics.flatMap((kt) => tokenizeBangla(kt));
    const wordMeaningTokens = chapter.wordMeanings.flatMap((wm) => [
      ...tokenizeBangla(wm.word),
      ...tokenizeBangla(wm.meaning)
    ]);
    const snippetTokens = tokenizeBangla(chapter.fullTextSnippet);

    queryTokens.forEach((token) => {
      let tokenHit = false;

      if (titleTokens.includes(token)) {
        score += 25;
        tokenHit = true;
      }
      if (authorTokens.includes(token)) {
        score += 20;
        tokenHit = true;
      }
      if (moralTokens.includes(token)) {
        score += 15;
        tokenHit = true;
      }
      if (keyTopicTokens.includes(token)) {
        score += 12;
        tokenHit = true;
      }
      if (summaryTokens.includes(token)) {
        score += 10;
        tokenHit = true;
      }
      if (wordMeaningTokens.includes(token)) {
        score += 8;
        tokenHit = true;
      }
      if (snippetTokens.includes(token)) {
        score += 5;
        tokenHit = true;
      }

      if (tokenHit && !matchedTerms.includes(token)) {
        matchedTerms.push(token);
      }
    });

    // Provide relevant snippet: prioritize moral or summary sentence containing token
    let bestSnippet = chapter.summary;
    for (const token of queryTokens) {
      if (chapter.moralLesson.toLowerCase().includes(token)) {
        bestSnippet = `মূল শিক্ষা: ${chapter.moralLesson}`;
        break;
      }
      const sentences = chapter.summary.split('।');
      const matchingSentence = sentences.find((s) => s.toLowerCase().includes(token));
      if (matchingSentence) {
        bestSnippet = matchingSentence.trim() + '।';
        break;
      }
    }

    return {
      chapter,
      score,
      matchedTerms,
      snippet: bestSnippet
    };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function generateBengaliAnswerFromContext(
  query: string,
  matches: RAGMatch[]
): {
  answer: string;
  sources: { bookTitle: string; chapterTitle: string; author: string; snippet: string; relevance: number }[];
} {
  if (matches.length === 0) {
    return {
      answer:
        'দুঃখিত, আপনার প্রশ্নের সুনির্দিষ্ট উত্তর আমাদের ষষ্ঠ, সপ্তম ও অষ্টম শ্রেণির পাঠ্যবই (চারুপাঠ, সপ্তবর্ণা, সাহিত্য-কণিকা)-এর এই অধ্যায়ে সরাসরি পাওয়া যায়নি। আপনি নির্দিষ্ট গল্প বা কবিতার নাম (যেমন: "সততার পুরস্কার", "কাবুলিওয়ালা", বা "অতিথির স্মৃতি") উল্লেখ করে পুনরায় প্রশ্ন করতে পারেন।',
      sources: []
    };
  }

  const primary = matches[0].chapter;
  const sources = matches.map((m) => ({
    bookTitle: m.chapter.bookTitle,
    chapterTitle: m.chapter.chapterTitle,
    author: m.chapter.author,
    snippet: m.snippet,
    relevance: Math.min(100, Math.round((m.score / 40) * 100))
  }));

  let answer = `**অধ্যায়:** ${primary.chapterTitle} (${primary.bookTitle}, শ্রেণি ${primary.classLevel})\n` +
    `**লেখক/কবি:** ${primary.author} | **ধরন:** ${primary.genre}\n\n`;

  // Detect query intent:
  const q = query.toLowerCase();
  if (q.includes('শিক্ষা') || q.includes('বার্তা') || q.includes('উদ্দেশ্য') || q.includes('মূলভাব')) {
    answer += `📌 **মূল শিক্ষা ও বার্তা:**\n${primary.moralLesson}\n\n` +
      `📖 **সারসংক্ষেপ:**\n${primary.summary}`;
  } else if (q.includes('শব্দার্থ') || q.includes('অর্থ')) {
    const meaningsList = primary.wordMeanings.map((wm) => `• **${wm.word}**: ${wm.meaning}`).join('\n');
    answer += `📚 **গুরুত্বপূর্ণ শব্দার্থ ও টীকা:**\n${meaningsList}\n\n` +
      `📖 **প্রসঙ্গ:** ${primary.summary}`;
  } else if (q.includes('লেখক') || q.includes('কবি')) {
    answer += `✍️ **লেখক পরিচিতি ও রচনা:**\n${primary.chapterTitle} রচনাটি লিখেছেন **${primary.author}**। এটি ${primary.bookTitle} বইয়ের পৃষ্ঠা ${primary.pageNumber}-এ অন্তর্ভুক্ত।\n\n` +
      `📖 **রচনার সারসংক্ষেপ:**\n${primary.summary}\n\n` +
      `💡 **মূল শিক্ষা:** ${primary.moralLesson}`;
  } else {
    answer += `📖 **বিশ্লেষণ ও উত্তর:**\n${primary.summary}\n\n` +
      `💡 **মূল শিক্ষা:** ${primary.moralLesson}\n\n` +
      `🔍 **মূল আলোচ্য বিষয়সমূহ:** ${primary.keyTopics.join(', ')}`;
  }

  return { answer, sources };
}
