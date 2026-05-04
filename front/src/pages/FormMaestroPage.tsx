import { useParams } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExamExecutor } from "@/features/exam/components/ExamExecutor"

export default function FormMaestroPage() {
  const { formId } = useParams({ from: '/forms/$formId' })
  
  // No futuro, isso virá do Contexto de Autenticação (ex: useAuth().role === 'ADMIN')
  const isCreator = true 

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Se for apenas um aluno (não-criador), não mostramos as abas, apenas renderizamos a prova direta! */}
      {!isCreator ? (
        <ExamExecutor formId={formId} />
      ) : (
        <Tabs defaultValue="visualizacao" className="w-full">
          {/* As abas só existem para o Professor/Criador */}
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="edicao">Edição</TabsTrigger>
            <TabsTrigger value="respostas">Respostas</TabsTrigger>
            <TabsTrigger value="visualizacao">Visualização</TabsTrigger>
          </TabsList>

          <TabsContent value="edicao">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">Builder de Formulário</h3>
              <p className="text-gray-500">A interface de arrastar e soltar (TBD) entrará aqui.</p>
            </div>
          </TabsContent>

          <TabsContent value="respostas">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
               <h3 className="text-lg font-semibold text-gray-700">Relatório e BI</h3>
               <p className="text-gray-500">A tabela de resultados consumindo o CSV do servidor (TBD) entrará aqui.</p>
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
      )}
    </main>
  )
}