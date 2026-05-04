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
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await api.get<Form[]>('/questions');
      return response.data;
    },
  });
}