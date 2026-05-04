import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Form } from "@/types";

interface FormListProps {
  forms: Form[];
  onFormClick: (formId: string) => void;
}

export function FormList({ forms, onFormClick }: FormListProps) {
  if (forms.length === 0) {
    return <p className="text-muted-foreground text-center py-10">Nenhum formulário encontrado.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Card 
          key={form.id} 
          className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer"
          onClick={() => onFormClick(form.id)}
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold">{form.title}</CardTitle>
            <CardDescription className="line-clamp-2 italic">
              {form.description || "Sem descrição disponível."}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}