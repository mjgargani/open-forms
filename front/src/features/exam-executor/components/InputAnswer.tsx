import type { UseFormRegister } from 'react-hook-form';
import type { Option } from '@/types';
import type { ExamFormValues } from './ExamExecutor';

interface InputAnswerProps {
  option: Option;
  questionId: string;
  register: UseFormRegister<ExamFormValues>;
}

export function InputAnswer({ option, questionId, register }: InputAnswerProps) {
  return (
    <div className="mt-4 w-full">
      {option.description && (
        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
      )}
      
      <textarea
        {...register(`answers.${questionId}`)}
        className="w-full min-h-[150px] p-4 border border-input rounded-md bg-background text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
        placeholder="Escreva a sua resposta aqui..."
      />
    </div>
  );
}