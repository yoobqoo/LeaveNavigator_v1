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
        .calendar-view h4 { margin-bottom: 20px; color: #1a73e8; }
        .calendar-legend { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .legend-item { display: flex; align-items: center; gap: 8px; }
        .legend-color { width: 20px; height: 20px; border-radius: 4px; }
        .legend-color.prenatal { background: #ffc107; }
        .legend-color.birth-day { background: #f44336; }
        .legend-color.postnatal { background: #2196f3; }
        .legend-color.parental { background: #4caf50; }
        .legend-color.paternal { background: #ff9800; }
        
        .period-summary { display: grid; gap: 15px; }
        .period-item { padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .period-item strong { color: #1a73e8; }
        .prenatal-bg { background: #fff8e1; border-left: 4px solid #ffc107; }
        .birth-bg { background: #ffebee; border-left: 4px solid #f44336; }
        .postnatal-bg { background: #e3f2fd; border-left: 4px solid #2196f3; }
        .parental-bg { background: #e8f5e8; border-left: 4px solid #4caf50; }
        .paternal-bg { background: #fff3e0; border-left: 4px solid #ff9800; }
        
        .action-buttons { display: flex; gap: 15px; margin-top: 30px; justify-content: center; }
        .btn-primary { background: linear-gradient(135deg, #ff6b9d, #e91e63); color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; width: 100%; margin-bottom: 20px; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3); }
        .btn-secondary { background: linear-gradient(135deg, #757575, #616161); color: white; padding: 12px 25px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(117, 117, 117, 0.3); }
        
        .period-highlight { 
            background: linear-gradient(135deg, #ff6b9d, #e91e63); 
            color: white; 
            padding: 20px; 
            border-radius: 12px; 
            text-align: center; 
            margin: 20px 0; 
            font-size: 24px; 
            font-weight: bold; 
            box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
        }
        
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
            <h1>출산휴가 & 육아휴직 계산기</h1>
            <p>한큐에 확인하는 출산전후휴가, 육아휴직 기간 (2025년 법령 업데이트)</p>
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
                const result = calculateMaternityLeave(dueDate, applicant, pregnancyType);
                
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
        
        function calculateMaternityLeave(dueDateStr, applicant, pregnancyType) {
            const dueDate = new Date(dueDateStr);
            
            // 출산휴가 기간 설정
            const isMultiple = pregnancyType === 'multiple';
            const totalMaternityDays = isMultiple ? 120 : 90;
            const paidMaternityDays = isMultiple ? 75 : 60;
            const minPostnatalDays = isMultiple ? 60 : 45;
            
            let prenatalStart, postnatalEnd;
            
            if (applicant === 'mother') {
                // 엄마의 경우 출산휴가 계산
                const prenatalDays = totalMaternityDays - minPostnatalDays;
                
                prenatalStart = new Date(dueDate);
                prenatalStart.setDate(dueDate.getDate() - prenatalDays);
                
                postnatalEnd = new Date(dueDate);
                postnatalEnd.setDate(dueDate.getDate() + minPostnatalDays - 1);
            }
            
            // 아빠의 배우자 출산휴가 계산 (20일)
            let paternalLeaveStart, paternalLeaveEnd;
            if (applicant === 'father') {
                paternalLeaveStart = new Date(dueDate);
                paternalLeaveEnd = new Date(dueDate);
                paternalLeaveEnd.setDate(dueDate.getDate() + 19); // 20일 (0부터 시작하므로 +19)
            }
            
            // 육아휴직 계산 (1년 = 365일)
            let parentalStart, parentalEnd;
            if (applicant === 'mother' && prenatalStart && postnatalEnd) {
                parentalStart = new Date(postnatalEnd);
                parentalStart.setDate(postnatalEnd.getDate() + 1);
            } else if (applicant === 'father') {
                // 아빠의 경우 배우자 출산휴가 이후부터 육아휴직 시작 가능
                parentalStart = new Date(paternalLeaveEnd);
                parentalStart.setDate(paternalLeaveEnd.getDate() + 1);
            }
            
            parentalEnd = new Date(parentalStart);
            parentalEnd.setDate(parentalStart.getDate() + 365 - 1); // 1년 = 365일
            
            // 주말 및 공휴일 계산
            const holidays2025 = [
                '2025-01-01', '2025-01-28', '2025-01-29', '2025-01-30',
                '2025-03-01', '2025-05-01', '2025-05-05', '2025-06-06',
                '2025-08-15', '2025-10-03', '2025-10-09', '2025-12-25'
            ];
            
            const calculatePeriodInfo = (startDate, endDate) => {
                const start = new Date(startDate);
                const end = new Date(endDate);
                let weekdays = 0;
                let weekends = 0;
                let holidays = 0;
                
                const current = new Date(start);
                while (current <= end) {
                    const dayOfWeek = current.getDay();
                    const dateStr = current.toISOString().split('T')[0];
                    
                    if (holidays2025.includes(dateStr)) {
                        holidays++;
                    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                        weekends++;
                    } else {
                        weekdays++;
                    }
                    
                    current.setDate(current.getDate() + 1);
                }
                
                return { weekdays, weekends, holidays };
            };
            
            let maternityInfo = null;
            let paternalInfo = null;
            let parentalInfo = null;
            
            if (applicant === 'mother') {
                maternityInfo = calculatePeriodInfo(prenatalStart, postnatalEnd);
            } else if (applicant === 'father') {
                paternalInfo = calculatePeriodInfo(paternalLeaveStart, paternalLeaveEnd);
            }
            
            parentalInfo = calculatePeriodInfo(parentalStart, parentalEnd);
            
            return {
                출산예정일: dueDate.toISOString().split('T')[0],
                신청자: applicant,
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
                산후_법적보장충족: true,
                육아휴직: {
                    시작일: parentalStart.toISOString().split('T')[0],
                    종료일: parentalEnd.toISOString().split('T')[0],
                    총일수: 365
                },
                출산휴가_상세: applicant === 'mother' ? {
                    평일: maternityInfo.weekdays,
                    주말: maternityInfo.weekends,
                    공휴일: maternityInfo.holidays
                } : null,
                배우자출산휴가_상세: applicant === 'father' ? {
                    평일: paternalInfo.weekdays,
                    주말: paternalInfo.weekends,
                    공휴일: paternalInfo.holidays
                } : null,
                육아휴직_상세: {
                    평일: parentalInfo.weekdays,
                    주말: parentalInfo.weekends,
                    공휴일: parentalInfo.holidays
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
            
            const formatDateWithWeekday = (dateStr) => {
                const date = new Date(dateStr);
                const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
                return \`\${dateStr.replace(/-/g, '.')} (\${weekdays[date.getDay()]})\`;
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
                                <div>
                                    <span>\${formatDateWithWeekday(data.산전휴가.시작일)} ~ \${formatDateWithWeekday(data.산전휴가.종료일)}</span>
                                    <br><small>평일 \${data.출산휴가_상세.평일}일, 주말 \${data.출산휴가_상세.주말}일, 공휴일 \${data.출산휴가_상세.공휴일}일</small>
                                </div>
                            </div>
                            <div class="period-item birth-bg">
                                <strong>출산예정일</strong>
                                <span>\${formatDateWithWeekday(data.출산예정일)}</span>
                            </div>
                            <div class="period-item postnatal-bg">
                                <strong>산후휴가 (의무 \${data.산후휴가.의무기간}일)</strong>
                                <div>
                                    <span>\${formatDateWithWeekday(data.산후휴가.시작일)} ~ \${formatDateWithWeekday(data.산후휴가.종료일)}</span>
                                    <br><small>⚠️ 산후휴가는 법적으로 의무 \${data.산후휴가.의무기간}일 이상 확보해야 합니다</small>
                                </div>
                            </div>
                            <div class="period-item parental-bg">
                                <strong>육아휴직 (1년)</strong>
                                <div>
                                    <span>\${formatDateWithWeekday(data.육아휴직.시작일)} ~ \${formatDateWithWeekday(data.육아휴직.종료일)}</span>
                                    <br><small>평일 \${data.육아휴직_상세.평일}일, 주말 \${data.육아휴직_상세.주말}일, 공휴일 \${data.육아휴직_상세.공휴일}일</small>
                                </div>
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
                                <span class="legend-color paternal"></span>
                                <span>배우자출산휴가</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color parental"></span>
                                <span>육아휴직</span>
                            </div>
                        </div>
                        <div class="period-summary">
                            <div class="period-item birth-bg">
                                <strong>출산예정일</strong>
                                <span>\${formatDateWithWeekday(data.출산예정일)}</span>
                            </div>
                            <div class="period-item paternal-bg">
                                <strong>배우자출산휴가 (20일)</strong>
                                <div>
                                    <span>\${formatDateWithWeekday(data.배우자출산휴가.시작일)} ~ \${formatDateWithWeekday(data.배우자출산휴가.종료일)}</span>
                                    <br><small>평일 \${data.배우자출산휴가_상세.평일}일, 주말 \${data.배우자출산휴가_상세.주말}일, 공휴일 \${data.배우자출산휴가_상세.공휴일}일</small>
                                </div>
                            </div>
                            <div class="period-item parental-bg">
                                <strong>육아휴직 (1년)</strong>
                                <div>
                                    <span>\${formatDateWithWeekday(data.육아휴직.시작일)} ~ \${formatDateWithWeekday(data.육아휴직.종료일)}</span>
                                    <br><small>평일 \${data.육아휴직_상세.평일}일, 주말 \${data.육아휴직_상세.주말}일, 공휴일 \${data.육아휴직_상세.공휴일}일</small>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            // 기간별 일수 계산
            let prenatalDays = 0, postnatalDays = 0, paternalDays = 0, parentalDays = 365;
            
            if (data.신청자 === 'mother') {
                prenatalDays = Math.floor((new Date(data.출산예정일) - new Date(data.산전휴가.시작일)) / (1000 * 60 * 60 * 24));
                postnatalDays = data.산후휴가.의무기간;
            } else if (data.신청자 === 'father') {
                paternalDays = data.배우자출산휴가.총일수;
            }
            
            resultDiv.innerHTML = \`
                <h3>📊 계산 결과</h3>
                \${data.신청자 === 'mother' ? \`
                <div class="period-highlight">
                    산전휴가 \${prenatalDays}일 + 산후휴가 \${postnatalDays}일 + 육아휴직 \${parentalDays}일
                </div>
                \` : \`
                <div class="period-highlight">
                    배우자출산휴가 \${paternalDays}일 + 육아휴직 \${parentalDays}일
                </div>
                \`}
                <div class="result-grid">
                    <div class="result-item">
                        <strong>출산예정일</strong>
                        \${formatDate(data.출산예정일)}
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
                    \${data.신청자 === 'father' ? \`
                    <div class="result-item">
                        <strong>배우자출산휴가</strong>
                        총 \${data.배우자출산휴가.총일수}일 (근로제공의무일 기준)
                    </div>
                    \` : ''}
                    <div class="result-item">
                        <strong>육아휴직</strong>
                        총 \${data.육아휴직.총일수}일 (1년)
                    </div>
                </div>
                
                \${calendarHTML}
                
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
            
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
            
            // 전역 변수에 결과 저장 (다운로드용)
            window.calculationResult = data;
        }
        

        
        function downloadPDF() {
            if (!window.calculationResult) {
                alert('계산 결과가 없습니다. 먼저 계산을 완료해주세요.');
                return;
            }
            
            const data = window.calculationResult;
            
            // 정부 양식 HTML 생성 (고용노동부 제공 양식 기반)
            const htmlContent = \`
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>출산전후휴가·육아휴직 통합 신청서</title>
  <style>
    body { font-family: 'Malgun Gothic', sans-serif; font-size: 12px; margin: 20px; line-height: 1.4; }
    .header { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px; }
    .notice { font-size: 10px; margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td { border: 1px solid #000; padding: 6px; vertical-align: middle; }
    .label { background-color: #f5f5f5; font-weight: bold; width: 15%; text-align: center; }
    .content { width: 35%; }
    .section-title { background-color: #e0e0e0; font-weight: bold; text-align: center; padding: 8px; }
    .signature { text-align: right; margin-top: 30px; }
    .instructions { margin-top: 30px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">출산전후휴가(배우자 출산휴가)·육아휴직 통합 신청서</div>
  <div class="notice">※ 아래의 작성방법을 읽고 작성하여 주시기 바라며, 사업주확인란은 작성하지 않습니다.</div>
  
  <table>
    <tr>
      <td class="label">성명</td>
      <td class="content">_________________</td>
      <td class="label">생년월일</td>
      <td class="content">_________________</td>
    </tr>
    <tr>
      <td class="label">주소</td>
      <td colspan="3">_________________________________ (연락처: _________________)</td>
    </tr>
    <tr>
      <td class="section-title" colspan="4">신청인</td>
    </tr>
    <tr>
      <td class="label">소속부서</td>
      <td class="content">_________________</td>
      <td class="label">직위(직급)</td>
      <td class="content">_________________</td>
    </tr>
    <tr>
      <td class="label">대상 자녀(영유아) 성명</td>
      <td class="content">_________________</td>
      <td class="label">대상 자녀 생년월일(출산예정일)</td>
      <td class="content"><strong>\${data.출산예정일}</strong></td>
    </tr>
  </table>
  
  <table>
    <tr>
      <td class="section-title" colspan="4">신청내용</td>
    </tr>
    \${data.신청자 === 'mother' ? \`
    <tr>
      <td colspan="4" style="text-align: center; padding: 10px;">
        <strong>출산전후휴가 신청 기간 (\${data.출산휴가_총일수}일)</strong><br>
        개시: <strong>\${data.산전휴가.시작일}</strong> ~ 종료: <strong>\${data.산후휴가.종료일}</strong>
      </td>
    </tr>
    \` : \`
    <tr>
      <td colspan="4" style="text-align: center; padding: 10px;">
        <strong>배우자 출산휴가 신청 기간 (\${data.배우자출산휴가.총일수}일)</strong><br>
        개시: <strong>\${data.배우자출산휴가.시작일}</strong> ~ 종료: <strong>\${data.배우자출산휴가.종료일}</strong>
      </td>
    </tr>
    \`}
    <tr>
      <td colspan="4" style="text-align: center; padding: 10px;">
        <strong>육아휴직 기간 (\${data.육아휴직.총일수}일)</strong><br>
        개시: <strong>\${data.육아휴직.시작일}</strong> ~ 종료: <strong>\${data.육아휴직.종료일}</strong>
      </td>
    </tr>
  </table>
  
  <p style="margin: 20px 0;">
    「남녀고용평등과 일·가정 양립 지원에 관한 법률」 제19조, 같은 법 시행령 제11조제2항 및 같은 법 시행규칙 제14조의2에 따라 위와 같이 \${data.신청자 === 'mother' ? '출산전후휴가' : '배우자 출산휴가'}와 함께 육아휴직을 신청합니다.
  </p>
  
  <div class="signature">
    ____년 ____월 ____일<br><br>
    신청인 _________________ (인)
  </div>
  
  <div class="instructions">
    <strong>작성방법</strong><br>
    1. 소속부서 및 직위(직급)란에는 육아휴직 신청 시의 소속부서 및 직위(직급)를 적습니다.<br>
    2. 대상 자녀(영유아) 성명란에는 대상 자녀(영유아)의 성명을 적습니다.<br>
    3. 신청내용란에는 출산전후휴가(또는 배우자 출산휴가) 및 육아휴직의 개시·종료일을 적습니다.<br>
    ※ 휴가 또는 휴직을 나누어 사용하려는 경우에는 나누어 사용하려는 각각의 휴가 또는 휴직의 개시·종료일을 구분하여 적습니다.
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
  <script>
    window.onload = function() {
      const opt = {
        margin: 1,
        filename: '출산휴가육아휴직통합신청서_\${data.출산예정일.replace(/-/g, '')}.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(document.body).save();
    };
  </script>
</body>
</html>
            \`;
            
            // 새 창에서 PDF 생성
            const newWindow = window.open('', '_blank');
            newWindow.document.write(htmlContent);
            newWindow.document.close();
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