// lib/hooks/useProfiles.ts
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

export function useProfiles(filters?: any) {
  const { isAuthenticated } = useAuth();
  
  // Build query string
  const params = new URLSearchParams();
  if (filters?.gender) params.append('gender', filters.gender);
  if (filters?.city) params.append('city', filters.city);
  if (filters?.minAge) params.append('minAge', filters.minAge);
  if (filters?.maxAge) params.append('maxAge', filters.maxAge);
  if (filters?.caste) params.append('caste', filters.caste);
  if (filters?.search) params.append('search', filters.search);
  
  const url = `/api/profiles?${params.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated ? url : null,
    fetcher,
    {
      revalidateOnFocus: true,        // ✅ Tab focus pe auto refresh
      revalidateOnReconnect: true,   // ✅ Network reconnect pe refresh
      refreshInterval: 30000,         // ✅ 30 seconds pe auto refresh
      dedupingInterval: 5000,         // ✅ 5 seconds ke andar duplicate requests block
    }
  );
  
  return {
    profiles: data?.profiles || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate, // Manual refresh ke liye
  };
}