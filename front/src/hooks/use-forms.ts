import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Form {
  id: string;
  title: string;
  description?: string;
  active: boolean;
}

export function useForms() {
  return useQuery<Form[]>({
    queryKey: ['forms'],
    queryFn: async () => {
      const { data } = await api.get('/forms');
      return data;
    },
  });
}
