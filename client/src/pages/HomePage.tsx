import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/Calendar';
import { LeaveForm } from '@/components/LeaveForm';
import { ResultCard } from '@/components/ResultCard';
import { LeaveCalculation, Holiday } from '../../../shared/schema';
import { calculateMaternityLeave, calculateParentalLeave } from '@/lib/utils';

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calculationResult, setCalculationResult] = useState<LeaveCalculation | null>(null);
  
  // 공휴일 데이터 조회
  const { data: holidays = [] } = useQuery<Holiday[]>({
    queryKey: ['/api/holidays'],
  });
  
  const holidayDates = holidays.map(h => new Date(h.date));
  
  // 계산 결과에 따른 기간 설정
  const maternityPeriod = calculationResult && calculationResult.gender === 'female' 
    ? {
        start: new Date(calculationResult.maternityStartDate),
        end: new Date(calculationResult.maternityEndDate)
      }
    : null;
    
  const parentalPeriod = calculationResult
    ? {
        start: new Date(calculationResult.paternalLeaveStartDate),
        end: new Date(calculationResult.paternalLeaveEndDate)
      }
    : null;
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleCalculate = (result: LeaveCalculation) => {
    setCalculationResult(result);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  육아휴직 기간 계산기
                </h1>
                <p className="text-gray-600">
                  출산예정일을 입력하여 출산전후휴가와 육아휴직 기간을 계산해보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 폼과 결과 */}
          <div className="space-y-8">
            <LeaveForm
              onCalculate={handleCalculate}
              selectedDate={selectedDate}
              onDateChange={handleDateSelect}
            />
            
            {calculationResult && (
              <ResultCard
                result={calculationResult}
                holidays={holidayDates}
              />
            )}
          </div>
          
          {/* 오른쪽: 캘린더 */}
          <div className="lg:sticky lg:top-8">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              dueDate={calculationResult ? new Date(calculationResult.dueDate) : null}
              maternityPeriod={maternityPeriod}
              parentalPeriod={parentalPeriod}
              holidays={holidayDates}
              className="h-fit"
            />
          </div>
        </div>
        
        {/* 안내 섹션 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">출산전후휴가</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 출산예정일 전후 각 45일씩 총 90일</p>
              <p>• 통상임금의 100% 지급 (회사 부담)</p>
              <p>• 분할 사용 불가 (연속 사용)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">육아휴직</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 자녀 1명당 최대 1년</p>
              <p>• 통상임금의 80% 지급 (상한 150만원)</p>
              <p>• 분할 사용 가능 (2회까지)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">신청 시 주의사항</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 휴직 개시 30일 전 사전 신청</p>
              <p>• 필요 서류 준비 (출생증명서 등)</p>
              <p>• 회사 인사규정 확인 필수</p>
            </div>
          </div>
        </div>
        
        {/* 푸터 */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>
              본 계산기는 2024년 기준 한국의 육아휴직 제도를 바탕으로 제작되었습니다.
            </p>
            <p className="mt-1">
              정확한 정보는 고용노동부 또는 소속 회사에 문의하시기 바랍니다.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}