# Project Overview

한국 육아휴직 기간 계산기 - 출산예정일을 입력하여 출산전후휴가와 육아휴직 기간을 자동으로 계산해주는 웹 애플리케이션입니다. Google Calendar에서 영감을 받은 시각적 캘린더 인터페이스를 제공합니다.

## System Architecture

**Frontend**: React + TypeScript + Vite + Tailwind CSS
- 시각적 캘린더 컴포넌트로 휴가 기간 표시
- 반응형 디자인으로 모바일/데스크톱 지원
- 한국어 인터페이스 및 한국 법정 공휴일 지원

**Backend**: Express.js + TypeScript
- REST API로 휴가 기간 계산 로직 제공
- 메모리 기반 스토리지 (MemStorage)
- 2024년 한국 공휴일 데이터 내장

**Development**: Vite 개발 서버와 Express API 서버 통합

## Key Components

- **Calendar Component**: 월별 캘린더 뷰에서 휴가 기간 시각화
- **LeaveForm Component**: 출산예정일 및 성별 선택 폼
- **ResultCard Component**: 계산된 휴가 기간 및 급여 정보 표시
- **Storage System**: 계산 이력 및 공휴일 데이터 관리
- **API Routes**: 휴가 계산, 공휴일 조회, 설정 관리

## Data Flow

1. 사용자가 출산예정일과 성별을 입력
2. API가 한국 법정 기준에 따라 휴가 기간 계산
3. 캘린더에 출산전후휴가(녹색)와 육아휴직(파란색) 기간 표시
4. 상세 정보 카드에 기간, 급여, 권장사항 표시

## External Dependencies

- **UI Components**: Radix UI 기반 접근성 준수
- **Date Handling**: date-fns 라이브러리로 한국어 로케일 지원
- **Form Management**: react-hook-form + zod 검증
- **State Management**: TanStack Query로 서버 상태 관리
- **Styling**: Tailwind CSS + 커스텀 캘린더 스타일

## Deployment Strategy

Replit 환경에서 개발 서버 실행 중 (포트 3001)
- 프로덕션 배포 준비 완료
- 정적 파일 빌드 및 Express 서버 최적화 필요

## Recent Changes

- 2025년 7월 7일: 전체 애플리케이션 구조 완성 및 고도화
- 한국어 인터페이스 및 육아휴직 제도 로직 구현
- 엄마/아빠 구분 및 단태아/다태아 선택 기능 추가
- 실제 출산일 입력 옵션으로 조산/만삭 대응
- 법정 최소 보장일수 자동 확보 로직 구현
- 색상 구분된 시각적 캘린더 표시
- JSON/PDF 다운로드 기능 추가
- Express 단일 파일 서버로 최적화

## User Preferences

- **언어**: 한국어 인터페이스 필수
- **표현**: '엄마/아빠' 구분 사용 (성별 표현 지양)
- **디자인**: Google Calendar 스타일의 직관적인 UI
- **색상**: 산전휴가(연한 파랑), 출산일(빨간색), 산후휴가(진한 파랑), 육아휴직(연한 녹색)
- **기능**: 한국 법정 기준에 따른 정확한 계산 (단태아 90일/다태아 120일)
- **출력**: JSON 데이터 형태 결과 제공 및 PDF 다운로드 옵션
- **커뮤니케이션**: 간단하고 일상적인 언어 사용

## Development Notes

현재 서버가 포트 3001에서 실행 중이며, 클라이언트와 API가 통합되어 작동합니다. 다음 단계는 프로덕션 빌드 및 배포 최적화입니다.