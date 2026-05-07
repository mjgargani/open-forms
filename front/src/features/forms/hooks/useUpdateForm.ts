import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface UpdateFormDTO {
  title?: string;
  description?: string;
  published?: boolean;
  questions?: any[]; 
}

export function useUpdateForm(formId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFormDTO) => {
      const response = await api.patch(`/forms/${formId}`, data);
      return response.data;
    },
    
    networkMode: 'offlineFirst', // Garante enfileiramento sem internet

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['forms', formId] });

      const previousForm = queryClient.getQueryData(['forms', formId]);

      queryClient.setQueryData(['forms', formId], (old: any) => ({
        ...old,
        ...updatedData,
      }));

      return { previousForm };
    },

    onError: (_err, _newForm, context) => {
      if (context?.previousForm) {
        queryClient.setQueryData(['forms', formId], context.previousForm);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', formId] });
      queryClient.invalidateQueries({ queryKey: ['forms'] }); 
    },
  });
}