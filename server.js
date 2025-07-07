const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  if (req.url === '/') {
    res.end(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>육아휴직 계산기</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #4285F4, #1a73e8); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .form-group { margin-bottom: 25px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }
        input, select { width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; transition: border-color 0.3s; }
        input:focus, select:focus { outline: none; border-color: #4285F4; box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1); }
        .gender-options { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; }
        .gender-option { padding: 20px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s; }
        .gender-option:hover { border-color: #4285F4; background: #f8f9ff; }
        .gender-option.selected { border-color: #4285F4; background: #4285F4; color: white; }
        .gender-option strong { display: block; font-size: 16px; margin-bottom: 5px; }
        .gender-option small { font-size: 12px; opacity: 0.8; }
        .btn-primary { background: linear-gradient(135deg, #4285F4, #1a73e8); color: white; padding: 18px 30px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 30px; transition: transform 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(66, 133, 244, 0.3); }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .result { margin-top: 40px; padding: 30px; background: #f8f9fa; border-radius: 12px; border-left: 5px solid #34a853; display: none; }
        .result h3 { color: #1a73e8; margin-bottom: 20px; font-size: 20px; }
        .result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .result-item { padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #4285F4; }
        .result-item strong { color: #1a73e8; display: block; margin-bottom: 8px; }
        .info-box { padding: 20px; margin: 20px 0; border-radius: 8px; }
        .info-salary { background: #fff3e0; border-left: 4px solid #ff9800; }
        .info-tips { background: #f3e5f5; border-left: 4px solid #9c27b0; }
        .loading { display: none; text-align: center; padding: 20px; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4285F4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) { .gender-options { grid-template-columns: 1fr; } .result-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍼 육아휴직 기간 계산기</h1>
            <p>출산예정일을 입력하여 출산전후휴가와 육아휴직 기간을 자동으로 계산해보세요</p>
        </div>
        <div class="content">
            <form id="calculatorForm">
                <div class="form-group">
                    <label for="dueDate">출산예정일</label>
                    <input type="date" id="dueDate" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="form-group">
                    <label>신청자 구분</label>
                    <div class="gender-options">
                        <div class="gender-option" data-value="female">
                            <strong>여성 (본인)</strong>
                            <small>출산전후휴가 + 육아휴직</small>
                        </div>
                        <div class="gender-option" data-value="male">
                            <strong>남성 (배우자)</strong>
                            <small>육아휴직만 가능</small>
                        </div>
                    </div>
                    <input type="hidden" id="gender" required>
                </div>
                
                <button type="submit" class="btn-primary">휴가 기간 계산하기</button>
            </form>
            
            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <p>계산 중입니다...</p>
            </div>
            
            <div id="result" class="result"></div>
        </div>
    </div>

    <script>
        let selectedGender = '';
        
        // 성별 선택 이벤트
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.gender-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedGender = this.dataset.value;
                document.getElementById('gender').value = selectedGender;
            });
        });
        
        // 폼 제출 이벤트
        document.getElementById('calculatorForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const dueDate = document.getElementById('dueDate').value;
            const gender = selectedGender;
            
            if (!dueDate || !gender) {
                alert('출산예정일과 성별을 모두 선택해주세요.');
                return;
            }
            
            // 로딩 표시
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            
            try {
                // 계산 로직 (백엔드 없이 프론트엔드에서 처리)
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
                
                const data = {
                    dueDate: due,
                    maternityStartDate: maternityStart,
                    maternityEndDate: maternityEnd,
                    paternalLeaveStartDate: parentalStart,
                    paternalLeaveEndDate: parentalEnd,
                    totalMaternityDays: gender === 'female' ? 90 : 0,
                    totalParentalDays: 365,
                    gender: gender
                };
                
                setTimeout(() => {
                    displayResult(data);
                    document.getElementById('loading').style.display = 'none';
                }, 1000);
                
            } catch (error) {
                console.error('계산 오류:', error);
                alert('계산 중 오류가 발생했습니다.');
                document.getElementById('loading').style.display = 'none';
            }
        });
        
        function displayResult(data) {
            const resultDiv = document.getElementById('result');
            const dueDate = new Date(data.dueDate);
            const maternityStart = new Date(data.maternityStartDate);
            const maternityEnd = new Date(data.maternityEndDate);
            const parentalStart = new Date(data.paternalLeaveStartDate);
            const parentalEnd = new Date(data.paternalLeaveEndDate);
            
            const formatDate = (date) => {
                return date.toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    weekday: 'long' 
                });
            };
            
            resultDiv.innerHTML = \`
                <h3>📊 계산 결과</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>출산예정일</strong>
                        \${formatDate(dueDate)}
                    </div>
                    \${data.gender === 'female' ? \`
                    <div class="result-item">
                        <strong>출산전후휴가 (90일)</strong>
                        \${formatDate(maternityStart)}<br>
                        ~ \${formatDate(maternityEnd)}
                    </div>
                    \` : ''}
                    <div class="result-item">
                        <strong>육아휴직 (365일)</strong>
                        \${formatDate(parentalStart)}<br>
                        ~ \${formatDate(parentalEnd)}
                    </div>
                </div>
                
                <div class="info-box info-salary">
                    <strong>💰 급여 안내</strong><br>
                    \${data.gender === 'female' ? 
                        '• 출산전후휴가: 통상임금의 100% (회사 지급)<br>• 육아휴직: 통상임금의 80% (상한 월 150만원, 고용보험 지급)' : 
                        '• 육아휴직: 통상임금의 80% (상한 월 150만원, 고용보험 지급)'
                    }
                </div>
                
                <div class="info-box info-tips">
                    <strong>📋 신청 시 참고사항</strong><br>
                    \${data.gender === 'female' ? 
                        '• 출산전후휴가는 출산예정일 전후 각각 45일씩 총 90일<br>• 육아휴직은 출산전후휴가 종료 다음날부터 시작 가능<br>• 휴직 개시 30일 전 사전 신청 필요' :
                        '• 배우자의 출산일부터 육아휴직 시작 가능<br>• 부모 동시 사용 시 각각 최대 1년 가능<br>• 휴직 개시 30일 전 사전 신청 필요'
                    }
                </div>
            \`;
            
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>`);
  } else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: '육아휴직 계산기 API',
      status: 'running',
      version: '1.0.0'
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>페이지를 찾을 수 없습니다</h1>');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 육아휴직 계산기가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 브라우저에서 확인: http://localhost:${PORT}`);
});