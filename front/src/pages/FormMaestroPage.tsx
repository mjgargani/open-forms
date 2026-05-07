import { useParams, useNavigate } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExamExecutor } from "@/features/exam-executor/components/ExamExecutor"
import { FormResults } from "@/features/forms/components/FormResults"
import { FormBuilder } from "@/features/form-builder/components/FormBuilder"
import { useGetForm } from '@/features/forms/hooks/useGetForm';
import { ChevronLeft } from 'lucide-react';

export default function FormMaestroPage() {
  const { formId } = useParams({ from: '/forms/$formId' });
  const navigate = useNavigate();
  const { data: formData, isLoading } = useGetForm(formId);
  
  // No futuro, isso virá do Contexto de Autenticação (ex: useAuth().role === 'ADMIN')
  const isCreator = true 

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando formulário...</div>;
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Se for apenas um aluno (não-criador), não mostramos as abas, apenas renderizamos a prova direta! */}
      {!isCreator ? (
        <ExamExecutor formId={formId} />
      ) : (
        <>
          {/* Ponto 2: Cabeçalho com Botão Voltar e Breadcrumb */}
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
              {/* O Professor usa esta aba para testar como o Aluno verá a prova */}
              <div className="bg-blue-50/50 p-4 rounded-md mb-6 border border-blue-100">
                <p className="text-sm text-blue-800 text-center font-medium">
                  Modo Preview: É assim que os utilizadores públicos verão este formulário.
                </p>
              </div>
              <ExamExecutor formId={formId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}