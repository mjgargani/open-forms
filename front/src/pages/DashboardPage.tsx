import { useForms } from "@/features/forms/hooks/useForms";
import { FormList } from "@/features/forms/components/FormList";

export default function DashboardPage() {
  const { data: forms, isLoading, isError } = useForms();

  return (
    <main className="container mx-auto p-6 max-w-7xl">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Meus Formulários</h1>
        <p className="text-muted-foreground">Avaliações disponíveis no banco de dados local.</p>
      </header>

      {isLoading && (
        <div className="flex justify-center py-20">
          <p className="animate-pulse font-medium">Carregando formulários...</p>
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-destructive text-center">
          Ocorreu um erro ao carregar os dados do backend. Verifique a conexão com o Docker.
        </div>
      )}

      {forms && <FormList forms={forms} />}
    </main>
  );
}