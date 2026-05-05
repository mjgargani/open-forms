import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';
import { Trash2, GripVertical, PlusCircle } from 'lucide-react';

interface QuestionBlockProps {
  index: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  onDelete: () => void;
}

export function QuestionBlock({ index, control, register, onDelete }: QuestionBlockProps) {
  
  // O Controlador do Array de Opções DENTRO desta Questão específica
  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `questions.${index}.options`
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex gap-4 group">
      
      {/* Alça de Arrastar (Para futuro Drag & Drop) */}
      <div className="text-gray-300 cursor-grab hover:text-gray-500 mt-2">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <input
            {...register(`questions.${index}.title`)}
            className="text-lg font-semibold w-full outline-none bg-gray-50 p-3 rounded-md focus:bg-white focus:ring-2 focus:ring-primary/20"
            placeholder="Digite a sua pergunta aqui"
            onBlur={(e) => console.log(`💾 Auto-save Questão ${index}:`, e.target.value)}
          />
          
          <select 
            {...register(`questions.${index}.type`)}
            className="p-3 border rounded-md bg-white text-sm font-medium outline-none"
            onChange={(e) => console.log(`💾 Auto-save Tipo da Questão ${index}:`, e.target.value)}
          >
            <option value="SINGLE">Múltipla Escolha</option>
            <option value="MULTIPLE">Caixas de Seleção</option>
            <option value="DISCURSIVE">Texto Longo</option>
          </select>
        </div>

        {/* Renderização das Opções */}
        <div className="space-y-2 pl-4">
          {options.map((option, optIndex) => (
            <div key={option.id} className="flex items-center gap-3">
              {/* Bolinha/Quadrado visual (Apenas estético no builder) */}
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              
              <input
                {...register(`questions.${index}.options.${optIndex}.description`)}
                className="flex-1 outline-none border-b border-transparent focus:border-gray-300 p-1 transition-colors"
                placeholder={`Opção ${optIndex + 1}`}
                onBlur={(e) => console.log(`💾 Auto-save Opção ${optIndex}:`, e.target.value)}
              />
              
              <button onClick={() => removeOption(optIndex)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Botão de Adicionar Opção */}
          <button 
            type="button"
            onClick={() => appendOption({ description: "", correct: false })}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline mt-2 pt-2"
          >
            <PlusCircle className="w-4 h-4" /> Adicionar opção
          </button>
        </div>
      </div>

      {/* Ações da Questão */}
      <div className="flex flex-col justify-end border-l pl-4 ml-2">
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}