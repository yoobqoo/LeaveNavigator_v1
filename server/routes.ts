import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { insertLeaveCalculationSchema, insertHolidaySchema, insertLeaveSettingsSchema } from '../shared/schema';
import { addDays, subDays } from 'date-fns';

const router = Router();

// 육아휴직 계산 함수
async function calculateLeave(dueDate: Date, gender: 'female' | 'male') {
  const settings = await storage.getDefaultLeaveSettings();
  
  // 출산전후휴가 계산 (여성만)
  let maternityStartDate: Date;
  let maternityEndDate: Date;
  
  if (gender === 'female') {
    maternityStartDate = subDays(dueDate, 45); // 출산예정일 45일 전
    maternityEndDate = addDays(dueDate, 45); // 출산예정일 45일 후
  } else {
    // 남성의 경우 출산전후휴가 없음
    maternityStartDate = dueDate;
    maternityEndDate = dueDate;
  }
  
  // 육아휴직 계산 (출산전후휴가 종료 다음날부터)
  const paternalLeaveStartDate = gender === 'female' ? addDays(maternityEndDate, 1) : dueDate;
  const paternalLeaveEndDate = addDays(paternalLeaveStartDate, 365); // 1년
  
  const totalMaternityDays = gender === 'female' ? 90 : 0;
  const totalParentalDays = 365;
  
  // 권장 일정 생성
  const recommendations = [];
  if (gender === 'female') {
    recommendations.push('출산전후휴가는 출산예정일 전후 각각 45일씩 총 90일입니다.');
    recommendations.push('육아휴직은 출산전후휴가 종료 다음날부터 시작할 수 있습니다.');
  } else {
    recommendations.push('배우자의 출산일부터 육아휴직을 시작할 수 있습니다.');
  }
  recommendations.push('육아휴직은 최대 1년(365일)까지 가능합니다.');
  recommendations.push('육아휴직급여는 통상임금의 80% (상한액: 월 150만원)입니다.');
  
  return {
    maternityStartDate,
    maternityEndDate,
    paternalLeaveStartDate,
    paternalLeaveEndDate,
    totalMaternityDays,
    totalParentalDays,
    recommendedSchedule: recommendations.join(' ')
  };
}

// 육아휴직 계산 API
router.post('/api/calculate-leave', async (req, res) => {
  try {
    const body = z.object({
      dueDate: z.string().transform(str => new Date(str)),
      gender: z.enum(['female', 'male'])
    }).parse(req.body);
    
    const calculation = await calculateLeave(body.dueDate, body.gender);
    
    const leaveCalculation = await storage.createLeaveCalculation({
      dueDate: body.dueDate,
      gender: body.gender,
      ...calculation
    });
    
    res.json(leaveCalculation);
  } catch (error) {
    res.status(400).json({ error: '계산 중 오류가 발생했습니다.' });
  }
});

// 계산 내역 조회
router.get('/api/calculations', async (req, res) => {
  try {
    const calculations = await storage.getAllLeaveCalculations();
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ error: '계산 내역을 불러올 수 없습니다.' });
  }
});

router.get('/api/calculations/:id', async (req, res) => {
  try {
    const calculation = await storage.getLeaveCalculation(req.params.id);
    if (!calculation) {
      return res.status(404).json({ error: '계산 내역을 찾을 수 없습니다.' });
    }
    res.json(calculation);
  } catch (error) {
    res.status(500).json({ error: '계산 내역을 불러올 수 없습니다.' });
  }
});

// 공휴일 API
router.get('/api/holidays', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (startDate && endDate) {
      const holidays = await storage.getHolidaysByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(holidays);
    } else {
      const holidays = await storage.getAllHolidays();
      res.json(holidays);
    }
  } catch (error) {
    res.status(500).json({ error: '공휴일 정보를 불러올 수 없습니다.' });
  }
});

router.post('/api/holidays', async (req, res) => {
  try {
    const holiday = insertHolidaySchema.parse(req.body);
    const newHoliday = await storage.createHoliday(holiday);
    res.json(newHoliday);
  } catch (error) {
    res.status(400).json({ error: '공휴일 추가 중 오류가 발생했습니다.' });
  }
});

// 설정 API
router.get('/api/settings', async (req, res) => {
  try {
    const settings = await storage.getDefaultLeaveSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: '설정을 불러올 수 없습니다.' });
  }
});

router.put('/api/settings/:id', async (req, res) => {
  try {
    const settings = insertLeaveSettingsSchema.partial().parse(req.body);
    const updatedSettings = await storage.updateLeaveSettings(req.params.id, settings);
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ error: '설정 업데이트 중 오류가 발생했습니다.' });
  }
});

export default router;