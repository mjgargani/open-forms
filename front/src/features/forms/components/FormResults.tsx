import React from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'; 

interface FormResultsProps {
  formId: string;
}

export function FormResults({ formId }: FormResultsProps) {
  const mockStats = {
    isPublished: true,
    name: "Avaliação Diagnóstica - História do Brasil",
    submissionCount: 1,
    lastSync: new Date().toLocaleString('pt-PT'),
    recentSubmissions: [
      { id: '1', user: '2026101 - Maria Oliveira', date: '04/05/2026, 13:54' }
    ]
  };

  const handleDownloadCSV = () => {
    window.open(`http://localhost:3000/forms/${formId}/export`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Aviso de Publicação */}
      <div className={`p-4 rounded-md flex items-center gap-3 border ${
        mockStats.isPublished 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        {mockStats.isPublished ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="text-sm font-medium">
          O formulário <code className="bg-white/50 px-2 py-0.5 rounded">{formId}</code>{' '}
          {mockStats.isPublished ? 'está publicado e a recebendo respostas.' : 'não está publicado. Usuários não conseguem acessa-lo.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Estatísticas */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Estatísticas do Formulário</h3>
          <p className="text-sm text-gray-500 mb-6 font-medium">{mockStats.name}</p>
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
              <span className="text-gray-600">Total de Envios</span>
              <span className="text-2xl font-black text-primary">{mockStats.submissionCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Atualizado a: {mockStats.lastSync}</span>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <RefreshCw className="w-3 h-3" /> Atualizar
              </button>
            </div>
          </div>

          <button 
            onClick={handleDownloadCSV}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-md font-semibold transition-colors focus:ring-4 focus:ring-slate-200"
          >
            <Download className="w-5 h-5" />
            Gerar Relatório (CSV)
          </button>
        </div>

        {/* Card 2: Envios Recentes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Envios (Últimos 10)</h3>
          
          {mockStats.recentSubmissions.length > 0 ? (
            <ul className="space-y-3 mt-4">
              {mockStats.recentSubmissions.map((sub) => (
                <li key={sub.id} className="flex flex-col sm:flex-row sm:justify-between p-3 hover:bg-slate-50 border rounded-md transition-colors">
                  <span className="font-medium text-gray-700 text-sm truncate">{sub.user}</span>
                  <span className="text-xs text-gray-500 mt-1 sm:mt-0">{sub.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm italic">
              Nenhuma submissão registada ainda.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}