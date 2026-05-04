import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { QuestionRenderer } from './QuestionRenderer'; // Ajuste o import conforme sua estrutura

// Tipagem baseada no seu DTO de submissão
interface ExamFormValues {
  user: string;
  answers: Record<string, string | string[]>; 
  // O Record acima mapeia: { "id_da_questao": "texto digitado" ou "id_da_opcao_marcada" }
}

interface ExamExecutorProps {
  formId: string;
}

export function ExamExecutor({ formId }: ExamExecutorProps) {
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  // Inicializando o react-hook-form
  const { register, handleSubmit, watch } = useForm<ExamFormValues>({
    defaultValues: {
      user: 'Aluno Teste', // No futuro virá do contexto de autenticação
      answers: {}
    }
  });

  // Função disparada no clique do "Entregar"
  const onSubmit = (data: ExamFormValues) => {
    if (isOfflineMode) {
      alert('Submissão salva localmente no IndexedDB. Sincronizando quando houver conexão.');
      console.log('Salvo no disco:', data);
    } else {
      alert('Prova enviada com sucesso para o servidor!');
      console.log('Enviado para a API:', data);
    }
  };

  // Isso nos permite ver o estado do formulário em tempo real sem re-renderizar a tela toda hora
  const liveData = watch();

  // MOCK: Simulando os dados que viriam do backend
  const mockForm = {
    title: "Avaliação Diagnóstica - 2026",
    questions: [
      {
        id: "q1",
        title: "Descreva o princípio da Inversão de Dependência (SOLID).",
        options: [{ id: "opt1", type: "INPUT", description: "" }]
      },
      {
        id: "q2",
        title: "Qual protocolo é focado em processamento assíncrono?",
        options: [
          { id: "opt2", type: "MARKDOWN", description: "HTTP Padrão" },
          { id: "opt3", type: "MARKDOWN", description: "AMQP (RabbitMQ)" }
        ]
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Prova */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{mockForm.title}</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600">Simular Offline:</label>
          <input 
            type="checkbox" 
            checked={isOfflineMode} 
            onChange={(e) => setIsOfflineMode(e.target.checked)} 
            className="w-4 h-4"
          />
        </div>
      </div>

      {/* Formulário gerenciado pelo react-hook-form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Renderização Dinâmica das Questões */}
        {mockForm.questions.map((question) => (
          <QuestionRenderer 
            key={question.id} 
            question={question as any} 
            // O DESAFIO ESTÁ AQUI: Como você passa o 'register' lá para dentro?
            register={register} 
          />
        ))}

        <button 
          type="submit" 
          className={`w-full py-3 px-4 text-white font-bold rounded-md shadow transition-colors ${
            isOfflineMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isOfflineMode ? 'Salvar Prova Offline' : 'Entregar Prova'}
        </button>
      </form>

      {/* Visão de Raio-X (Apenas para nós desenvolvedores) */}
      <div className="mt-8 p-4 bg-gray-900 text-green-400 rounded-lg overflow-hidden text-sm font-mono">
        <h3 className="text-gray-400 mb-2">// Estado do Form (react-hook-form JSON)</h3>
        <pre>{JSON.stringify(liveData, null, 2)}</pre>
      </div>
    </div>
  );
}