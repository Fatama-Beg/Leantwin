import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(20), nullable=False) # 'admin', 'teacher', 'student'
    class_level = Column(Integer, nullable=True) # 6, 7, 8 for student
    designation = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)
    avatar = Column(String(255), nullable=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    submissions = relationship("QuizSubmission", back_populates="student")

class ClassMaterial(Base):
    __tablename__ = "class_materials"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    class_level = Column(Integer, nullable=False) # 6, 7, 8
    subject = Column(String(100), nullable=False) # চারুপাঠ, সপ্তবর্ণা, সাহিত্য-কণিকা
    chapter_title = Column(String(150), nullable=False)
    teacher_id = Column(String(50), ForeignKey("users.id"))
    teacher_name = Column(String(100), nullable=False)
    material_type = Column(String(20), default="rtf") # rtf, pdf, notes, summary
    content = Column(Text, nullable=False)
    file_url = Column(String(255), nullable=True)
    downloads_count = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

class VideoClass(Base):
    __tablename__ = "video_classes"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    class_level = Column(Integer, nullable=False)
    subject = Column(String(100), nullable=False)
    chapter_title = Column(String(150), nullable=False)
    teacher_id = Column(String(50), ForeignKey("users.id"))
    teacher_name = Column(String(100), nullable=False)
    youtube_id = Column(String(100), nullable=False)
    duration = Column(String(20), default="15:00")
    description = Column(Text, nullable=True)
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    class_level = Column(Integer, nullable=False)
    subject = Column(String(100), nullable=False)
    chapter_title = Column(String(150), nullable=False)
    teacher_id = Column(String(50), ForeignKey("users.id"))
    teacher_name = Column(String(100), nullable=False)
    questions = Column(JSON, nullable=False) # JSON list of questions
    time_limit_minutes = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    submissions = relationship("QuizSubmission", back_populates="quiz")

class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(String(50), primary_key=True, index=True)
    quiz_id = Column(String(50), ForeignKey("quizzes.id"))
    quiz_title = Column(String(255), nullable=False)
    student_id = Column(String(50), ForeignKey("users.id"))
    student_name = Column(String(100), nullable=False)
    class_level = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    user_answers = Column(JSON, nullable=False)
    feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("User", back_populates="submissions")
    quiz = relationship("Quiz", back_populates="submissions")

class NCTBKnowledgeChunk(Base):
    __tablename__ = "nctb_knowledge_chunks"

    id = Column(String(50), primary_key=True, index=True)
    class_level = Column(Integer, nullable=False)
    book_title = Column(String(100), nullable=False)
    chapter_title = Column(String(150), nullable=False)
    author = Column(String(100), nullable=False)
    genre = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    moral_lesson = Column(Text, nullable=False)
    full_text_rtf = Column(Text, nullable=False)
    rtf_filename = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
