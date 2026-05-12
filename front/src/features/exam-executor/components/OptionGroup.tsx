import type { UseFormRegister } from 'react-hook-form';
import type { Option, QuestionType } from '@/types';
import type { ExamFormValues } from './ExamExecutor';
import ReactMarkdown from 'react-markdown';

export function OptionGroup({ options, questionId, questionType, register }: { options: Option[], questionId: string, questionType: QuestionType, register: UseFormRegister<ExamFormValues> }) {
  const isSingle = questionType === 'SINGLE';
  const type = isSingle ? 'radio' : 'checkbox';

  return (
    <div className="grid gap-3 mt-4">
      {options.map((option) => (
        <label 
          key={option.id} 
          className="flex items-start gap-3 p-4 rounded-lg border-2 border-transparent bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5"
        >
          <input
            type={type}
            value={option.id}
            {...register(`answers.${questionId}`, { required: true })}
            className={`mt-1 h-5 w-5 text-primary focus:ring-primary ${isSingle ? 'rounded-full' : 'rounded'}`}
          />
          <div className="prose prose-sm flex-1">
            <ReactMarkdown>{option.description}</ReactMarkdown>
          </div>
        </label>
      ))}
    </div>
  );
}