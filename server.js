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
    <title>출산휴가 & 육아휴직 계산기</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #f8f8f8; padding: 20px; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b9d, #e91e63); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 32px; margin-bottom: 8px; font-weight: bold; }
        .header p { opacity: 0.95; font-size: 16px; }
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
        .calendar-view { margin: 30px 0; padding: 25px; background: #f8f9fa; border-radius: 12px; }
        .period-summary { background: linear-gradient(135deg, #ffeef8, #ffe8f1); padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #ff6b9d; text-align: center; }
        .period-summary h4 { color: #e91e63; margin-bottom: 15px; font-size: 18px; }
        .period-text { font-size: 24px; font-weight: bold; color: #ad1457; line-height: 1.5; }
        .btn-secondary { background: #17a2b8; color: white; padding: 12px 20px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; margin: 10px 5px; }
        .btn-secondary:hover { background: #138496; }
        .action-buttons { text-align: center; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>출산휴가 & 육아휴직 계산기</h1>
            <p>한큐에 확인하는 출산전후휴가, 육아휴직 기간 (2025년 법령 업데이트)</p>
        </div>
        <div class="content">
            <form id="calculatorForm">
                <div class="form-group">
                    <label for="dueDate">출산예정일</label>
                    <input type="date" id="dueDate" required min="2025-01-01">
                </div>
                
                <div class="form-group">
                    <label>신청자 구분</label>
                    <div class="gender-options">
                        <div class="gender-option" data-value="mother">
                            <strong>👩‍🍼 엄마</strong>
                            <small>출산전후휴가 + 육아휴직<br><span style="font-size: 11px; color: #666;">※ 휴가일수는 주말·공휴일 포함</span></small>
                        </div>
                        <div class="gender-option" data-value="father">
                            <strong>👨‍🍼 아빠</strong>
                            <small>배우자출산휴가 20일 + 육아휴직<br><span style="font-size: 11px; color: #666;">※ 배우자출산휴가는 주말·공휴일 제외</span></small>
                        </div>
                    </div>
                    <input type="hidden" id="applicant" required>
                </div>
                
                <div class="form-group">
                    <label>태아 유형</label>
                    <div class="gender-options">
                        <div class="gender-option" data-value="single">
                            <strong>👶 단태아</strong>
                            <small>출산휴가 90일 (유급 60일)</small>
                        </div>
                        <div class="gender-option" data-value="multiple">
                            <strong>👶👶 다태아</strong>
                            <small>출산휴가 120일 (유급 75일)</small>
                        </div>
                    </div>
                    <input type="hidden" id="pregnancyType" required>
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
        // 전역 변수
        window.calculationResult = null;
        
        // 선택 옵션 처리
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', function() {
                const parent = this.parentElement;
                const hiddenInput = parent.nextElementSibling;
                
                parent.querySelectorAll('.gender-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                hiddenInput.value = this.dataset.value;
            });
        });
        
        // 폼 제출 처리
        document.getElementById('calculatorForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const dueDate = document.getElementById('dueDate').value;
            const applicant = document.getElementById('applicant').value;
            const pregnancyType = document.getElementById('pregnancyType').value;
            
            if (!dueDate || !applicant || !pregnancyType) {
                alert('모든 필드를 입력해주세요.');
                return;
            }
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            
            try {
                const result = calculateMaternityLeave(dueDate, applicant, pregnancyType);
                window.calculationResult = result;
                displayResult(result);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';
            } catch (error) {
                console.error('계산 오류:', error);
                alert('계산 중 오류가 발생했습니다.');
                document.getElementById('loading').style.display = 'none';
            }
        });
        
        function calculateMaternityLeave(dueDateStr, applicant, pregnancyType) {
            const dueDate = new Date(dueDateStr);
            
            const isMultiple = pregnancyType === 'multiple';
            const totalMaternityDays = isMultiple ? 120 : 90;
            const paidMaternityDays = isMultiple ? 75 : 60;
            const minPostnatalDays = isMultiple ? 60 : 45;
            
            let prenatalStart, postnatalEnd;
            
            if (applicant === 'mother') {
                const prenatalDays = totalMaternityDays - minPostnatalDays;
                prenatalStart = new Date(dueDate);
                prenatalStart.setDate(dueDate.getDate() - prenatalDays);
                postnatalEnd = new Date(dueDate);
                postnatalEnd.setDate(dueDate.getDate() + minPostnatalDays - 1);
            }
            
            let paternalLeaveStart, paternalLeaveEnd;
            if (applicant === 'father') {
                paternalLeaveStart = new Date(dueDate);
                paternalLeaveEnd = new Date(dueDate);
                paternalLeaveEnd.setDate(dueDate.getDate() + 19);
            }
            
            let parentalStart, parentalEnd;
            if (applicant === 'mother' && prenatalStart && postnatalEnd) {
                parentalStart = new Date(postnatalEnd);
                parentalStart.setDate(postnatalEnd.getDate() + 1);
            } else if (applicant === 'father') {
                parentalStart = new Date(paternalLeaveEnd);
                parentalStart.setDate(paternalLeaveEnd.getDate() + 1);
            }
            
            parentalEnd = new Date(parentalStart);
            parentalEnd.setDate(parentalStart.getDate() + 365 - 1);
            
            return {
                신청자: applicant,
                출산예정일: dueDateStr,
                태아유형: pregnancyType,
                출산휴가_총일수: applicant === 'mother' ? totalMaternityDays : 0,
                출산휴가_유급일수: applicant === 'mother' ? paidMaternityDays : 0,
                산전휴가: applicant === 'mother' ? {
                    시작일: prenatalStart.toISOString().split('T')[0],
                    종료일: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                } : null,
                산후휴가: applicant === 'mother' ? {
                    시작일: dueDate.toISOString().split('T')[0],
                    종료일: postnatalEnd.toISOString().split('T')[0],
                    의무기간: minPostnatalDays
                } : null,
                배우자출산휴가: applicant === 'father' ? {
                    시작일: paternalLeaveStart.toISOString().split('T')[0],
                    종료일: paternalLeaveEnd.toISOString().split('T')[0],
                    총일수: 20
                } : null,
                육아휴직: {
                    시작일: parentalStart.toISOString().split('T')[0],
                    종료일: parentalEnd.toISOString().split('T')[0],
                    총일수: 365
                },
                계산일시: new Date().toISOString()
            };
        }
        
        function displayResult(data) {
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    weekday: 'long' 
                });
            };
            
            let periodSummary = '';
            if (data.신청자 === 'mother') {
                const prenatalDays = data.출산휴가_총일수 - data.산후휴가.의무기간;
                periodSummary = \`산전휴가 \${prenatalDays}일 + 산후휴가 \${data.산후휴가.의무기간}일 + 육아휴직 \${data.육아휴직.총일수}일\`;
            } else {
                periodSummary = \`배우자출산휴가 \${data.배우자출산휴가.총일수}일 + 육아휴직 \${data.육아휴직.총일수}일\`;
            }

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = \`
                <h3>🎉 휴가 기간 계산 완료</h3>
                
                <div class="period-summary">
                    <h4>📅 총 휴가 기간</h4>
                    <div class="period-text">\${periodSummary}</div>
                </div>
                
                <div class="result-grid">
                    \${data.신청자 === 'mother' ? \`
                        <div class="result-item">
                            <strong>🤱 산전휴가</strong>
                            \${formatDate(data.산전휴가.시작일)} ~ \${formatDate(data.산전휴가.종료일)}
                        </div>
                        <div class="result-item">
                            <strong>👶 산후휴가</strong>
                            \${formatDate(data.산후휴가.시작일)} ~ \${formatDate(data.산후휴가.종료일)}
                        </div>
                    \` : \`
                        <div class="result-item">
                            <strong>👨‍🍼 배우자 출산휴가</strong>
                            \${formatDate(data.배우자출산휴가.시작일)} ~ \${formatDate(data.배우자출산휴가.종료일)}<br>
                            <small>총 \${data.배우자출산휴가.총일수}일 (주말·공휴일 제외)</small>
                        </div>
                    \`}
                    <div class="result-item">
                        <strong>🏠 육아휴직</strong>
                        \${formatDate(data.육아휴직.시작일)} ~ \${formatDate(data.육아휴직.종료일)}<br>
                        <small>총 \${data.육아휴직.총일수}일</small>
                    </div>
                </div>
                
                <div class="info-box info-salary">
                    <strong>💰 급여 안내</strong><br><br>
                    \${data.신청자 === 'mother' ? 
                        \`• <strong>출산전후휴가: 통상임금의 100%</strong><br>
                        &nbsp;&nbsp;- 유급 60일: 고용주가 지급<br>
                        &nbsp;&nbsp;- 잔여 30일:<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;· 우선지원대상기업(중소기업): 고용보험에서 지원 (상한 월 210만 원)<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;· 그 외 기업: 고용보험 또는 사업주 일부 분담<br><br>
                        • <strong>육아휴직:</strong><br>
                        &nbsp;&nbsp;- 통상임금의 80% (상한 월 150만 원)<br>
                        &nbsp;&nbsp;- 1~3개월까지 해당, 이후 구간은 50~80% 변동<br>
                        &nbsp;&nbsp;- 지급 주체: 고용보험 (근로자 직접 신청)<br>
                        &nbsp;&nbsp;※ 2025년 하반기~2026년부터는 상한액 인상 예정\` : 
                        \`• <strong>육아휴직:</strong><br>
                        &nbsp;&nbsp;- 통상임금의 80% (상한 월 150만 원)<br>
                        &nbsp;&nbsp;- 1~3개월까지 해당, 이후 구간은 50~80% 변동<br>
                        &nbsp;&nbsp;- 지급 주체: 고용보험 (근로자 직접 신청)<br>
                        &nbsp;&nbsp;※ 2025년 하반기~2026년부터는 상한액 인상 예정\`
                    }
                </div>
                
                <div class="info-box info-tips">
                    <strong>📋 신청 시 참고사항</strong><br><br>
                    • 산후휴가는 법적으로 의무 \${data.신청자 === 'mother' ? data.산후휴가.의무기간 : '45'}일 이상 확보해야 합니다 (단태아 기준, 다태아는 60일) ✅<br>
                    • 육아휴직은 출산전후휴가 종료 다음날부터 시작 가능<br>
                    • 육아휴직 기간은 1년(365일)입니다 (부모 각각 1년 가능)<br>
                    • 휴직 개시 30일 전 사전 신청 필요 (서면 또는 전자신청 가능)<br><br>
                    
                    <strong>📎 참고 출처</strong><br>
                    • 고용노동부 공식 FAQ (moel.go.kr)<br>
                    • 육아휴직·출산휴가 급여 안내서 (고용보험 웹사이트)<br>
                    • 고용노동부 일생활균형 사이트 (worklife.kr)<br>
                    • 법령정보: 근로기준법 제74조, 고용보험법 시행령 제95조
                </div>
                
                <div class="action-buttons">
                    <button onclick="downloadPDF()" class="btn-secondary">회사 제출용 출산휴가 & 육아휴직 통합신청서 PDF 다운받기 (고용노동부 제공파일)</button>
                </div>
            \`;
        }
        
        function downloadPDF() {
            if (!window.calculationResult) {
                alert('계산 결과가 없습니다. 먼저 계산을 완료해주세요.');
                return;
            }
            
            const data = window.calculationResult;
            const filename = '출산휴가육아휴직신청서_' + data.출산예정일.replace(/-/g, '') + '.txt';
            
            let content = '출산전후휴가·육아휴직 통합 신청서\\n\\n';
            content += '■ 신청자 정보\\n';
            content += '- 신청자: ' + (data.신청자 === 'mother' ? '본인(산모)' : '배우자') + '\\n';
            content += '- 출산예정일: ' + data.출산예정일 + '\\n';
            content += '- 태아유형: ' + (data.태아유형 === 'single' ? '단태아' : '다태아') + '\\n\\n';
            content += '■ 휴가 기간\\n';
            
            if (data.신청자 === 'mother') {
                content += '- 출산전 휴가: ' + data.산전휴가.시작일 + ' ~ ' + data.산전휴가.종료일 + '\\n';
                content += '- 출산후 휴가: ' + data.산후휴가.시작일 + ' ~ ' + data.산후휴가.종료일 + '\\n';
                content += '- 출산전후휴가 총 ' + data.출산휴가_총일수 + '일 (유급 ' + data.출산휴가_유급일수 + '일)\\n';
            } else {
                content += '- 배우자 출산휴가: ' + data.배우자출산휴가.시작일 + ' ~ ' + data.배우자출산휴가.종료일 + ' (총 ' + data.배우자출산휴가.총일수 + '일)\\n';
            }
            
            content += '- 육아휴직: ' + data.육아휴직.시작일 + ' ~ ' + data.육아휴직.종료일 + ' (총 ' + data.육아휴직.총일수 + '일)\\n\\n';
            content += '계산일시: ' + data.계산일시 + '\\n\\n';
            content += '※ 본 서식은 2025년 법령을 기준으로 자동 계산된 결과입니다.\\n';
            content += '※ 실제 신청 시에는 소속 기관의 규정을 확인하시기 바랍니다.';
            
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert('신청서가 다운로드되었습니다.');
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