# NCTB বাংলা শিক্ষা (শ্রেণি ৬-৮) - লোকাল মেশিন ডিপ্লয়মেন্ট গাইড
## Local Deployment Guide: Python + Docker + PostgreSQL + Ollama (Qwen 2.5-VL:3b)

এই প্রজেক্টটি জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)-এর ষষ্ঠ শ্রেণির **চারুপাঠ**, সপ্তম শ্রেণির **সপ্তবর্ণা** এবং অষ্টম শ্রেণির **সাহিত্য-কণিকা** পাঠ্যবইয়ের ওপর নির্মিত একটি পূর্ণাঙ্গ লার্নিং প্ল্যাটফর্ম।

---

### 🚀 সিস্টেম আর্কিটেকচার (System Architecture)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Python 3.11 + FastAPI + SQLAlchemy ORM
- **Database**: PostgreSQL 16 (Relational DB with Docker Volume)
- **AI Model & RAG**: `qwen2.5vl:3b` via Ollama Local Instance
- **RAG Knowledge Base**: NCTB পাঠ্যবইয়ের স্ক্যান ও এডিটেবল RTF/টেক্সট নোটস
- **Containerization**: Docker & Docker Compose

---

### 📦 লোকাল মেশিনে চালানোর ধাপসমূহ (Step-by-Step Instructions)

#### ১. Ollama এবং Qwen 2.5 মডেল ইনস্টল করুন
আপনার মেশিনে Ollama ডাউনলোড ও রান করুন:
```bash
# Ollama ডাউনলোড ও ইন্সটল (https://ollama.com)
# এরপর টার্মিনালে Qwen2.5-VL:3b মডেলটি পুল করুন:
ollama run qwen2.5vl:3b
```

#### ২. Docker Compose দিয়ে ব্যাকএন্ড ও PostgreSQL চালু করুন
```bash
cd python-backend

# ডকার কন্টেইনার বিল্ড ও রান করুন:
docker-compose up --build -d
```
এটি স্বয়ংক্রিয়ভাবে:
1. PostgreSQL 16 ডাটাবেজ পোর্ট `5432`-এ চালু করবে এবং `init.sql` থেকে চারুপাঠ, সপ্তবর্ণা ও সাহিত্য-কণিকার প্রাথমিক ডাটা সিড করবে।
2. FastAPI ব্যাকএন্ড পোর্ট `8000`-এ চালু করবে এবং ইন্টারেক্টিভ Swagger ডক্স তৈরি করবে: `http://localhost:8000/docs`।
3. আপনার হোস্ট মেশিনের Ollama `qwen2.5vl:3b` এর সাথে লোকাল নেটওয়ার্কে কানেক্ট করবে।

#### ৩. ফ্রন্টএন্ড চালানো (Development Server)
```bash
# মূল ডিরেক্টরিতে ফিরে আসুন
npm install
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`

---

### 👥 ইউজার রোল ও অ্যাক্সেস (Roles & Features)

| রোল (Role) | সুবিধা ও ড্যাশবোর্ড ফিচারসমূহ |
|---|---|
| **এডমিন (Admin)** | শিক্ষক ও শিক্ষার্থী যোগ/রিমুভ, NCTB RAG নলেজবেস পরিচালনা, প্ল্যাটফর্ম অ্যানালিটিক্স, ডকার ডেপ্লয়মেন্ট হাব। |
| **শিক্ষক (Teacher)** | শ্রেণি ৬, ৭, ৮ এর পাঠ্য উপাদান (RTF/PDF) আপলোড, ভিডিও ক্লাস সংযুক্তিকরণ, কুইজ তৈরি ও শিক্ষার্থীদের তাৎক্ষণিক ফলাফল ট্র্যাকিং। |
| **শিক্ষার্থী (Student)** | পাঠ্যবই রিডার (শব্দার্থ ও মূলভাব সহ), ভিডিও ক্লাস উপভোগ, কুইজ দেওয়া এবং NCTB পাঠ্যবই ভিত্তিক AI গৃহশিক্ষকের (RAG Tutor) সাথে প্রশ্নোত্তর। |

---

### 🔍 API Endpoints Summary

- `GET /api/users` - ব্যবহারকারীদের তালিকা (এডমিন, শিক্ষক, শিক্ষার্থী)
- `POST /api/users` - নতুন শিক্ষক বা শিক্ষার্থী নিবন্ধন
- `DELETE /api/users/{id}` - ব্যবহারকারী মুছে ফেলা
- `GET /api/materials` - পাঠ্য উপাদান ও RTF নোট তালিকা
- `POST /api/materials` - শিক্ষক কর্তৃক নতুন উপাদান আপলোড
- `GET /api/videos` - ভিডিও ক্লাস তালিকা
- `POST /api/videos` - নতুন ভিডিও ক্লাস যুক্ত করা
- `GET /api/quizzes` - কুইজের তালিকা
- `POST /api/quizzes/submit` - কুইজ সাবমিশন ও স্বয়ংক্রিয় মূল্যায়ন
- `POST /api/rag/ask` - NCTB RAG ভিত্তিক Qwen 2.5-VL AI গৃহশিক্ষক প্রশ্নোত্তর
