import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarIcon, User, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { apiRequest } from '@/lib/queryClient';
import { LeaveCalculation } from '../../../shared/schema';
import { formatDateKorean } from '@/lib/utils';

const formSchema = z.object({
  dueDate: z.date({
    required_error: '출산예정일을 선택해주세요.',
  }),
  gender: z.enum(['female', 'male'], {
    required_error: '성별을 선택해주세요.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface LeaveFormProps {
  onCalculate: (result: LeaveCalculation) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

export function LeaveForm({ onCalculate, selectedDate, onDateChange }: LeaveFormProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dueDate: selectedDate || undefined,
      gender: 'female',
    }
  });
  
  const watchedGender = watch('gender');
  
  // 날짜 선택 시 폼 업데이트
  React.useEffect(() => {
    if (selectedDate) {
      setValue('dueDate', selectedDate);
    }
  }, [selectedDate, setValue]);
  
  const calculateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest<LeaveCalculation>('/api/calculate-leave', {
        method: 'POST',
        body: JSON.stringify({
          dueDate: data.dueDate.toISOString(),
          gender: data.gender,
        }),
      });
    },
    onSuccess: (result) => {
      onCalculate(result);
      queryClient.invalidateQueries({ queryKey: ['/api/calculations'] });
    },
    onError: (error) => {
      console.error('계산 오류:', error);
      alert('계산 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsCalculating(true);
    try {
      await calculateMutation.mutateAsync(data);
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Calculator className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          육아휴직 기간 계산하기
        </h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 출산예정일 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="w-4 h-4 inline mr-1" />
            출산예정일
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('dueDate', {
                setValueAs: (value) => value ? new Date(value) : undefined,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
            {selectedDate && (
              <div className="mt-2 text-sm text-gray-600">
                선택된 날짜: {formatDateKorean(selectedDate)}
              </div>
            )}
          </div>
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>
        
        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            신청자 구분
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <input
                type="radio"
                value="female"
                {...register('gender')}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                watchedGender === 'female'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="text-center">
                  <div className="font-medium">여성 (본인)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    출산전후휴가 + 육아휴직
                  </div>
                </div>
              </div>
            </label>
            
            <label className="relative">
              <input
                type="radio"
                value="male"
                {...register('gender')}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                watchedGender === 'male'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="text-center">
                  <div className="font-medium">남성 (배우자)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    육아휴직만 가능
                  </div>
                </div>
              </div>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
        
        {/* 제도 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📋 제도 안내</h3>
          <div className="text-sm text-blue-800 space-y-1">
            {watchedGender === 'female' ? (
              <>
                <div>• 출산전후휴가: 출산예정일 전후 각 45일 (총 90일)</div>
                <div>• 육아휴직: 출산전후휴가 종료 후 최대 1년</div>
                <div>• 급여: 통상임금의 100% → 80% (상한 월 150만원)</div>
              </>
            ) : (
              <>
                <div>• 육아휴직: 배우자 출산일부터 최대 1년</div>
                <div>• 급여: 통상임금의 80% (상한 월 150만원)</div>
                <div>• 부모 동시 사용 시 각각 최대 1년 가능</div>
              </>
            )}
          </div>
        </div>
        
        {/* 계산 버튼 */}
        <button
          type="submit"
          disabled={isCalculating || calculateMutation.isPending}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating || calculateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              계산 중...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              휴가 기간 계산하기
            </>
          )}
        </button>
      </form>
    </div>
  );
}