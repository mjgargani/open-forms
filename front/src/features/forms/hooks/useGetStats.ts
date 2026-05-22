import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGetStats(formId: string) {
  return useQuery({
    queryKey: ['forms', formId, 'stats'],
    queryFn: async () => {
      const { data } = await api.get(`/forms/${formId}/stats`);
      return data;
    },
    enabled: !!formId,
    staleTime: 1000 * 60 * 5,
  });
}