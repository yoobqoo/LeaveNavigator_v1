const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>육아휴직 계산기 테스트</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #4285F4; text-align: center; }
        .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .feature { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #4285F4; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍼 육아휴직 계산기</h1>
        
        <div class="status">
            <strong>✅ 서버 실행 성공!</strong><br>
            포트 3001에서 정상 작동 중입니다.
        </div>
        
        <h2>구현된 기능들:</h2>
        <div class="feature">📅 시각적 캘린더로 휴가 기간 표시</div>
        <div class="feature">🤰 출산전후휴가 자동 계산 (90일)</div>
        <div class="feature">👶 육아휴직 기간 계산 (365일)</div>
        <div class="feature">🇰🇷 한국 공휴일 데이터 반영</div>
        <div class="feature">💰 급여 정보 및 권장사항 제공</div>
        <div class="feature">📱 반응형 모바일/데스크톱 디자인</div>
        
        <div style="text-align: center; margin-top: 30px;">
            <p>React + TypeScript + Express 기반</p>
            <p>Google Calendar 스타일 UI</p>
        </div>
    </div>
</body>
</html>`;
  
  res.end(html);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 테스트 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 브라우저에서 확인: http://localhost:${PORT}`);
});