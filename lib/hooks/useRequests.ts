// lib/hooks/useRequests.ts
import useSWR from 'swr';
import { useAuth } from '@/lib/auth-context';

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  
  return res.json();
};

export function useRequests(userId: string, type: 'sent' | 'received') {
  const { isAuthenticated } = useAuth();
  
  const url = `/api/requests?userId=${userId}&type=${type}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated && userId ? url : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 15000, // 15 seconds
    }
  );
  
  return {
    requests: data?.requests || [],
    isLoading,
    isError: error,
    mutate,
  };
}