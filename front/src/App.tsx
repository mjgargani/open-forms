import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import DashboardPage from './pages/DashboardPage'

interface Form {
  id: string;
  title: string;
  description: string;
}

function App() {
  return (<>
    <DashboardPage />
  </>)
}

export default App;