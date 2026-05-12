import { useForm, useFieldArray } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionBlock } from './QuestionBlock';
import { useUpdateForm } from '@/features/forms/hooks/useUpdateForm';

export function FormBuilder({ formId, initialData }: { formId: string, initialData: any }) {
  const { register, control, getValues } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      questions: initialData?.questions || [], // Semeia o array com os dados cacheados
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const { mutate: updateForm } = useUpdateForm(formId);

  // Auto-Save para campos raiz
  const handleBlur = (fieldName: 'title' | 'description') => {
    const currentValue = getValues(fieldName);
    updateForm({ [fieldName]: currentValue });
  };

  const handleSaveQuestions = () => {
    const currentQuestions = getValues('questions');
    updateForm({ questions: currentQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      title: '',
      type: 'MULTIPLE',
      formId: formId,
      options: [
        { 
          id: uuidv4(), 
          description: '', 
          type: 'MARKDOWN', 
          correct: false 
        }
      ]
    };
    
    append(newQuestion);
    setTimeout(handleSaveQuestions, 0);
  };

  const handleRemoveQuestion = (index: number) => {
    remove(index);
    setTimeout(handleSaveQuestions, 0);
  };

  return (
    <form className="space-y-8 max-w-3xl mx-auto pb-20" onSubmit={(e) => e.preventDefault()}>
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
            key={field.id}
            index={index} 
            control={control} 
            register={register} 
            onDelete={() => handleRemoveQuestion(index)}
            onSave={handleSaveQuestions}
          />
        ))}
      </div>

      {/* Fab Button */}
      <button 
        type="button" // Previne o submit padrão do HTML
        onClick={handleAddQuestion}
        className="flex items-center gap-2 mx-auto mt-8 bg-white border border-gray-300 shadow-sm px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-gray-700"
      >
        <Plus className="w-5 h-5" /> Adicionar Questão
      </button>
    </form>
  );
}