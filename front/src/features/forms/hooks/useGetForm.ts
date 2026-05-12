import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGetForm(formId: string) {
  return useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      const { data } = await api.get(`/forms/${formId}`);
      return data;
    },
    enabled: !!formId, 
    staleTime: 1000 * 60 * 5, 
  });
}