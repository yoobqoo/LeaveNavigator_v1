const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('육아휴직 계산기 서버 시작...');

app.use(express.json());
app.use(express.static('client'));

// 기본 HTML 페이지 제공
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>육아휴직 계산기</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: #4285F4; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { padding: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
        input, select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; }
        input:focus, select:focus { outline: none; border-color: #4285F4; }
        .btn-primary { background: #4285F4; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; width: 100%; margin-top: 20px; }
        .btn-primary:hover { background: #1a73e8; }
        .result { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #34a853; }
        .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; margin-top: 20px; background: #e0e0e0; border-radius: 8px; padding: 1px; }
        .calendar-day { background: white; padding: 10px; text-align: center; min-height: 40px; display: flex; align-items: center; justify-content: center; }
        .maternity { background: #34a853; color: white; }
        .parental { background: #1a73e8; color: white; }
        .due-date { background: #ea4335; color: white; font-weight: bold; }
        .legend { display: flex; gap: 20px; margin-top: 15px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 8px; }
        .legend-color { width: 16px; height: 16px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍼 한국 육아휴직 기간 계산기</h1>
            <p>출산예정일을 입력하여 출산전후휴가와 육아휴직 기간을 자동으로 계산해보세요</p>
        </div>
        <div class="content">
            <div class="form-group">
                <label for="dueDate">출산예정일</label>
                <input type="date" id="dueDate" min="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label for="gender">신청자 구분</label>
                <select id="gender">
                    <option value="">선택해주세요</option>
                    <option value="female">여성 (본인) - 출산전후휴가 + 육아휴직</option>
                    <option value="male">남성 (배우자) - 육아휴직만</option>
                </select>
            </div>
            
            <button class="btn-primary" onclick="calculateLeave()">휴가 기간 계산하기</button>
            
            <div id="result" style="display: none;"></div>
        </div>
    </div>

    <script>
        async function calculateLeave() {
            const dueDate = document.getElementById('dueDate').value;
            const gender = document.getElementById('gender').value;
            
            if (!dueDate || !gender) {
                alert('출산예정일과 성별을 모두 선택해주세요.');
                return;
            }
            
            try {
                const response = await fetch('/api/calculate-leave', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dueDate, gender })
                });
                
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                console.error('계산 오류:', error);
                alert('계산 중 오류가 발생했습니다.');
            }
        }
        
        function displayResult(data) {
            const resultDiv = document.getElementById('result');
            const dueDate = new Date(data.dueDate);
            const maternityStart = new Date(data.maternityStartDate);
            const maternityEnd = new Date(data.maternityEndDate);
            const parentalStart = new Date(data.paternalLeaveStartDate);
            const parentalEnd = new Date(data.paternalLeaveEndDate);
            
            resultDiv.innerHTML = \`
                <h3>계산 결과</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">
                    <div style="padding: 15px; background: #e8f5e8; border-radius: 8px;">
                        <strong>출산예정일</strong><br>
                        \${dueDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </div>
                    \${data.gender === 'female' ? \`
                    <div style="padding: 15px; background: #e8f4f8; border-radius: 8px;">
                        <strong>출산전후휴가 (90일)</strong><br>
                        \${maternityStart.toLocaleDateString('ko-KR')} ~ \${maternityEnd.toLocaleDateString('ko-KR')}
                    </div>
                    \` : ''}
                    <div style="padding: 15px; background: #f0f4ff; border-radius: 8px;">
                        <strong>육아휴직 (365일)</strong><br>
                        \${parentalStart.toLocaleDateString('ko-KR')} ~ \${parentalEnd.toLocaleDateString('ko-KR')}
                    </div>
                </div>
                
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>💰 급여 안내</strong><br>
                    \${data.gender === 'female' ? 
                        '• 출산전후휴가: 통상임금의 100% (회사 지급)<br>• 육아휴직: 통상임금의 80% (상한 월 150만원)' : 
                        '• 육아휴직: 통상임금의 80% (상한 월 150만원)'
                    }
                </div>
                
                <div style="background: #f3e5f5; padding: 15px; border-radius: 8px;">
                    <strong>📋 권장사항</strong><br>
                    \${data.recommendedSchedule}
                </div>
                
                <div class="legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background: #ea4335;"></div>
                        <span>출산예정일</span>
                    </div>
                    \${data.gender === 'female' ? \`
                    <div class="legend-item">
                        <div class="legend-color" style="background: #34a853;"></div>
                        <span>출산전후휴가</span>
                    </div>
                    \` : ''}
                    <div class="legend-item">
                        <div class="legend-color" style="background: #1a73e8;"></div>
                        <span>육아휴직</span>
                    </div>
                </div>
            \`;
            
            resultDiv.style.display = 'block';
        }
    </script>
</body>
</html>`;
  res.send(html);
});

// API 라우트들
app.get('/api', (req, res) => {
  res.json({
    message: '육아휴직 계산기 API',
    version: '1.0.0',
    endpoints: {
      settings: '/api/settings',
      calculate: '/api/calculate-leave',
      holidays: '/api/holidays'
    }
  });
});

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
      '출산전후휴가는 출산예정일 전후 각각 45일씩 총 90일입니다. 육아휴직은 출산전후휴가 종료 다음날부터 시작할 수 있습니다. 육아휴직은 최대 1년(365일)까지 가능합니다.' :
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 육아휴직 계산기가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 브라우저에서 확인: http://localhost:${PORT}`);
});