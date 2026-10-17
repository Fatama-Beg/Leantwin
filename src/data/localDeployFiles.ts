export interface DeployFile {
  name: string;
  language: string;
  path: string;
  description: string;
  content: string;
}

export const LOCAL_DEPLOY_FILES: DeployFile[] = [
  {
    name: 'docker-compose.yml',
    language: 'yaml',
    path: 'docker-compose.yml',
    description: 'PostgreSQL 16 এবং FastAPI ব্যাকএন্ড একসাথে রান করার কনফিগারেশন',
    content: `version: '3.8'

services:
  postgres_db:
    image: postgres:16-alpine
    container_name: nctb_postgres_db
    restart: always
    environment:
      POSTGRES_USER: nctb_user
      POSTGRES_PASSWORD: nctb_secure_password_2026
      POSTGRES_DB: nctb_shiksha_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - nctb_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nctb_user -d nctb_shiksha_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  api_backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nctb_fastapi_backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://nctb_user:nctb_secure_password_2026@postgres_db:5432/nctb_shiksha_db
      - OLLAMA_HOST=http://host.docker.internal:11434
      - OLLAMA_MODEL=qwen2.5vl:3b
    depends_on:
      postgres_db:
        condition: service_healthy
    networks:
      - nctb_network
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  postgres_data:
    driver: local

networks:
  nctb_network:
    driver: bridge`
  },
  {
    name: 'Dockerfile',
    language: 'dockerfile',
    path: 'Dockerfile',
    description: 'Python 3.11 + FastAPI কন্টেইনার ইমেজ',
    content: `FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    libpq-dev \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
  },
  {
    name: 'requirements.txt',
    language: 'text',
    path: 'requirements.txt',
    description: 'Python ব্যাকএন্ড লাইব্রেরিসমূহ',
    content: `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
sqlalchemy>=2.0.28
psycopg2-binary>=2.9.9
pydantic>=2.6.4
httpx>=0.27.0
python-multipart>=0.0.9
striprtf>=0.0.26
python-dotenv>=1.0.1`
  },
  {
    name: 'main.py',
    language: 'python',
    path: 'main.py',
    description: 'FastAPI এন্ট্রি পয়েন্ট এবং REST API রাউটসমূহ',
    content: `# FastAPI REST API for NCTB Learning Web
# শ্রেণি ৬, ৭, ৮: চারুপাঠ, সপ্তবর্ণা, সাহিত্য-কণিকা
import uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models, schemas
from rag_service import ask_rag_tutor

Base.metadata.create_all(bind=engine)
app = FastAPI(title="NCTB Bangla Shiksha Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes for Users, Materials, Videos, Quizzes and RAG Tutor
# Complete code is ready in python-backend/main.py`
  },
  {
    name: 'rag_service.py',
    language: 'python',
    path: 'rag_service.py',
    description: 'NCTB পাঠ্যবই RAG অনুসন্ধান ও Ollama qwen2.5vl:3b ইন্টিগ্রেশন',
    content: `# RAG Service with Ollama qwen2.5vl:3b and NCTB RTF Knowledge Base
import os, re, httpx
from sqlalchemy.orm import Session
from models import NCTBKnowledgeChunk

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5vl:3b")

async def ask_rag_tutor(db: Session, query: str, class_level: int = None):
    # Searches PostgreSQL nctb_knowledge_chunks, retrieves RTF notes,
    # and prompts qwen2.5vl:3b via Ollama API
    ...`
  },
  {
    name: 'init.sql',
    language: 'sql',
    path: 'init.sql',
    description: 'PostgreSQL ডাটাবেজ টেবিল এবং চারুপাঠ, সপ্তবর্ণা, সাহিত্য-কণিকার সিড ডাটা',
    content: `-- PostgreSQL schema for Users, Materials, Videos, Quizzes, Submissions & NCTB Chunks
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    class_level INTEGER,
    status VARCHAR(20) DEFAULT 'active'
);
-- See python-backend/init.sql for full schema and initial NCTB data.`
  }
];
