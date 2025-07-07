import { z } from 'zod';

// 육아휴직 계산 데이터 스키마
export const leaveCalculationSchema = z.object({
  id: z.string(),
  dueDate: z.date(),
  maternityStartDate: z.date(),
  maternityEndDate: z.date(),
  paternalLeaveStartDate: z.date(),
  paternalLeaveEndDate: z.date(),
  totalMaternityDays: z.number(),
  totalParentalDays: z.number(),
  recommendedSchedule: z.string(),
  gender: z.enum(['female', 'male']),
  createdAt: z.date(),
});

// 공휴일 스키마
export const holidaySchema = z.object({
  id: z.string(),
  date: z.date(),
  name: z.string(),
  isNationalHoliday: z.boolean(),
});

// 육아휴직 설정 스키마
export const leaveSettingsSchema = z.object({
  id: z.string(),
  maternityLeaveDays: z.number().default(90), // 출산전후휴가 90일
  paternalLeaveDays: z.number().default(365), // 육아휴직 1년
  prenatalDays: z.number().default(45), // 출산전 45일
  postnatalDays: z.number().default(45), // 출산후 45일
  isCustomizable: z.boolean().default(true),
});

// Insert 스키마들 (drizzle-zod 없이 직접 정의)
export const insertLeaveCalculationSchema = leaveCalculationSchema.omit({
  id: true,
  createdAt: true,
});

export const insertHolidaySchema = holidaySchema.omit({
  id: true,
});

export const insertLeaveSettingsSchema = leaveSettingsSchema.omit({
  id: true,
});

// 타입 정의
export type LeaveCalculation = z.infer<typeof leaveCalculationSchema>;
export type Holiday = z.infer<typeof holidaySchema>;
export type LeaveSettings = z.infer<typeof leaveSettingsSchema>;

export type InsertLeaveCalculation = z.infer<typeof insertLeaveCalculationSchema>;
export type InsertHoliday = z.infer<typeof insertHolidaySchema>;
export type InsertLeaveSettings = z.infer<typeof insertLeaveSettingsSchema>;

// 휴가 기간 계산을 위한 유틸리티 타입
export interface LeavePeriod {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  workingDays: number;
  weekendDays: number;
  holidayCount: number;
  type: 'maternity' | 'parental';
}

export interface CalculationResult {
  dueDate: Date;
  maternityLeave: LeavePeriod;
  paternalLeave: LeavePeriod;
  recommendations: string[];
  totalLeaveDays: number;
}