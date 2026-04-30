import { useState } from 'react';
import { uploadMemoFile } from '../lib/upload.service';

export function useMemoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!navigator.onLine) {
      setError('Upload indisponível no modo offline.');
      return null;
    }

    if (!file.type.startsWith('image/')) {
      setError('Apenas ficheiros de imagem são permitidos.');
      return null;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await uploadMemoFile(file, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      return `\n![${file.name}](${response.url})\n`;
      
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError('Falha ao enviar a imagem. Tente novamente.');
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000); 
    }
  };

  return { uploadFile, isUploading, progress, error, setError };
}