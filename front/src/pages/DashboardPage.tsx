import { useFormList } from "@/features/forms/hooks/useFormList";
import { useCreateForm } from "@/features/forms/hooks/useCreateForm";
import { FormList } from "@/features/forms/components/FormList";
import { useNavigate } from "@tanstack/react-router";
import { PlusCircle, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export default function DashboardPage() {
  const { data: forms, isLoading, isError } = useFormList();
  const navigate = useNavigate();

  // Hook de criação do form
  const { mutate: createForm, isPending: isCreating } = useCreateForm();

  const handleOpenForm = (formId: string) => {
    navigate({ 
      to: '/forms/$formId', 
      params: { formId: formId } 
    }).catch((err) => {
      console.error("[ERRO DO ROUTER] A navegação falhou!", err);
    });
  };

  const handleCreateForm = () => {
    const newFormId = uuidv4();

    const dataAtual = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date());
    
    const tituloProvisorio = `Novo rascunho (${dataAtual})`;
    
    createForm({ 
      id: newFormId, 
      title: tituloProvisorio 
    });

    handleOpenForm(newFormId);
  };

  return (
    <main className="container mx-auto p-6 max-w-7xl animate-in fade-in">
      
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Meus Formulários</h1>
          <p className="text-muted-foreground">Avaliações disponíveis no banco de dados local.</p>
        </div>
        
        <button 
          onClick={handleCreateForm}
          disabled={isCreating} // Evita duplo clique
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm font-medium disabled:opacity-50"
        >
          {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
          {isCreating ? 'Criando...' : 'Criar formulário'}
        </button>
      </header>

      {isLoading && (
        <div className="flex justify-center py-20">
          <p className="animate-pulse font-medium text-muted-foreground">Carregando formulários...</p>
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-destructive text-center font-medium">
          Ocorreu um erro ao carregar os dados do backend. Verifique a conexão.
        </div>
      )}

      {forms && <FormList forms={forms} onFormClick={handleOpenForm} />}
    </main>
  );
}