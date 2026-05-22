import { useParams, useNavigate } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExamExecutor } from "@/features/exam-executor/components/ExamExecutor"
import { FormResults } from "@/features/forms/components/FormResults"
import { FormBuilder } from "@/features/form-builder/components/FormBuilder"
import { useGetForm } from '@/features/forms/hooks/useGetForm';
import { ChevronLeft, ExternalLink } from 'lucide-react';

export default function FormMaestroPage() {
  const { formId } = useParams({ from: '/forms/$formId' });
  const navigate = useNavigate();
  const { data: formData, isLoading } = useGetForm(formId);
  
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando formulário...</div>;
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Cabeçalho com Botão Voltar e Breadcrumb */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <button 
          onClick={() => navigate({ to: '/' })}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
          title="Voltar para o Dashboard"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Dashboard <span className="mx-1 text-gray-300">/</span> Gerenciamento do formulário
          </p>
          <h1 className="text-xl font-bold text-gray-800 font-mono mt-1">
            {formId}
          </h1>
        </div>
      </div>

      {/* Tabs Maestro */}
      <Tabs defaultValue="edicao" className="w-full">
        {/* As abas só existem para o Professor/Criador */}
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="edicao">Edição</TabsTrigger>
          <TabsTrigger value="respostas">Respostas</TabsTrigger>
          <TabsTrigger value="visualizacao">Visualização</TabsTrigger>
        </TabsList>

        <TabsContent value="edicao">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
            <FormBuilder formId={formId} initialData={formData} />
          </div>
        </TabsContent>

        <TabsContent value="respostas">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
             <FormResults formId={formId} />
          </div>
        </TabsContent>

        <TabsContent value="visualizacao">
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 max-w-lg w-full text-center shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Visualização Pública</h3>
              <p className="text-sm text-blue-700 mb-6">
                Este é o link que você deve compartilhar com seus alunos. Clique abaixo para testar a experiência real de preenchimento.
              </p>
              <button
                type="button"
                onClick={() => window.open(`/view/${formId}`, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                Abrir Visualização do Aluno
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Mantemos o Executor abaixo apenas como uma prévia rápida "In-Page" */}
            <div className="w-full border-t pt-8 opacity-50 pointer-events-none grayscale">
               <p className="text-center text-xs text-gray-400 mb-4 uppercase tracking-widest">Pré-visualização Rápida (Somente leitura)</p>
               <ExamExecutor formId={formId} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}