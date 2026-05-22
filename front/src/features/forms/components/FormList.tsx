import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Form } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface FormListProps {
  forms: Form[];
  onFormClick: (formId: string) => void;
}

export function FormList({ forms, onFormClick }: FormListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/forms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });

  if (forms.length === 0) {
    return <p className="text-muted-foreground text-center py-10">Nenhum formulário encontrado.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Card 
          key={form.id} 
          className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer group relative"
          onClick={() => onFormClick(form.id)}
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold flex justify-between items-start">
              <span className="truncate pr-8">{form.title}</span>
            </CardTitle>
            <CardDescription className="line-clamp-2 italic">
              {form.description || "Sem descrição disponível."}
            </CardDescription>
            {form.user?.name && (
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Criado por: {form.user.name}
              </p>
            )}
          </CardHeader>

          <div
            className="absolute top-4 right-4"
            onClick={(e) => e.stopPropagation()} // Evita disparar o onClick do Card
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir formulário?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o formulário e todas as suas respostas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(form.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      ))}
    </div>
  );
}