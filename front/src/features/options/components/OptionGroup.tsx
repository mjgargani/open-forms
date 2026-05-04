import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
// Importe a sua interface Option do ficheiro de tipos central (ex: '@/types')
// interface Option { id: string; description: string; type: string; }

interface OptionGroupProps {
  options: any[]; // Substitua 'any' pela sua interface 'Option'
  questionId: string;
  register: UseFormRegister<any>;
}

export function OptionGroup({ options, questionId, register }: OptionGroupProps) {
  return (
    <div className="mt-4 space-y-3">
      {options.map((option) => (
        <label 
          key={option.id} 
          // O focus-within garante que se o aluno usar a tecla TAB para navegar, 
          // a caixa inteira fica destacada, melhorando a acessibilidade.
          className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-slate-50 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
        >
          <input
            // Lembra-se do "Paradoxo do Gabarito"? Como o backend esconde 
            // a resposta certa, usamos checkbox por padrão para permitir múltiplas seleções.
            type="checkbox" 
            value={option.id}
            // A MÁGICA: Amarramos todos os checkboxes desta questão à mesma chave no JSON
            {...register(`answers.${questionId}`)}
            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
          />
          <span className="text-gray-700 text-base leading-relaxed">
            {option.description}
          </span>
        </label>
      ))}
    </div>
  );
}