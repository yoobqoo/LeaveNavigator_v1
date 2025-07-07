import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  format, 
  addDays, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWeekend,
  getDay
} from 'date-fns';
import { ko } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 날짜 포맷팅 유틸리티
export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
  return format(date, formatStr, { locale: ko });
}

export function formatDateKorean(date: Date): string {
  return format(date, 'yyyy년 MM월 dd일 (eeee)', { locale: ko });
}

// 캘린더 관련 유틸리티
export function getCalendarDays(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 }); // 일요일 시작
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start, end });
}

export function isDayInCurrentMonth(day: Date, currentMonth: Date): boolean {
  return isSameMonth(day, currentMonth);
}

export function isDaySelected(day: Date, selectedDate: Date | null): boolean {
  return selectedDate ? isSameDay(day, selectedDate) : false;
}

// 휴가 기간 계산 유틸리티
export function calculateWorkingDays(startDate: Date, endDate: Date, holidays: Date[] = []): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.filter(day => {
    // 주말 제외
    if (isWeekend(day)) return false;
    
    // 공휴일 제외
    if (holidays.some(holiday => isSameDay(day, holiday))) return false;
    
    return true;
  }).length;
}

export function calculateWeekendDays(startDate: Date, endDate: Date): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter(day => isWeekend(day)).length;
}

export function calculateHolidayCount(startDate: Date, endDate: Date, holidays: Date[]): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter(day => 
    holidays.some(holiday => isSameDay(day, holiday))
  ).length;
}

// 한국 육아휴직 제도 관련 유틸리티
export function calculateMaternityLeave(dueDate: Date) {
  return {
    startDate: subDays(dueDate, 45), // 출산예정일 45일 전
    endDate: addDays(dueDate, 45),   // 출산예정일 45일 후
    totalDays: 90
  };
}

export function calculateParentalLeave(startDate: Date) {
  return {
    startDate,
    endDate: addDays(startDate, 364), // 365일 (1년)
    totalDays: 365
  };
}

// 날짜 타입 가드
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// 한국어 요일 배열
export const WEEKDAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

// 휴가 유형별 스타일 클래스
export function getLeaveDayClass(
  day: Date,
  dueDate: Date | null,
  maternityPeriod: { start: Date; end: Date } | null,
  parentalPeriod: { start: Date; end: Date } | null
): string {
  if (!dueDate) return '';

  if (isSameDay(day, dueDate)) {
    return 'selected';
  }

  if (maternityPeriod && day >= maternityPeriod.start && day <= maternityPeriod.end) {
    return 'maternity';
  }

  if (parentalPeriod && day >= parentalPeriod.start && day <= parentalPeriod.end) {
    return 'parental';
  }

  return '';
}