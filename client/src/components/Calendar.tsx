import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  isSameDay,
  isToday,
  isBefore,
  startOfToday
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  getCalendarDays, 
  isDayInCurrentMonth, 
  getLeaveDayClass,
  WEEKDAYS_KR 
} from '@/lib/utils';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  dueDate?: Date | null;
  maternityPeriod?: { start: Date; end: Date } | null;
  parentalPeriod?: { start: Date; end: Date } | null;
  holidays?: Date[];
  className?: string;
}

export function Calendar({
  selectedDate,
  onDateSelect,
  dueDate,
  maternityPeriod,
  parentalPeriod,
  holidays = [],
  className = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();
  
  const calendarDays = getCalendarDays(currentMonth);
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };
  
  const handleDayClick = (day: Date) => {
    // 과거 날짜는 선택 불가
    if (isBefore(day, today)) return;
    onDateSelect(day);
  };
  
  const getDayClasses = (day: Date) => {
    const baseClass = 'calendar-day';
    const classes = [baseClass];
    
    // 현재 월이 아닌 날짜
    if (!isDayInCurrentMonth(day, currentMonth)) {
      classes.push('other-month');
    }
    
    // 과거 날짜 비활성화
    if (isBefore(day, today)) {
      classes.push('disabled');
    }
    
    // 오늘 날짜
    if (isToday(day)) {
      classes.push('today');
    }
    
    // 선택된 날짜
    if (selectedDate && isSameDay(day, selectedDate)) {
      classes.push('selected');
    }
    
    // 출산예정일
    if (dueDate && isSameDay(day, dueDate)) {
      classes.push('due-date');
    }
    
    // 휴가 기간별 스타일링
    const leaveClass = getLeaveDayClass(day, dueDate, maternityPeriod, parentalPeriod);
    if (leaveClass) {
      classes.push(leaveClass);
    }
    
    // 공휴일
    if (holidays.some(holiday => isSameDay(day, holiday))) {
      classes.push('holiday');
    }
    
    return classes.join(' ');
  };
  
  const getLeaveIndicator = (day: Date) => {
    const indicators = [];
    
    if (maternityPeriod && day >= maternityPeriod.start && day <= maternityPeriod.end) {
      indicators.push(
        <div key="maternity" className="leave-period-indicator maternity-indicator" />
      );
    }
    
    if (parentalPeriod && day >= parentalPeriod.start && day <= parentalPeriod.end) {
      indicators.push(
        <div key="parental" className="leave-period-indicator parental-indicator" />
      );
    }
    
    return indicators;
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAYS_KR.map((weekday, index) => (
          <div
            key={weekday}
            className={`p-3 text-center text-sm font-medium ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {weekday}
          </div>
        ))}
      </div>
      
      {/* 캘린더 그리드 */}
      <div className="calendar-grid p-1">
        {calendarDays.map((day, index) => (
          <div
            key={day.toISOString()}
            className={getDayClasses(day)}
            onClick={() => handleDayClick(day)}
          >
            <span className="text-sm font-medium">
              {format(day, 'd')}
            </span>
            {getLeaveIndicator(day)}
          </div>
        ))}
      </div>
      
      {/* 범례 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-maternity rounded-full"></div>
            <span className="text-gray-600">출산전후휴가</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-parental rounded-full"></div>
            <span className="text-gray-600">육아휴직</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">출산예정일</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">공휴일</span>
          </div>
        </div>
      </div>
    </div>
  );
}