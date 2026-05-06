import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface CreateFormDTO {
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
    // Função que fará o POST real para o NestJS
    mutationFn: async (newForm: CreateFormDTO) => {
      const { data } = await api.post<FormEntity>('/forms', newForm);
      return data;
    },
    
    // Força o comportamento offline-first, colocando a mutação em pausa (fila) 
    // caso o utilizador esteja sem internet.
    networkMode: 'offlineFirst',

    // Optimistic UI: Interceptamos a mutação ANTES da requisição de rede terminar (ou falhar)
    onMutate: async (newForm) => {
      // 1. Cancela qualquer requisição de GET ['forms'] em andamento para evitar Race Conditions
      await queryClient.cancelQueries({ queryKey: ['forms'] });

      // 2. Tira uma "fotografia" do estado atual do cache para caso precisemos de Rollback
      const previousForms = queryClient.getQueryData<FormEntity[]>(['forms']);

      // 3. Cria uma entidade "Draft" temporária para renderização imediata
      const optimisticForm: FormEntity = {
        id: `draft-${crypto.randomUUID()}`, // ID temporário que será substituído pelo UUID do Postgres
        title: newForm.title,
        description: newForm.description,
        published: false,
        createdAt: new Date().toISOString(),
      };

      // 4. Injeta o rascunho no início da lista (assumindo ordenação descendente)
      queryClient.setQueryData<FormEntity[]>(['forms'], (oldList = []) => [
        optimisticForm,
        ...oldList,
      ]);

      // Retorna o contexto contendo o estado pré-mutação
      return { previousForms };
    },

    // Tratamento de falhas: Se der erro (ex: validação DTO falhou no NestJS após a rede voltar)
    onError: (_error, _variables, context) => {
      // Reverte o cache para a "fotografia" anterior
      if (context?.previousForms) {
        queryClient.setQueryData(['forms'], context.previousForms);
      }
    },

    // Finalização: Sempre invalida o cache de listagem após o assentamento (sucesso ou erro)
    // para garantir que o React Query busque o 'id' verdadeiro gerado pelo PostgreSQL.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}