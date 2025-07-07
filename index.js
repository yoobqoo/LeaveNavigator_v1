// 육아휴직 계산기 - Express 서버
const express = require('express');
const { createServer } = require('vite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  console.log('🚀 육아휴직 계산기 시작 중...');
  
  // JSON 파싱 미들웨어
  app.use(express.json());
  
  // 기본 API 라우트들
  app.get('/api/settings', (req, res) => {
    res.json({
      id: 'default',
      maternityLeaveDays: 90,
      paternalLeaveDays: 365,
      prenatalDays: 45,
      postnatalDays: 45,
      isCustomizable: true
    });
  });
  
  app.post('/api/calculate-leave', (req, res) => {
    const { dueDate, gender } = req.body;
    
    if (!dueDate || !gender) {
      return res.status(400).json({ error: '출산예정일과 성별을 입력해주세요.' });
    }
    
    const due = new Date(dueDate);
    const maternityStart = new Date(due);
    maternityStart.setDate(due.getDate() - 45);
    
    const maternityEnd = new Date(due);
    maternityEnd.setDate(due.getDate() + 45);
    
    const parentalStart = gender === 'female' ? 
      new Date(maternityEnd.getTime() + 24 * 60 * 60 * 1000) : 
      due;
    
    const parentalEnd = new Date(parentalStart);
    parentalEnd.setDate(parentalStart.getDate() + 365);
    
    const result = {
      id: Math.random().toString(36).substr(2, 9),
      dueDate: due,
      maternityStartDate: maternityStart,
      maternityEndDate: maternityEnd,
      paternalLeaveStartDate: parentalStart,
      paternalLeaveEndDate: parentalEnd,
      totalMaternityDays: gender === 'female' ? 90 : 0,
      totalParentalDays: 365,
      recommendedSchedule: gender === 'female' ? 
        '출산전후휴가는 출산예정일 전후 각각 45일씩 총 90일입니다. 육아휴직은 출산전후휴가 종료 다음날부터 시작할 수 있습니다.' :
        '배우자의 출산일부터 육아휴직을 시작할 수 있습니다. 육아휴직은 최대 1년(365일)까지 가능합니다.',
      gender,
      createdAt: new Date()
    };
    
    res.json(result);
  });
  
  app.get('/api/holidays', (req, res) => {
    const holidays = [
      { id: '1', date: '2024-01-01', name: '신정', isNationalHoliday: true },
      { id: '2', date: '2024-02-10', name: '설날', isNationalHoliday: true },
      { id: '3', date: '2024-03-01', name: '삼일절', isNationalHoliday: true },
      { id: '4', date: '2024-05-05', name: '어린이날', isNationalHoliday: true },
      { id: '5', date: '2024-06-06', name: '현충일', isNationalHoliday: true },
      { id: '6', date: '2024-08-15', name: '광복절', isNationalHoliday: true },
      { id: '7', date: '2024-10-03', name: '개천절', isNationalHoliday: true },
      { id: '8', date: '2024-10-09', name: '한글날', isNationalHoliday: true },
      { id: '9', date: '2024-12-25', name: '크리스마스', isNationalHoliday: true }
    ];
    res.json(holidays);
  });

  // Vite 개발 서버 설정
  try {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: './client'
    });
    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
  } catch (error) {
    console.log('Vite 서버 설정 실패, 정적 파일 서빙으로 대체');
    app.use(express.static('./client'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 육아휴직 계산기 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📱 클라이언트: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);