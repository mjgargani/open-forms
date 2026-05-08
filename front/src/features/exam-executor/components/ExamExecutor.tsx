import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useExamData } from '../hooks/useExamData';
import { QuestionRenderer } from './QuestionRenderer';
import { useSubmitExam } from '../hooks/useSubmitExam'; // Criaremos este hook
import { Loader2, Send, CheckCircle } from 'lucide-react';

export interface ExamFormValues {
  user: string;
  answers: Record<string, string | string[]>;
}

export function ExamExecutor({ formId }: { formId: string }) {
  const { data: form, isLoading, isError } = useExamData(formId);
  const { mutate: submitExam, isPending, isSuccess } = useSubmitExam(formId);

  const { register, handleSubmit } = useForm<ExamFormValues>({
    defaultValues: {
      user: '',
      answers: {}
    }
  });

  if (isLoading) return <div className="text-center py-20 animate-pulse">Carregando avaliação...</div>;
  if (isError || !form) return <div className="p-4 bg-red-50 text-red-600">Erro ao carregar a prova.</div>;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Respostas enviadas!</h2>
        <p className="text-gray-500 mt-2">Sua participação foi registrada com sucesso.</p>
      </div>
    );
  }

  const onSubmit = (data: ExamFormValues) => {
    // Transformamos o Record { questionId: value } para o Array [ { questionId, ... } ]
    const formattedAnswers = Object.entries(data.answers).flatMap(([qId, value]) => {
      const question = form.questions?.find(q => q.id === qId);
      
      // Se for Discursiva (INPUT)
      if (question?.type === 'DISCURSIVE') {
        return [{ questionId: qId, textValue: value as string }];
      }
      
      // Se for Múltipla Escolha (MULTIPLE) - value é um array
      if (Array.isArray(value)) {
        return value.map(v => ({ questionId: qId, optionId: v }));
      }
      
      // Se for Escolha Única (SINGLE) - value é uma string (ID da opção)
      return [{ questionId: qId, optionId: value as string }];
    });

    submitExam({ user: data.user, answers: formattedAnswers });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-black text-gray-900">{form.title}</h1>
        {form.description && <p className="mt-2 text-gray-600">{form.description}</p>}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome / Identificação</label>
          <input 
            {...register('user', { required: true })}
            placeholder="Ex: João Silva (9º Ano)"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {form.questions?.map((question) => (
          <QuestionRenderer key={question.id} question={question} register={register} />
        ))}

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
          Finalizar e Entregar Prova
        </button>
      </form>
    </div>
  );
}