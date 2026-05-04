
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Form } from '@/types';

export function useExamData(formId: string) {
  return useQuery({
    queryKey: ['exam', formId],
    queryFn: async () => {
      const response = await api.get<Form>(`/forms/${formId}/exam`);
      return response.data;
    },
    staleTime: 1000 * 60 * 60, 
    enabled: !!formId,
  });
}