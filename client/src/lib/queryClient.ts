import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = Array.isArray(queryKey) ? queryKey.join('/') : queryKey;
        const response = await fetch(url as string);
        if (!response.ok) {
          throw new Error('네트워크 오류가 발생했습니다.');
        }
        return response.json();
      },
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || '요청 처리 중 오류가 발생했습니다.');
  }

  return response.json();
}