import { QueryClientProvider } from '@tanstack/react-query';
import { Router, Route } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import { HomePage } from '@/pages/HomePage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={HomePage} />
        <Route>
          {() => (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  페이지를 찾을 수 없습니다
                </h1>
                <p className="text-gray-600 mb-6">
                  요청하신 페이지가 존재하지 않습니다.
                </p>
                <a
                  href="/"
                  className="btn-primary inline-block"
                >
                  홈으로 돌아가기
                </a>
              </div>
            </div>
          )}
        </Route>
      </Router>
    </QueryClientProvider>
  );
}

export default App;