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
        
        .calendar-view { margin: 30px 0; padding: 25px; background: #f8f9fa; border-radius: 12px; }
        .calendar-view h4 { margin-bottom: 20px; color: #1a73e8; }
        .calendar-legend { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .legend-item { display: flex; align-items: center; gap: 8px; }
        .legend-color { width: 20px; height: 20px; border-radius: 4px; }
        .legend-color.prenatal { background: linear-gradient(135deg, #e3f2fd, #90caf9); }
        .legend-color.birth-day { background: #f44336; }
        .legend-color.postnatal { background: linear-gradient(135deg, #1976d2, #1565c0); }
        .legend-color.parental { background: linear-gradient(135deg, #e8f5e8, #81c784); }
        
        .period-summary { display: grid; gap: 15px; }
        .period-item { padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .period-item strong { color: #1a73e8; }
        .prenatal-bg { background: linear-gradient(135deg, #e3f2fd, #f8f9ff); border-left: 4px solid #90caf9; }
        .birth-bg { background: linear-gradient(135deg, #ffebee, #fff5f5); border-left: 4px solid #f44336; }
        .postnatal-bg { background: linear-gradient(135deg, #e1f5fe, #f3f8ff); border-left: 4px solid #1976d2; }
        .parental-bg { background: linear-gradient(135deg, #e8f5e8, #f1f8e9); border-left: 4px solid #4caf50; }
        
        .action-buttons { display: flex; gap: 15px; margin-top: 30px; justify-content: center; }
        .btn-secondary { background: linear-gradient(135deg, #757575, #616161); color: white; padding: 12px 25px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(117, 117, 117, 0.3); }
        
        @media (max-width: 768px) { 
            .gender-options { grid-template-columns: 1fr; } 
            .result-grid { grid-template-columns: 1fr; }
            .action-buttons { flex-direction: column; }
            .calendar-legend { justify-content: center; }
        }
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
                        <div class="gender-option" data-value="mother">
                            <strong>👩‍🍼 엄마</strong>
                            <small>출산전후휴가 + 육아휴직</small>
                        </div>
                        <div class="gender-option" data-value="father">
                            <strong>👨‍🍼 아빠</strong>
                            <small>육아휴직만 가능</small>
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
                
                <div class="form-group">
                    <label for="actualBirthDate">실제 출산일 (선택사항)</label>
                    <input type="date" id="actualBirthDate">
                    <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">
                        조산이나 연기된 경우 실제 출산일을 입력하면 더 정확한 계산이 가능합니다
                    </small>
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
        let selectedApplicant = '';
        let selectedPregnancyType = '';
        
        // 신청자 및 태아 유형 선택 이벤트
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', function() {
                const parentGroup = this.parentElement;
                parentGroup.querySelectorAll('.gender-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                if (parentGroup.previousElementSibling.textContent.includes('신청자')) {
                    selectedApplicant = this.dataset.value;
                    document.getElementById('applicant').value = selectedApplicant;
                } else if (parentGroup.previousElementSibling.textContent.includes('태아')) {
                    selectedPregnancyType = this.dataset.value;
                    document.getElementById('pregnancyType').value = selectedPregnancyType;
                }
            });
        });
        
        // 폼 제출 이벤트
        document.getElementById('calculatorForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const dueDate = document.getElementById('dueDate').value;
            const actualBirthDate = document.getElementById('actualBirthDate').value;
            const applicant = selectedApplicant;
            const pregnancyType = selectedPregnancyType;
            
            if (!dueDate || !applicant || !pregnancyType) {
                alert('모든 필수 항목을 선택해주세요.');
                return;
            }
            
            // 로딩 표시
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            
            try {
                const result = calculateMaternityLeave(dueDate, actualBirthDate, applicant, pregnancyType);
                
                setTimeout(() => {
                    displayResult(result);
                    document.getElementById('loading').style.display = 'none';
                }, 1000);
                
            } catch (error) {
                console.error('계산 오류:', error);
                alert('계산 중 오류가 발생했습니다.');
                document.getElementById('loading').style.display = 'none';
            }
        });
        
        function calculateMaternityLeave(dueDateStr, actualBirthDateStr, applicant, pregnancyType) {
            const dueDate = new Date(dueDateStr);
            const actualBirthDate = actualBirthDateStr ? new Date(actualBirthDateStr) : dueDate;
            
            // 출산휴가 기간 설정
            const isMultiple = pregnancyType === 'multiple';
            const totalMaternityDays = isMultiple ? 120 : 90;
            const paidMaternityDays = isMultiple ? 75 : 60;
            const minPostnatalDays = isMultiple ? 60 : 45;
            
            let prenatalStart, postnatalEnd;
            
            if (applicant === 'mother') {
                // 엄마의 경우 출산휴가 계산
                const prenatalDays = totalMaternityDays - minPostnatalDays;
                
                prenatalStart = new Date(actualBirthDate);
                prenatalStart.setDate(actualBirthDate.getDate() - prenatalDays);
                
                postnatalEnd = new Date(actualBirthDate);
                postnatalEnd.setDate(actualBirthDate.getDate() + minPostnatalDays - 1);
                
                // 실제 출산일이 예정일과 다른 경우 조정
                if (actualBirthDate < dueDate) {
                    // 조산: 산후 휴가 연장
                    const earlyDays = Math.floor((dueDate - actualBirthDate) / (1000 * 60 * 60 * 24));
                    postnatalEnd.setDate(postnatalEnd.getDate() + earlyDays);
                }
            }
            
            // 육아휴직 계산
            let parentalStart, parentalEnd;
            if (applicant === 'mother' && prenatalStart && postnatalEnd) {
                parentalStart = new Date(postnatalEnd);
                parentalStart.setDate(postnatalEnd.getDate() + 1);
            } else {
                // 아빠의 경우 출산일부터 시작 가능
                parentalStart = new Date(actualBirthDate);
            }
            
            parentalEnd = new Date(parentalStart);
            parentalEnd.setDate(parentalStart.getDate() + (365 + 183) - 1); // 1년 6개월
            
            return {
                출산예정일: dueDate.toISOString().split('T')[0],
                실제출산일: actualBirthDate.toISOString().split('T')[0],
                신청자: applicant,
                태아유형: pregnancyType,
                출산휴가_총일수: applicant === 'mother' ? totalMaternityDays : 0,
                출산휴가_유급일수: applicant === 'mother' ? paidMaternityDays : 0,
                산전휴가: applicant === 'mother' ? {
                    시작일: prenatalStart.toISOString().split('T')[0],
                    종료일: new Date(actualBirthDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                } : null,
                산후휴가: applicant === 'mother' ? {
                    시작일: actualBirthDate.toISOString().split('T')[0],
                    종료일: postnatalEnd.toISOString().split('T')[0]
                } : null,
                산후_법적보장충족: true,
                육아휴직: {
                    시작일: parentalStart.toISOString().split('T')[0],
                    종료일: parentalEnd.toISOString().split('T')[0],
                    총일수: Math.floor((parentalEnd - parentalStart) / (1000 * 60 * 60 * 24)) + 1
                },
                계산일시: new Date().toISOString()
            };
        }
        
        function displayResult(data) {
            const resultDiv = document.getElementById('result');
            
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    weekday: 'long' 
                });
            };
            
            const formatDateShort = (dateStr) => {
                return dateStr.replace(/-/g, '.');
            };
            
            let calendarHTML = '';
            if (data.신청자 === 'mother') {
                calendarHTML = \`
                    <div class="calendar-view">
                        <h4>📅 휴가 기간 달력</h4>
                        <div class="calendar-legend">
                            <div class="legend-item">
                                <span class="legend-color prenatal"></span>
                                <span>산전휴가</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color birth-day"></span>
                                <span>출산일</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color postnatal"></span>
                                <span>산후휴가</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color parental"></span>
                                <span>육아휴직</span>
                            </div>
                        </div>
                        <div class="period-summary">
                            <div class="period-item prenatal-bg">
                                <strong>산전휴가</strong>
                                <span>\${formatDateShort(data.산전휴가.시작일)} ~ \${formatDateShort(data.산전휴가.종료일)}</span>
                            </div>
                            <div class="period-item birth-bg">
                                <strong>출산일</strong>
                                <span>\${formatDateShort(data.실제출산일)}</span>
                            </div>
                            <div class="period-item postnatal-bg">
                                <strong>산후휴가</strong>
                                <span>\${formatDateShort(data.산후휴가.시작일)} ~ \${formatDateShort(data.산후휴가.종료일)}</span>
                            </div>
                            <div class="period-item parental-bg">
                                <strong>육아휴직</strong>
                                <span>\${formatDateShort(data.육아휴직.시작일)} ~ \${formatDateShort(data.육아휴직.종료일)}</span>
                            </div>
                        </div>
                    </div>
                \`;
            } else {
                calendarHTML = \`
                    <div class="calendar-view">
                        <h4>📅 휴가 기간 달력</h4>
                        <div class="calendar-legend">
                            <div class="legend-item">
                                <span class="legend-color birth-day"></span>
                                <span>출산일</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color parental"></span>
                                <span>육아휴직</span>
                            </div>
                        </div>
                        <div class="period-summary">
                            <div class="period-item birth-bg">
                                <strong>출산일</strong>
                                <span>\${formatDateShort(data.실제출산일)}</span>
                            </div>
                            <div class="period-item parental-bg">
                                <strong>육아휴직</strong>
                                <span>\${formatDateShort(data.육아휴직.시작일)} ~ \${formatDateShort(data.육아휴직.종료일)}</span>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            resultDiv.innerHTML = \`
                <h3>📊 계산 결과</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>출산예정일</strong>
                        \${formatDate(data.출산예정일)}
                    </div>
                    <div class="result-item">
                        <strong>실제 출산일</strong>
                        \${formatDate(data.실제출산일)}
                    </div>
                    <div class="result-item">
                        <strong>태아 유형</strong>
                        \${data.태아유형 === 'single' ? '단태아' : '다태아 (쌍둥이 이상)'}
                    </div>
                    \${data.신청자 === 'mother' ? \`
                    <div class="result-item">
                        <strong>출산전후휴가</strong>
                        총 \${data.출산휴가_총일수}일 (유급 \${data.출산휴가_유급일수}일)
                    </div>
                    \` : ''}
                    <div class="result-item">
                        <strong>육아휴직</strong>
                        총 \${data.육아휴직.총일수}일 (최대 1년 6개월)
                    </div>
                </div>
                
                \${calendarHTML}
                
                <div class="info-box info-salary">
                    <strong>💰 급여 안내</strong><br>
                    \${data.신청자 === 'mother' ? 
                        \`• 출산전후휴가: 통상임금의 100% (회사 지급, 유급 \${data.출산휴가_유급일수}일)<br>• 무급 기간: \${data.출산휴가_총일수 - data.출산휴가_유급일수}일<br>• 육아휴직: 통상임금의 80% (상한 월 150만원, 고용보험 지급)\` : 
                        '• 육아휴직: 통상임금의 80% (상한 월 150만원, 고용보험 지급)'
                    }
                </div>
                
                <div class="info-box info-tips">
                    <strong>📋 신청 시 참고사항</strong><br>
                    \${data.신청자 === 'mother' ? 
                        \`• 산후 법적 보장: \${data.태아유형 === 'single' ? '45일' : '60일'} 이상 확보됨 ✅<br>• 육아휴직은 출산전후휴가 종료 다음날부터 시작 가능<br>• 휴직 개시 30일 전 사전 신청 필요\` :
                        '• 배우자의 출산일부터 육아휴직 시작 가능<br>• 부모 동시 사용 시 각각 최대 1년 6개월 가능<br>• 휴직 개시 30일 전 사전 신청 필요'
                    }
                </div>
                
                <div class="action-buttons">
                    <button onclick="downloadJSON()" class="btn-secondary">📄 JSON 다운로드</button>
                    <button onclick="downloadPDF()" class="btn-secondary">📋 PDF 다운로드</button>
                </div>
            \`;
            
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
            
            // 전역 변수에 결과 저장 (다운로드용)
            window.calculationResult = data;
        }
        
        function downloadJSON() {
            const dataStr = JSON.stringify(window.calculationResult, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = \`육아휴직계산_\${window.calculationResult.실제출산일}.json\`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
        
        function downloadPDF() {
            // PDF 생성 기능 (실제 구현 시 jsPDF 라이브러리 필요)
            alert('PDF 다운로드 기능은 개발 중입니다. JSON 형태로 먼저 다운로드해주세요.');
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