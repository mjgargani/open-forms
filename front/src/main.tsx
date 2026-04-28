import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient } from './lib/query-client'
import { idbPersister } from './lib/persister'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: idbPersister }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
)