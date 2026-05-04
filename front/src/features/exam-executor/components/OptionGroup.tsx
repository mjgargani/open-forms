import type { UseFormRegister } from 'react-hook-form';
import type { Option, QuestionType } from '@/types';
import type { ExamFormValues } from './ExamExecutor';
import ReactMarkdown from 'react-markdown';

interface OptionGroupProps {
  options: Option[];
  questionId: string;
  questionType: QuestionType;
  register: UseFormRegister<ExamFormValues>;
}

export function OptionGroup({ options, questionId, questionType, register }: OptionGroupProps) {
  const isSingleChoice = questionType === 'SINGLE';
  const inputType = isSingleChoice ? 'radio' : 'checkbox';

  return (
    <div className="mt-4 space-y-3">
      {options.map((option) => (
        <label 
          key={option.id} 
          className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
        >
          <input
            type={inputType}
            value={option.id}
            {...register(`answers.${questionId}`)}
            className={`mt-1 h-5 w-5 text-primary border-input bg-background focus:ring-primary ${
              isSingleChoice ? 'rounded-full' : 'rounded'
            }`}
          />
          <div className="text-foreground prose prose-sm max-w-none leading-tight">
            <ReactMarkdown>{option.description}</ReactMarkdown>
          </div>
        </label>
      ))}
    </div>
  );
}