import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface CreateFormDTO {
  id?: string;
  title: string;
  description?: string;
}

export interface FormEntity extends CreateFormDTO {
  id: string;
  createdAt: string;
  published: boolean;
}

export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newForm: CreateFormDTO) => {
      const { data } = await api.post<FormEntity>('/forms', newForm);
      return data;
    },
    
    // Força o comportamento offline-first, colocando a mutação em pausa (fila) 
    // caso o utilizador esteja sem internet.
    networkMode: 'offlineFirst',

    onMutate: async (newForm) => {
      await queryClient.cancelQueries({ queryKey: ['forms'] });

      const previousForms = queryClient.getQueryData<FormEntity[]>(['forms']);

      const optimisticForm: FormEntity = {
        id: newForm.id || crypto.randomUUID(),
        title: newForm.title,
        description: newForm.description,
        published: false,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<FormEntity[]>(['forms'], (oldList = []) => [
        optimisticForm,
        ...oldList,
      ]);

      return { previousForms };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousForms) {
        queryClient.setQueryData(['forms'], context.previousForms);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}