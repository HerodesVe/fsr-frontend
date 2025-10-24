import api from './api';
import type { 
  Demolicion,
  CreateDemolicionRequest,
  UpdateDemolicionRequest
} from '@/types/demolicion.types';

export const getAllDemoliciones = async (): Promise<Demolicion[]> => {
  const response = await api.get('/demoliciones/');
  return response.data;
};

export const getDemolicionById = async (id: string): Promise<Demolicion> => {
  const response = await api.get(`/demoliciones/${id}/`);
  return response.data;
};

export const createDemolicion = async (demolicionData: CreateDemolicionRequest): Promise<Demolicion> => {
  const response = await api.post('/demoliciones/', demolicionData);
  return response.data;
};

export const updateDemolicion = async (id: string, demolicionData: UpdateDemolicionRequest): Promise<Demolicion> => {
  const response = await api.patch(`/demoliciones/${id}/`, demolicionData);
  return response.data;
};

export const deleteDemolicion = async (id: string): Promise<void> => {
  await api.delete(`/demoliciones/${id}/`);
};

export const uploadSingleDocument = async (id: string, file: File, documentKey: string): Promise<any> => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('keys', documentKey);

  const response = await api.post(`/demoliciones/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const uploadDocuments = async (id: string, uploadData: { files: File[]; keys: string[] }): Promise<any> => {
  const formData = new FormData();
  
  // Agregar archivos al FormData
  uploadData.files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Agregar keys al FormData
  uploadData.keys.forEach((key) => {
    formData.append('keys', key);
  });

  const response = await api.post(`/demoliciones/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const downloadDocument = async (id: string, documentId: string): Promise<Blob> => {
  const response = await api.get(`/demoliciones/${id}/documents/${documentId}`, {
    responseType: 'blob', // Important for file downloads
  });
  return response.data;
};

export const downloadDocumentWithName = async (id: string, documentId: string, fileName: string): Promise<void> => {
  const blob = await downloadDocument(id, documentId);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};



