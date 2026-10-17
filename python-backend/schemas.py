from typing import List, Optional, Any
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    role: str # admin, teacher, student
    class_level: Optional[int] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    status: str
    class Config:
        from_attributes = True

class MaterialCreate(BaseModel):
    title: str
    class_level: int
    subject: str
    chapter_title: str
    teacher_id: str
    teacher_name: str
    material_type: str = "rtf"
    content: str
    file_url: Optional[str] = None

class VideoCreate(BaseModel):
    title: str
    class_level: int
    subject: str
    chapter_title: str
    teacher_id: str
    teacher_name: str
    youtube_id: str
    duration: str = "15:00"
    description: Optional[str] = None

class QuizQuestionSchema(BaseModel):
    id: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str

class QuizCreate(BaseModel):
    title: str
    class_level: int
    subject: str
    chapter_title: str
    teacher_id: str
    teacher_name: str
    questions: List[QuizQuestionSchema]
    time_limit_minutes: int = 10

class QuizSubmitRequest(BaseModel):
    quiz_id: str
    student_id: str
    student_name: str
    user_answers: List[int]

class RAGQueryRequest(BaseModel):
    query: str
    class_level: Optional[int] = None
    subject: Optional[str] = None
    model: Optional[str] = "qwen2.5vl:3b"

class RAGSource(BaseModel):
    book_title: str
    chapter_title: str
    author: str
    snippet: str
    relevance: float

class RAGQueryResponse(BaseModel):
    answer: str
    sources: List[RAGSource]
    model_used: str
