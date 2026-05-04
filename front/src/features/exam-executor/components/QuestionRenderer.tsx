import type { UseFormRegister } from 'react-hook-form';
import type { Question } from '@/types'; 
import type { ExamFormValues } from './ExamExecutor';
import { InputAnswer } from './InputAnswer';
import { OptionGroup } from './OptionGroup';
import ReactMarkdown from 'react-markdown';

interface QuestionRendererProps {
  question: Question;
  register: UseFormRegister<ExamFormValues>; 
}

export function QuestionRenderer({ question, register }: QuestionRendererProps) {
  const inputOptions = question.options.filter(opt => opt.type === 'INPUT');
  const markdownOptions = question.options.filter(opt => opt.type === 'MARKDOWN');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Título da Questão */}
      <div className="prose prose-slate max-w-none mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 whitespace-pre-wrap">
          <ReactMarkdown>{question.title}</ReactMarkdown>
        </h3>
      </div>

      {/* Múltipla Escolha / Checkboxes */}
      {markdownOptions.length > 0 && (
        <OptionGroup 
          options={markdownOptions} 
          questionId={question.id}
          questionType={question.type}
          register={register} 
        />
      )}

      {/* Dissertativa / Textarea */}
      {inputOptions.map(opt => (
        <InputAnswer 
          key={opt.id} 
          option={opt} 
          questionId={question.id} // Passamos o questionId para o Input também!
          register={register} 
        />
      ))}
    </div>
  );
}