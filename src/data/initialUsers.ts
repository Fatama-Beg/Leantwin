import { User } from '../types';

export const INITIAL_USERS: User[] = [
  // Admin
  {
    id: 'usr-admin-1',
    name: 'কামাল আহমেদ',
    email: 'admin@nctb-shiksha.gov.bd',
    role: 'admin',
    phone: '+880 1711-234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    status: 'active'
  },

  // Teachers
  {
    id: 'usr-teacher-1',
    name: 'আহমদ রফিক',
    email: 'ahmed.rafiq@school.edu.bd',
    role: 'teacher',
    designation: 'সিনিয়র বাংলা শিক্ষক (চারুপাঠ ও সপ্তবর্ণা)',
    phone: '+880 1819-345678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:30:00Z',
    status: 'active'
  },
  {
    id: 'usr-teacher-2',
    name: 'ড. সেলিনা পারভীন',
    email: 'selina.parveen@school.edu.bd',
    role: 'teacher',
    designation: 'সহকারী প্রধান শিক্ষক ও সাহিত্য প্রভাষক',
    phone: '+880 1912-456789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T10:15:00Z',
    status: 'active'
  },
  {
    id: 'usr-teacher-3',
    name: 'তাহমিনা আক্তার',
    email: 'tahmina.akter@school.edu.bd',
    role: 'teacher',
    designation: 'বাংলা ভাষা ও ব্যাকরণ শিক্ষক',
    phone: '+880 1611-987654',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T11:00:00Z',
    status: 'active'
  },

  // Students
  {
    id: 'usr-student-1',
    name: 'তানভীর হাসান',
    email: 'tanvir.class6@student.edu.bd',
    role: 'student',
    classLevel: 6,
    phone: '+880 1700-112233',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-05T12:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-student-2',
    name: 'নুসরাত জাহান',
    email: 'nusrat.class7@student.edu.bd',
    role: 'student',
    classLevel: 7,
    phone: '+880 1700-223344',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-06T12:30:00Z',
    status: 'active'
  },
  {
    id: 'usr-student-3',
    name: 'রাফসান জামান',
    email: 'rafsan.class8@student.edu.bd',
    role: 'student',
    classLevel: 8,
    phone: '+880 1700-334455',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-07T14:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-student-4',
    name: 'ফারহানা হক',
    email: 'farhana.class6@student.edu.bd',
    role: 'student',
    classLevel: 6,
    phone: '+880 1700-445566',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-08T15:20:00Z',
    status: 'active'
  },
  {
    id: 'usr-student-5',
    name: 'সাকিব আল আহসান',
    email: 'sakib.class7@student.edu.bd',
    role: 'student',
    classLevel: 7,
    phone: '+880 1700-556677',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-09T16:10:00Z',
    status: 'active'
  },
  {
    id: 'usr-student-6',
    name: 'মেহের নিগার',
    email: 'meher.class8@student.edu.bd',
    role: 'student',
    classLevel: 8,
    phone: '+880 1700-667788',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T17:00:00Z',
    status: 'active'
  }
];
