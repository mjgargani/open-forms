import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useExamData } from '../hooks/useExamData';
import { QuestionRenderer } from './QuestionRenderer';

interface ExamExecutorProps {
  formId: string;
}

export function ExamExecutor({ formId }: ExamExecutorProps) {
  const { data: form, isLoading, isError } = useExamData(formId);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      user: 'seu@email.com', // Campo público, não requer autenticação, a princípio
      answers: {}
    }
  });

  if (isLoading) {
    return <div className="text-center py-20 animate-pulse text-gray-500 font-medium">Buscando formulário...</div>;
  }

  if (isError || !form) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">Falha ao carregar a prova. Verifique sua conexão.</div>;
  }

  const onSubmit = (data: any) => {
    console.log("🚀 Payload pronto para envio:", data);
    
    if (isOfflineMode) {
      alert("Modo Offline Ativo: Submissão salva no IndexedDB! Será sincronizada quando houver rede.");
    } else {
      alert("Submissão enviada para a API com sucesso!");
      // Futuro: api.post('/submissions', data)
    }
  };

  const liveData = watch();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho da Prova */}
      <header className="border-b pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{form.title}</h1>
            {form.description && <p className="text-gray-500 mt-2 text-lg">{form.description}</p>}
          </div>
          
          {/* Toggle de Simulação Offline (Apenas para dev) */}
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md border text-sm">
            <label htmlFor="offline-toggle" className="font-medium text-gray-600">Simular Offline</label>
            <input 
              id="offline-toggle"
              type="checkbox" 
              checked={isOfflineMode} 
              onChange={(e) => setIsOfflineMode(e.target.checked)}
              className="accent-primary"
            />
          </div>
        </div>
      </header>

      {/* Corpo da Prova */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {form.questions.map((question) => (
          <QuestionRenderer 
            key={question.id} 
            question={question} 
            register={register} 
          />
        ))}

        {/* Botão de Entrega Contextual */}
        <div className="pt-6">
          <button 
            type="submit" 
            className={`w-full md:w-auto px-8 py-4 text-white font-bold rounded-md shadow-sm transition-all focus:ring-4 focus:outline-none ${
              isOfflineMode 
                ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-200' 
                : 'bg-primary hover:bg-primary/90 focus:ring-primary/30'
            }`}
          >
            {isOfflineMode ? '💾 Salvar Prova (Offline)' : '📤 Entregar Prova'}
          </button>
        </div>
      </form>

      {/* Painel de Raio-X de Debug (Remover em produção) */}
      <div className="mt-12 p-4 bg-slate-900 text-green-400 rounded-lg font-mono text-sm overflow-x-auto shadow-inner">
        <p className="mb-2 text-slate-500 select-none">// Estado Dinâmico gerado pelo react-hook-form</p>
        <pre>{JSON.stringify(liveData, null, 2)}</pre>
      </div>

    </div>
  );
}