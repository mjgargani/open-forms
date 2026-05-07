import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Save } from 'lucide-react';
import { QuestionBlock } from './QuestionBlock';
import { useUpdateForm } from '@/features/forms/hooks/useUpdateForm';

export function FormBuilder({ formId, initialData }: { formId: string, initialData: any }) {
  // 1. Inicia o formulário com os dados vazios (ou puxados da API)
  const { register, control, watch, getValues } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
  });

  // 2. O Controlador do Array de Questões
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  // Instancia a mutação passando o ID do formulário atual
  const { mutate: updateForm } = useUpdateForm(formId);

  // O motor do Auto-Save Granular
  const handleBlur = (fieldName: 'title' | 'description') => {
    // Busca apenas o valor do campo que acabou de perder o foco
    const currentValue = getValues(fieldName);
    
    // Dispara o PATCH (ex: { title: "Nova Prova de Matemática" })
    updateForm({ [fieldName]: currentValue });
  };

  const handleAddQuestion = () => {
    // Ao adicionar, disparamos a API (POST /questions) e pegamos o ID gerado
    // Por enquanto, mockamos a adição na tela:
    append({
      id: crypto.randomUUID(), // Temporário até plugar a API
      title: "",
      type: "SINGLE",
      required: true,
      options: []
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Cabeçalho do Formulário */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-t-4 border-t-primary">
        <input
          {...register('title')}
          onBlur={() => handleBlur('title')}
          className="text-4xl font-black w-full outline-none placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 transition-colors pb-2"
          placeholder="Título do Formulário"
        />
        <input
          {...register('description')}
          onBlur={() => handleBlur('description')}
          className="text-gray-500 w-full mt-4 outline-none placeholder:text-gray-300"
          placeholder="Descrição do formulário"
        />
      </div>

      {/* Lista de Questões Dinâmicas */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <QuestionBlock 
            key={field.id} // IMPORTANTÍSSIMO: Usar o ID do field do react-hook-form
            index={index} 
            control={control} 
            register={register} 
            onDelete={() => remove(index)}
          />
        ))}
      </div>

      {/* Fab Button (Botão flutuante para adicionar questão) */}
      <button 
        onClick={handleAddQuestion}
        className="flex items-center gap-2 mx-auto mt-8 bg-white border border-gray-300 shadow-sm px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-gray-700"
      >
        <Plus className="w-5 h-5 text-primary" />
        Adicionar Questão
      </button>

    </div>
  );
}