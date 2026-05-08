import type { UseFormRegister } from 'react-hook-form';
import type { Question } from '@/types'; 
import type { ExamFormValues } from './ExamExecutor';
import { InputAnswer } from './InputAnswer';
import { OptionGroup } from './OptionGroup';
import ReactMarkdown from 'react-markdown';

export function QuestionRenderer({ question, register }: { question: Question, register: UseFormRegister<ExamFormValues> }) {
  const isDiscursive = question.type === 'DISCURSIVE';

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
      <div className="prose prose-sm mb-4">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          <ReactMarkdown>{question.title}</ReactMarkdown>
        </h3>
      </div>

      {isDiscursive ? (
        // Se for discursiva, pegamos a primeira opção do tipo INPUT (conforme seed)
        <InputAnswer 
          questionId={question.id} 
          register={register} 
        />
      ) : (
        <OptionGroup 
          options={question.options || []} 
          questionId={question.id}
          questionType={question.type}
          register={register} 
        />
      )}
    </div>
  );
}