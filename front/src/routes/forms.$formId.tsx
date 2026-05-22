import { createFileRoute, redirect } from '@tanstack/react-router';
import FormMaestroPage from '@/pages/FormMaestroPage';

export const Route = createFileRoute('/forms/$formId')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: FormMaestroPage,
})
