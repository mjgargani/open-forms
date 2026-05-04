// src/features/exam/components/QuestionRenderer.tsx
import type { UseFormRegister } from 'react-hook-form';
// Importe as tipagens que você definiu no seu projeto
import type { Question } from '@/types'; 
import { InputAnswer } from './InputAnswer';
import { OptionGroup } from './OptionGroup';

interface QuestionRendererProps {
  question: Question;
  // Usamos 'any' aqui para facilitar, mas em produção você pode importar 
  // a interface ExamFormValues do seu ExamExecutor e tipar estritamente
  register: UseFormRegister<any>; 
}

export function QuestionRenderer({ question, register }: QuestionRendererProps) {
  // A nossa "Regra de Design por Subtração" em ação:
  const inputOptions = question.options.filter(opt => opt.type === 'INPUT');
  const markdownOptions = question.options.filter(opt => opt.type === 'MARKDOWN');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Título da Questão */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4 whitespace-pre-wrap">
        {question.title}
      </h3>

      {/* Múltipla Escolha / Checkboxes */}
      {markdownOptions.length > 0 && (
        <OptionGroup 
          options={markdownOptions} 
          questionId={question.id} 
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