import express from 'express';
import { createServer } from 'vite';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  // API 미들웨어
  app.use(express.json());
  
  // API 라우트
  app.use(routes);

  // Vite 개발 서버 설정
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: './client'
    });
    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 육아휴직 계산기 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📱 클라이언트: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);