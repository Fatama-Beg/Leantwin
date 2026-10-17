import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { NCTB_CHAPTERS } from './src/data/nctbCorpus';
import { searchNCTBCorpus, generateBengaliAnswerFromContext } from './src/utils/ragEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gemini SDK if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Gemini AI initialization notice:', err);
  }
}

// ================= API ENDPOINTS =================

// Health check & System info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'NCTB Bangla Shiksha (Class 6-8)',
    classes: [6, 7, 8],
    books: ['চারুপাঠ', 'সপ্তবর্ণা', 'সাহিত্য-কণিকা'],
    hasGeminiKey: Boolean(geminiApiKey)
  });
});

// RAG Q&A Endpoint for NCTB Textbooks
app.post('/api/rag/ask', async (req, res) => {
  try {
    const { query, class_level, model = 'qwen2.5vl:3b' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Step 1: Semantic & keyword search in NCTB Corpus
    const matches = searchNCTBCorpus(query, class_level ? Number(class_level) as any : undefined);
    const fallback = generateBengaliAnswerFromContext(query, matches);

    if (matches.length === 0) {
      return res.json({
        answer: fallback.answer,
        sources: [],
        model_used: model
      });
    }

    // Format sources
    const sources = matches.map((m) => ({
      book_title: m.chapter.bookTitle,
      chapter_title: m.chapter.chapterTitle,
      author: m.chapter.author,
      snippet: m.snippet,
      relevance: Math.min(100, Math.round((m.score / 40) * 100))
    }));

    // Step 2: If Gemini API is available and requested, enhance with generative model
    if (aiClient && (model === 'gemini-2.5-flash' || !model.includes('qwen'))) {
      try {
        const primary = matches[0].chapter;
        const contextText = matches
          .map(
            (m) =>
              `পাঠ্যবই: ${m.chapter.bookTitle} (শ্রেণি: ${m.chapter.classLevel})\n` +
              `অধ্যায়: ${m.chapter.chapterTitle}\n` +
              `লেখক/কবি: ${m.chapter.author} (${m.chapter.genre})\n` +
              `সারসংক্ষেপ: ${m.chapter.summary}\n` +
              `মূল শিক্ষা: ${m.chapter.moralLesson}\n` +
              `শব্দার্থ: ${m.chapter.wordMeanings.map((w) => `${w.word} = ${w.meaning}`).join(', ')}\n`
          )
          .join('\n---\n');

        const prompt =
          `তুমি বাংলাদেশের জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)-এর বাংলা সাহিত্য শিক্ষক।\n` +
          `নিচে দেওয়া পাঠ্যবইয়ের তথ্য ব্যবহার করে শিক্ষার্থীর প্রশ্নের উত্তর বিশুদ্ধ, প্রাঞ্জল ও শিক্ষণীয় বাংলায় দাও।\n` +
          `উত্তরে অধ্যায়ের নাম, লেখকের নাম এবং মূল শিক্ষা পরিষ্কারভাবে উল্লেখ করবে।\n\n` +
          `প্রাসঙ্গিক পাঠ্যবইয়ের অংশ:\n${contextText}\n\n` +
          `শিক্ষার্থীর প্রশ্ন: ${query}\n\n` +
          `শিক্ষকসুলভ উত্তর:`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        if (response && response.text) {
          return res.json({
            answer: response.text.trim(),
            sources,
            model_used: 'gemini-2.5-flash'
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini call fallback:', geminiErr);
      }
    }

    // Default to the high-accuracy NCTB context synthesizer
    return res.json({
      answer: fallback.answer,
      sources,
      model_used: model || 'qwen2.5vl:3b'
    });
  } catch (err: any) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NCTB Bangla Shiksha running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
