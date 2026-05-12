import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// As tipagens que estruturámos no ExamExecutor
export interface AnswerPayload {
  questionId: string;
  optionId?: string;
  textValue?: string;
}

export interface SubmitExamPayload {
  user: string;
  answers: AnswerPayload[];
}

export function useSubmitExam(formId: string) {
  return useMutation({
    mutationFn: async (payload: SubmitExamPayload) => {
      // Unimos o ID do formulário ao payload para o backend relacionar
      const { data } = await api.post('/submissions', {
        formId,
        user: payload.user,
        answers: payload.answers,
      });
      return data;
    },
    
    // O CORAÇÃO DO OFFLINE PARA OS ALUNOS
    // Se não houver internet, a mutação entra em 'paused' e fica no IndexedDB
    networkMode: 'offlineFirst',

    // Podemos usar o onMutate para exibir alertas de modo offline, se necessário
    onMutate: () => {
      if (!navigator.onLine) {
        console.log('📡 Sem internet. A prova foi salva localmente e será enviada em breve.');
      }
    },
    
    onError: (error) => {
      console.error('❌ Erro ao enviar submissão:', error);
    }
  });
}