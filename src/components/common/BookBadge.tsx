import React from 'react';
import { ClassLevel, SubjectName } from '../../types';

interface BookBadgeProps {
  classLevel: ClassLevel;
  subject?: SubjectName;
  size?: 'sm' | 'md' | 'lg';
}

export const BookBadge: React.FC<BookBadgeProps> = ({ classLevel, subject, size = 'md' }) => {
  const getSubjectName = (level: ClassLevel): SubjectName => {
    switch (level) {
      case 6:
        return 'চারুপাঠ';
      case 7:
        return 'সপ্তবর্ণা';
      case 8:
        return 'সাহিত্য-কণিকা';
    }
  };

  const currentSubject = subject || getSubjectName(classLevel);

  const getTheme = (level: ClassLevel) => {
    switch (level) {
      case 6:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500'
        };
      case 7:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
          dot: 'bg-blue-500'
        };
      case 8:
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500'
        };
    }
  };

  const theme = getTheme(classLevel);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-medium'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${theme.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
      <span>শ্রেণি {classLevel === 6 ? '৬' : classLevel === 7 ? '৭' : '৮'} : {currentSubject}</span>
    </span>
  );
};
