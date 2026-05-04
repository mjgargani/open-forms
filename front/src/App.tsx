import { useQuery } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { api } from './lib/api';
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;