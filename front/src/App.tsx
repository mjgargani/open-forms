import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';

interface Form {
  id: string;
  title: string;
  description: string;
}

function App() {
  const { data: forms, isLoading, isError, error } = useQuery({
    queryKey: ['forms-list'],
    queryFn: async () => {
      const response = await api.get<Form[]>('/forms');
      return response.data;
    },
  });

  if (isError && !forms) {
    return <div className="p-8 text-red-500">Erro crítico de rede: {error.message}</div>;
  }

  if (isLoading && !forms) {
    return <div className="p-8">A carregar provas da Univesp...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Provas Disponíveis
        {isError && forms && (
          <span className="ml-4 text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
            Modo Offline Ativado
          </span>
        )}
      </h1>
      
      <div className="grid gap-4">
        {forms?.map((form) => (
          <div key={form.id} className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{form.title}</h2>
            <p className="text-gray-600 mt-2">{form.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;