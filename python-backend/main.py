import uuid
import datetime
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import engine, Base, get_db
import models
import schemas
from rag_service import ask_rag_tutor, clean_rtf_or_text

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NCTB Bangla Shiksha Backend (FastAPI + PostgreSQL + Qwen RAG)",
    description="API for NCTB Class 6-8 (Charupath, Saptabarna, Sahitya-Konika) with role management, materials, quizzes, and RAG tutor.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "NCTB Bangla Shiksha (Class 6-8)",
        "database": "PostgreSQL 16",
        "supported_classes": [6, 7, 8],
        "books": ["চারুপাঠ", "সপ্তবর্ণা", "সাহিত্য-কণিকা"],
        "rag_model": "qwen2.5vl:3b via Ollama"
    }

# ======================== USER MANAGEMENT ========================
@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()

@app.post("/api/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="ইমেইলটি ইতোমধ্যে নিবন্ধিত রয়েছে।")
    
    new_user = models.User(
        id=f"usr-{uuid.uuid4().hex[:8]}",
        name=user.name,
        email=user.email,
        role=user.role,
        class_level=user.class_level,
        designation=user.designation,
        phone=user.phone,
        avatar=user.avatar,
        status="active"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ব্যবহারকারী পাওয়া যায়নি।")
    db.delete(user)
    db.commit()
    return {"message": f"ব্যবহারকারী {user.name} সফলভাবে মুছে ফেলা হয়েছে।"}

# ======================== MATERIALS & RTF ========================
@app.get("/api/materials")
def get_materials(class_level: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.ClassMaterial)
    if class_level:
        q = q.filter(models.ClassMaterial.class_level == class_level)
    return q.order_by(models.ClassMaterial.uploaded_at.desc()).all()

@app.post("/api/materials")
def create_material(mat: schemas.MaterialCreate, db: Session = Depends(get_db)):
    new_mat = models.ClassMaterial(
        id=f"mat-{uuid.uuid4().hex[:8]}",
        title=mat.title,
        class_level=mat.class_level,
        subject=mat.subject,
        chapter_title=mat.chapter_title,
        teacher_id=mat.teacher_id,
        teacher_name=mat.teacher_name,
        material_type=mat.material_type,
        content=mat.content,
        file_url=mat.file_url,
        downloads_count=0
    )
    db.add(new_mat)
    db.commit()
    db.refresh(new_mat)
    return new_mat

# ======================== VIDEO CLASSES ========================
@app.get("/api/videos")
def get_videos(class_level: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.VideoClass)
    if class_level:
        q = q.filter(models.VideoClass.class_level == class_level)
    return q.order_by(models.VideoClass.created_at.desc()).all()

@app.post("/api/videos")
def create_video(vid: schemas.VideoCreate, db: Session = Depends(get_db)):
    new_vid = models.VideoClass(
        id=f"vid-{uuid.uuid4().hex[:8]}",
        title=vid.title,
        class_level=vid.class_level,
        subject=vid.subject,
        chapter_title=vid.chapter_title,
        teacher_id=vid.teacher_id,
        teacher_name=vid.teacher_name,
        youtube_id=vid.youtube_id,
        duration=vid.duration,
        description=vid.description,
        views=0
    )
    db.add(new_vid)
    db.commit()
    db.refresh(new_vid)
    return new_vid

# ======================== QUIZZES & INSTANT TRACKING ========================
@app.get("/api/quizzes")
def get_quizzes(class_level: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.Quiz)
    if class_level:
        q = q.filter(models.Quiz.class_level == class_level)
    return q.all()

@app.post("/api/quizzes")
def create_quiz(quiz: schemas.QuizCreate, db: Session = Depends(get_db)):
    new_quiz = models.Quiz(
        id=f"quiz-{uuid.uuid4().hex[:8]}",
        title=quiz.title,
        class_level=quiz.class_level,
        subject=quiz.subject,
        chapter_title=quiz.chapter_title,
        teacher_id=quiz.teacher_id,
        teacher_name=quiz.teacher_name,
        questions=[q.model_dump() for q in quiz.questions],
        time_limit_minutes=quiz.time_limit_minutes
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    return new_quiz

@app.post("/api/quizzes/submit")
def submit_quiz(sub: schemas.QuizSubmitRequest, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == sub.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="কুইজটি পাওয়া যায়নি।")

    questions = quiz.questions
    correct_count = 0
    breakdown = []
    for idx, q in enumerate(questions):
        ans = sub.user_answers[idx] if idx < len(sub.user_answers) else -1
        is_correct = (ans == q.get("correctIndex"))
        if is_correct:
            correct_count += 1
        breakdown.append({
            "question": q.get("question"),
            "user_answer": ans,
            "correct_answer": q.get("correctIndex"),
            "is_correct": is_correct,
            "explanation": q.get("explanation")
        })

    total = len(questions)
    percentage = round((correct_count / total * 100), 2) if total > 0 else 0
    feedback = "অসাধারণ প্রস্তুতি!" if percentage >= 80 else "ভালো হয়েছে, আরও অনুশীলন করুন।" if percentage >= 50 else "পাঠ্যবইটি পুনরায় মনোযোগ দিয়ে পড়ুন।"

    submission = models.QuizSubmission(
        id=f"sub-{uuid.uuid4().hex[:8]}",
        quiz_id=quiz.id,
        quiz_title=quiz.title,
        student_id=sub.student_id,
        student_name=sub.student_name,
        class_level=quiz.class_level,
        score=correct_count,
        total_questions=total,
        percentage=percentage,
        user_answers=sub.user_answers,
        feedback=feedback
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "submission_id": submission.id,
        "score": correct_count,
        "total_questions": total,
        "percentage": percentage,
        "feedback": feedback,
        "breakdown": breakdown
    }

@app.get("/api/quiz-submissions")
def get_submissions(class_level: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.QuizSubmission)
    if class_level:
        q = q.filter(models.QuizSubmission.class_level == class_level)
    return q.order_by(models.QuizSubmission.submitted_at.desc()).all()

# ======================== RAG AI TUTOR (Qwen 2.5-VL:3b) ========================
@app.post("/api/rag/ask", response_model=schemas.RAGQueryResponse)
async def ask_rag(req: schemas.RAGQueryRequest, db: Session = Depends(get_db)):
    result = await ask_rag_tutor(
        db=db,
        query=req.query,
        class_level=req.class_level,
        preferred_model=req.model or "qwen2.5vl:3b"
    )
    return result
