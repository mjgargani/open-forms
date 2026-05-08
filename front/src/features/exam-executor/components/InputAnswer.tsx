import type { UseFormRegister } from 'react-hook-form';
import type { ExamFormValues } from './ExamExecutor';

export function InputAnswer({ questionId, register }: { questionId: string, register: UseFormRegister<ExamFormValues> }) {
  return (
    <div className="mt-4">
      <textarea
        {...register(`answers.${questionId}`, { required: true })}
        rows={4}
        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-lg outline-none transition-all resize-none"
        placeholder="Escreva sua resposta detalhadamente aqui..."
      />
    </div>
  );
}