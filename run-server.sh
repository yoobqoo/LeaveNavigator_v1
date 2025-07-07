#!/bin/bash
echo "육아휴직 계산기 서버 시작..."
cd "$(dirname "$0")"
export PORT=3001
export NODE_ENV=development
npx tsx server/index.ts