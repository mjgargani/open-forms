import { api } from './api';

export interface UploadResponse {
  url: string; 
  filename?: string;
}

export const uploadMemoFile = async (
  file: File,
  onProgress?: (progressEvent: any) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  
  formData.append('file', file); 

  const response = await api.post<UploadResponse>('/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress, 
  });

  return response.data;
};