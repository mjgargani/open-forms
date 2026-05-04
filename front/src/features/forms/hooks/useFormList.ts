import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Form {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

export function useForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await api.get<Form[]>('/forms');
      return response.data;
    },
  });
}