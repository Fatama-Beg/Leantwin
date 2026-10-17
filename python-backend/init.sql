-- NCTB Shiksha PostgreSQL Initialization Schema & Seed Data

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    class_level INTEGER,
    designation VARCHAR(150),
    phone VARCHAR(30),
    avatar VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_materials (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    class_level INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter_title VARCHAR(150) NOT NULL,
    teacher_id VARCHAR(50) REFERENCES users(id),
    teacher_name VARCHAR(100) NOT NULL,
    material_type VARCHAR(20) DEFAULT 'rtf',
    content TEXT NOT NULL,
    file_url VARCHAR(255),
    downloads_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_classes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    class_level INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter_title VARCHAR(150) NOT NULL,
    teacher_id VARCHAR(50) REFERENCES users(id),
    teacher_name VARCHAR(100) NOT NULL,
    youtube_id VARCHAR(100) NOT NULL,
    duration VARCHAR(20) DEFAULT '15:00',
    description TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    class_level INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter_title VARCHAR(150) NOT NULL,
    teacher_id VARCHAR(50) REFERENCES users(id),
    teacher_name VARCHAR(100) NOT NULL,
    questions JSONB NOT NULL,
    time_limit_minutes INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_submissions (
    id VARCHAR(50) PRIMARY KEY,
    quiz_id VARCHAR(50) REFERENCES quizzes(id),
    quiz_title VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) REFERENCES users(id),
    student_name VARCHAR(100) NOT NULL,
    class_level INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage FLOAT NOT NULL,
    user_answers JSONB NOT NULL,
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nctb_knowledge_chunks (
    id VARCHAR(50) PRIMARY KEY,
    class_level INTEGER NOT NULL,
    book_title VARCHAR(100) NOT NULL,
    chapter_title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    moral_lesson TEXT NOT NULL,
    full_text_rtf TEXT NOT NULL,
    rtf_filename VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Users
INSERT INTO users (id, name, email, role, class_level, designation, phone)
VALUES 
('usr-admin-1', 'কামাল আহমেদ', 'admin@nctb-shiksha.gov.bd', 'admin', NULL, 'প্রধান সিস্টেম প্রশাসক', '+880 1711-234567'),
('usr-teacher-1', 'আহমদ রফিক', 'ahmed.rafiq@school.edu.bd', 'teacher', NULL, 'সিনিয়র বাংলা শিক্ষক', '+880 1819-345678'),
('usr-teacher-2', 'ড. সেলিনা পারভীন', 'selina.parveen@school.edu.bd', 'teacher', NULL, 'সহকারী অধ্যাপক, বাংলা', '+880 1912-456789'),
('usr-student-1', 'তানভীর হাসান', 'tanvir.class6@student.edu.bd', 'student', 6, NULL, '+880 1700-112233'),
('usr-student-2', 'নুসরাত জাহান', 'nusrat.class7@student.edu.bd', 'student', 7, NULL, '+880 1700-223344'),
('usr-student-3', 'রাফসান জামান', 'rafsan.class8@student.edu.bd', 'student', 8, NULL, '+880 1700-334455')
ON CONFLICT (id) DO NOTHING;

-- Seed NCTB Knowledge Chunks for RAG
INSERT INTO nctb_knowledge_chunks (id, class_level, book_title, chapter_title, author, genre, summary, moral_lesson, full_text_rtf, rtf_filename)
VALUES 
('chunk-c6-1', 6, 'চারুপাঠ', 'সততার পুরস্কার', 'মুহম্মদ শহীদুল্লাহ্', 'গল্প', 
 'ইহুদি বংশের তিন ব্যক্তির সততা ও কৃতজ্ঞতার পরীক্ষা। প্রথম দুজন অহংকারে অতীত ভুলে যায়, কিন্তু অন্ধ ব্যক্তি সত্য স্বীকার করে পুরস্কৃত হয়।', 
 'সততা ও কৃতজ্ঞতাবোধ মানুষকে সম্মানিত করে; অকৃতজ্ঞতা ধ্বংস ডেকে আনে।', 
 '{\rtf1\ansi\deff0 সেকালে ইহুদি বংশে তিনজন লোক ছিল...}', 'charupath_c6_ch1.rtf'),

('chunk-c7-1', 7, 'সপ্তবর্ণা', 'কাবুলিওয়ালা', 'রবীন্দ্রনাথ ঠাকুর', 'গল্প', 
 'আফগানিস্তানের ফল বিক্রেতা রহমত ও বালিকা মিনির অমলিন বন্ধুত্ব এবং দেশকালের সীমানা অতিক্রম করা শাশ্বত পিতৃস্নেহের মর্মস্পর্শী গল্প।', 
 'পিতৃত্বের পবিত্র স্নেহ দেশ ও সীমানার ঊর্ধ্বে পৃথিবীর সকল পিতার হৃদয়ে এক ও অভিন্ন।', 
 '{\rtf1\ansi\deff0 আমার পাঁচ বছর বয়সের ছোট মেয়ে মিনি এক দণ্ড কথা না কহিয়া থাকিতে পারে না...}', 'saptabarna_c7_ch1.rtf'),

('chunk-c8-1', 8, 'সাহিত্য-কণিকা', 'অতিথির স্মৃতি', 'শরৎচন্দ্র চট্টোপাধ্যায়', 'গল্প', 
 'দেওঘরে অসুস্থ লেখকের সাথে এক সঙ্গীহীন কুকুরের আত্মিক মমত্ববোধ ও ভালোবাসার অপূর্ব নিদর্শন।', 
 'মানুষের পাশাপাশি অবলা পশুপাখির প্রতি ভালোবাসা ও মানবিক দায়িত্ববোধ প্রদর্শন।', 
 '{\rtf1\ansi\deff0 চিকিৎসকের আদেশে দেওঘরে এসেছিলাম বায়ু পরিবর্তনের জন্য...}', 'sahitya_konika_c8_ch1.rtf')
ON CONFLICT (id) DO NOTHING;
