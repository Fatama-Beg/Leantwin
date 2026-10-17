import os
import re
import httpx
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import NCTBKnowledgeChunk
from schemas import RAGSource

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5vl:3b")

def clean_rtf_or_text(text: str) -> str:
    """Removes RTF tags if present or returns cleaned plain text."""
    if not text:
        return ""
    # Strip basic rtf markup
    cleaned = re.sub(r'\\[a-z0-9\-]+ ?', ' ', text)
    cleaned = re.sub(r'[{}]', ' ', cleaned)
    return re.sub(r'\s+', ' ', cleaned).strip()

def search_chunks(db: Session, query: str, class_level: int = None, limit: int = 3) -> List[Dict[str, Any]]:
    tokens = [t.lower() for t in re.split(r'[\s,।!?]+', query) if len(t) > 1]
    query_obj = db.query(NCTBKnowledgeChunk)
    if class_level:
        query_obj = query_obj.filter(NCTBKnowledgeChunk.class_level == class_level)
    chunks = query_obj.all()

    scored = []
    for chunk in chunks:
        score = 0
        title_lower = chunk.chapter_title.lower()
        author_lower = chunk.author.lower()
        summary_lower = chunk.summary.lower()
        moral_lower = chunk.moral_lesson.lower()
        full_text_clean = clean_rtf_or_text(chunk.full_text_rtf).lower()

        for token in tokens:
            if token in title_lower:
                score += 30
            if token in author_lower:
                score += 20
            if token in moral_lower:
                score += 15
            if token in summary_lower:
                score += 10
            if token in full_text_clean:
                score += 5

        if score > 0:
            scored.append({
                "chunk": chunk,
                "score": score,
                "snippet": chunk.moral_lesson or chunk.summary[:200]
            })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:limit]

async def ask_rag_tutor(db: Session, query: str, class_level: int = None, preferred_model: str = "qwen2.5vl:3b") -> Dict[str, Any]:
    matched = search_chunks(db, query, class_level)
    
    if not matched:
        return {
            "answer": "দুঃখিত, জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)-এর নির্ধারিত চারুপাঠ, সপ্তবর্ণা অথবা সাহিত্য-কণিকা বইয়ের সংশ্লিষ্ট অধ্যায়ে আপনার প্রশ্নের তথ্য সরাসরি মেলেনি। অনুগ্রহ করে অধ্যায় বা কবির নাম উল্লেখ করে পুনরায় প্রশ্ন করুন।",
            "sources": [],
            "model_used": preferred_model
        }

    sources = [
        RAGSource(
            book_title=m["chunk"].book_title,
            chapter_title=m["chunk"].chapter_title,
            author=m["chunk"].author,
            snippet=m["snippet"],
            relevance=float(min(100, round((m["score"] / 40) * 100)))
        )
        for m in matched
    ]

    context_str = "\n\n".join([
        f"বই: {m['chunk'].book_title} (শ্রেণি {m['chunk'].class_level})\n"
        f"অধ্যায়: {m['chunk'].chapter_title}\n"
        f"লেখক/কবি: {m['chunk'].author}\n"
        f"সারসংক্ষেপ: {m['chunk'].summary}\n"
        f"মূল শিক্ষা: {m['chunk'].moral_lesson}\n"
        f"মূল পাঠ্য অংশ: {clean_rtf_or_text(m['chunk'].full_text_rtf)[:400]}..."
        for m in matched
    ])

    system_prompt = (
        "তুমি একজন অভিজ্ঞ ও স্নেহশীল বাংলা সাহিত্যের শিক্ষক। "
        "শিক্ষার্থী বা শিক্ষকের প্রশ্নের উত্তর NCTB পাঠ্যবইয়ের প্রদত্ত প্রেক্ষাপটের আলোকে সহজ, শুদ্ধ ও সাবলীল বাংলায় দাও। "
        "উত্তরে অধ্যায়ের নাম, কবির মূল শিক্ষা ও ভাবার্থ সুন্দরভাবে পয়েন্ট আকারে উপস্থাপন করো।"
    )

    user_prompt = f"প্রাসঙ্গিক পাঠ্যবইয়ের তথ্য:\n{context_str}\n\nশিক্ষার্থীর প্রশ্ন: {query}\n\nউত্তর দাও:"

    # Try Ollama endpoint
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"{OLLAMA_HOST}/api/generate",
                json={
                    "model": preferred_model or OLLAMA_MODEL,
                    "prompt": f"{system_prompt}\n\n{user_prompt}",
                    "stream": False
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                generated_text = data.get("response", "").strip()
                if generated_text:
                    return {
                        "answer": generated_text,
                        "sources": sources,
                        "model_used": preferred_model or OLLAMA_MODEL
                    }
    except Exception as e:
        # Fallback to local rule-based context generator
        pass

    primary = matched[0]["chunk"]
    fallback_answer = (
        f"**অধ্যায়:** {primary.chapter_title} ({primary.book_title}, শ্রেণি {primary.class_level})\n"
        f"**লেখক/কবি:** {primary.author}\n\n"
        f"📌 **মূল শিক্ষা ও বার্তা:**\n{primary.moral_lesson}\n\n"
        f"📖 **সারসংক্ষেপ:**\n{primary.summary}\n\n"
        f"*(নোট: লোকাল মেশিনে Ollama `qwen2.5vl:3b` সক্রিয় থাকলে স্বয়ংক্রিয়ভাবে সরাসরি মডেল আউটপুট পাওয়া যাবে)*"
    )

    return {
        "answer": fallback_answer,
        "sources": sources,
        "model_used": preferred_model or "qwen2.5vl:3b (rule-grounded fallback)"
    }
