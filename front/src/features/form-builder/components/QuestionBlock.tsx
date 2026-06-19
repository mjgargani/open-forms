import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';
import { Trash2, GripVertical, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { FormPayload } from '@/types/form';

interface QuestionBlockProps {
  index: number;
  control: Control<FormPayload>;
  register: UseFormRegister<FormPayload>;
  onDelete: () => void;
  onSave: () => void;
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function QuestionBlock({ index, control, register, onDelete, onSave, id }: QuestionBlockProps & { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `questions.${index}.options`
  });

  const handleAddOption = () => {
    appendOption({ 
      id: uuidv4(), 
      description: "", 
      type: 'MARKDOWN',
      correct: false 
    });
    setTimeout(onSave, 0);
  };

  const handleRemoveOption = (optIndex: number) => {
    removeOption(optIndex);
    setTimeout(onSave, 0);
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex gap-4 group">
      
      <div {...attributes} {...listeners} className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500 mt-2">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <input
            {...register(`questions.${index}.title`)}
            onBlur={onSave} // MÁGICA: Dispara a transação atômica ao perder o foco!
            className="text-lg font-semibold w-full outline-none bg-gray-50 p-3 rounded-md focus:bg-white focus:ring-2 focus:ring-primary/20"
            placeholder="Digite a sua pergunta aqui"
          />
        </div>

        <div className="space-y-2 pl-2">
          {options.map((opt, optIndex) => (
            <div key={opt.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register(`questions.${index}.options.${optIndex}.correct`)}
                onChange={() => setTimeout(onSave, 0)} // MÁGICA: Salva o gabarito
                className="w-4 h-4 border-2 border-gray-300 text-primary focus:ring-primary rounded"
                title="Marcar como resposta correta"
              />
              
              <input
                {...register(`questions.${index}.options.${optIndex}.description`)}
                onBlur={onSave} // MÁGICA: Salva a nova letra ou palavra no banco
                className="flex-1 outline-none border-b border-transparent focus:border-gray-300 p-1 transition-colors"
                placeholder={`Opção ${optIndex + 1}`}
              />
              
              <button 
                type="button" 
                onClick={() => handleRemoveOption(optIndex)} 
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button 
            type="button"
            onClick={handleAddOption}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline mt-2 pt-2"
          >
            <PlusCircle className="w-4 h-4" /> Adicionar opção
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-end border-l pl-4 ml-2">
        <button 
          type="button" 
          onClick={onDelete} 
          className="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}