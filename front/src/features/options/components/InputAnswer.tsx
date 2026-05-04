// front/src/components/InputAnswer.tsx
import React, { useRef, useState } from 'react';
import type { Option } from '@/types';
import { useMemoUpload } from '@/hooks/useMemoUpload';

interface InputAnswerProps {
  option: Option;
}

export function InputAnswer({ option }: InputAnswerProps) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { uploadFile, isUploading, progress, error, setError } = useMemoUpload();

  // Função mágica que injeta o Markdown na posição exata do cursor
  const insertAtCursor = (markdownToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = 
      text.substring(0, start) + 
      markdownToInsert + 
      text.substring(end);
      
    setText(newText);

    // Reposiciona o cursor para depois da imagem inserida
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + markdownToInsert.length;
      textarea.focus();
    }, 0);
  };

  // Lida com a seleção do ficheiro via botão
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const markdownString = await uploadFile(file);
    if (markdownString) {
      insertAtCursor(markdownString);
    }
    
    // Limpa o input para permitir selecionar o mesmo ficheiro novamente, se necessário
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-4 relative">
      {option.description && (
        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
      )}
      
      <div className="border rounded-md shadow-sm bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[120px] p-3 border-none focus:ring-0 resize-y"
          placeholder="Escreva a sua resposta aqui... Pode anexar imagens usando o botão abaixo."
          disabled={isUploading}
        />
        
        {/* Barra de Ferramentas Estilo GitHub */}
        <div className="bg-gray-50 border-t px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !navigator.onLine}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 flex items-center text-sm font-medium transition-colors cursor-pointer"
              title={!navigator.onLine ? "Upload indisponível offline" : "Anexar imagem"}
            >
              {/* Ícone de Clipe de Papel simples em SVG */}
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              Anexar
            </button>
          </div>

          {/* Feedback de Progresso ou Erro */}
          <div className="text-sm">
            {isUploading && (
              <span className="text-blue-600 font-medium animate-pulse">
                A enviar... {progress}%
              </span>
            )}
            {error && (
              <span className="text-red-500 flex items-center">
                {error}
                <button onClick={() => setError(null)} className="ml-2 text-gray-400 hover:text-red-700">×</button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}