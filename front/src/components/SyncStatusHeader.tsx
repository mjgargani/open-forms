import { useSyncStatus } from '@/features/forms/hooks/useSyncStatus'; // Vamos criar este hook

export function SyncStatusHeader() {
  const { isOnline, lastSync } = useSyncStatus();

  return (
    <div className={`w-full py-1 text-center text-xs font-medium text-white transition-colors flex justify-center items-center gap-4 ${isOnline ? 'bg-green-600' : 'bg-red-500'}`}>
      <span>
        {isOnline
          ? `Online - Conectado ao servidor ${import.meta.env.VITE_API_URL}`
          : 'Offline - Modo Local Ativado'}
      </span>
      {lastSync && (
         <span className="opacity-80">| Última sincronização: {lastSync.toLocaleTimeString()}</span>
      )}
    </div>
  );
}
