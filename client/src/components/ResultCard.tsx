import { Clock, Calendar, Baby, Heart, Info } from 'lucide-react';
import { LeaveCalculation } from '../../../shared/schema';
import { formatDateKorean, calculateWorkingDays } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

interface ResultCardProps {
  result: LeaveCalculation;
  holidays?: Date[];
}

export function ResultCard({ result, holidays = [] }: ResultCardProps) {
  const maternityWorkingDays = result.gender === 'female' 
    ? calculateWorkingDays(result.maternityStartDate, result.maternityEndDate, holidays)
    : 0;
  
  const parentalWorkingDays = calculateWorkingDays(
    result.paternalLeaveStartDate, 
    result.paternalLeaveEndDate, 
    holidays
  );
  
  const totalCalendarDays = result.totalMaternityDays + result.totalParentalDays;
  const totalWorkingDays = maternityWorkingDays + parentalWorkingDays;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <Baby className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          계산 결과
        </h2>
      </div>
      
      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">출산예정일</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDateKorean(result.dueDate)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">총 휴가 기간</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {totalCalendarDays}일 ({Math.round(totalCalendarDays / 30)}개월)
          </div>
        </div>
      </div>
      
      {/* 휴가 기간별 상세 정보 */}
      <div className="space-y-4">
        {result.gender === 'female' && (
          <div className="border border-maternity-200 bg-maternity-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-maternity-600" />
              <h3 className="font-semibold text-maternity-900">출산전후휴가</h3>
              <span className="bg-maternity-100 text-maternity-800 text-xs px-2 py-1 rounded-full">
                {result.totalMaternityDays}일
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-maternity-600 font-medium">시작일:</span>
                <div className="text-maternity-900 mt-1">
                  {formatDateKorean(result.maternityStartDate)}
                </div>
              </div>
              <div>
                <span className="text-maternity-600 font-medium">종료일:</span>
                <div className="text-maternity-900 mt-1">
                  {formatDateKorean(result.maternityEndDate)}
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-maternity-200">
              <div className="flex justify-between text-sm">
                <span className="text-maternity-600">근무일 기준:</span>
                <span className="text-maternity-900 font-medium">
                  약 {maternityWorkingDays}일
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="border border-parental-200 bg-parental-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Baby className="w-5 h-5 text-parental-600" />
            <h3 className="font-semibold text-parental-900">육아휴직</h3>
            <span className="bg-parental-100 text-parental-800 text-xs px-2 py-1 rounded-full">
              {result.totalParentalDays}일
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-parental-600 font-medium">시작일:</span>
              <div className="text-parental-900 mt-1">
                {formatDateKorean(result.paternalLeaveStartDate)}
              </div>
            </div>
            <div>
              <span className="text-parental-600 font-medium">종료일:</span>
              <div className="text-parental-900 mt-1">
                {formatDateKorean(result.paternalLeaveEndDate)}
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-parental-200">
            <div className="flex justify-between text-sm">
              <span className="text-parental-600">근무일 기준:</span>
              <span className="text-parental-900 font-medium">
                약 {parentalWorkingDays}일
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 추천 정보 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">권장 사항</h3>
        </div>
        
        <div className="text-sm text-blue-800 space-y-2">
          {result.recommendedSchedule.split('. ').map((rec, index) => 
            rec.trim() && (
              <div key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{rec.trim()}</span>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* 급여 안내 */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-600">💰</span>
          <h3 className="font-semibold text-yellow-900">급여 안내</h3>
        </div>
        
        <div className="text-sm text-yellow-800 space-y-1">
          {result.gender === 'female' ? (
            <>
              <div>• 출산전후휴가: 통상임금의 100% (회사 지급)</div>
              <div>• 육아휴직: 통상임금의 80% (상한 월 150만원, 고용보험 지급)</div>
            </>
          ) : (
            <div>• 육아휴직: 통상임금의 80% (상한 월 150만원, 고용보험 지급)</div>
          )}
        </div>
      </div>
    </div>
  );
}