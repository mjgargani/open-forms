import React from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'; 
import { useGetForm } from '../hooks/useGetForm';

interface FormResultsProps {
  formId: string;
}

export function FormResults({ formId }: FormResultsProps) {
  const { data: form, isLoading, isError, refetch } = useGetForm(formId);

  if (isLoading) return <div className="p-8 text-gray-500 animate-pulse">Calculando estatísticas...</div>;
  if (isError || !form) return <div className="p-8 text-red-500">Erro ao carregar resultados.</div>;

  const stats = {
    isPublished: form.published,
    name: form.title,
    submissionCount: form._count?.submissions || 0,
    lastSync: new Date(form.updatedAt).toLocaleString('pt-BR'),
    recentSubmissions: form.submissions || []
  };

  const handleDownloadCSV = () => {
    window.open(`${import.meta.env.VITE_API_URL}/forms/${formId}/export`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Aviso de Publicação */}
      <div className={`p-4 rounded-md flex items-center gap-3 border ${
        stats.isPublished 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        {stats.isPublished ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="text-sm font-medium">
          O formulário <code>{stats.name}</code> {stats.isPublished ? 'está publicado e aceitando respostas.' : 'está em rascunho.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Resumo */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total de Submissões</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{stats.submissionCount}</span>
              <span className="text-slate-400 text-sm font-medium">respostas</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Sincronizado em: {stats.lastSync}
            </p>
          </div>

          <button 
            onClick={handleDownloadCSV}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-md font-semibold transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Exportar CSV Completo
          </button>
        </div>

        {/* Card 2: Envios Recentes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Envios Recentes</h3>
          
          {stats.recentSubmissions.length > 0 ? (
            <ul className="space-y-3 mt-4">
              {stats.recentSubmissions.map((sub: any) => (
                <li key={sub.id} className="flex flex-col sm:flex-row sm:justify-between p-3 hover:bg-slate-50 border rounded-md transition-colors bg-slate-50/30">
                  <span className="font-medium text-gray-700 text-sm truncate">{sub.user}</span>
                  <span className="text-[10px] text-gray-400 mt-1 sm:mt-0">
                    {new Date(sub.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400 italic">Nenhuma resposta recebida ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}