import { createFileRoute } from '@tanstack/react-router';
import FormMaestroPage from '@/pages/FormMaestroPage';

export const Route = createFileRoute('/forms/$formId')({
  component: FormMaestroPage,
})
