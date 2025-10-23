import api from './api';
import type { 
  Conformidad,
  CreateConformidadRequest,
  UpdateConformidadRequest
} from '@/types/conformidad.types';

export const getAllConformidades = async (): Promise<Conformidad[]> => {
  const response = await api.get('/conformidades/');
  return response.data;
};

export const getConformidadById = async (id: string): Promise<Conformidad> => {
  const response = await api.get(`/conformidades/${id}/`);
  return response.data;
};

export const createConformidad = async (conformidadData: CreateConformidadRequest): Promise<Conformidad> => {
  const response = await api.post('/conformidades/', conformidadData);
  return response.data;
};

export const updateConformidad = async (id: string, conformidadData: UpdateConformidadRequest): Promise<Conformidad> => {
  const response = await api.patch(`/conformidades/${id}/`, conformidadData);
  return response.data;
};

export const deleteConformidad = async (id: string): Promise<void> => {
  await api.delete(`/conformidades/${id}/`);
};

export const uploadSingleDocument = async (id: string, file: File, documentKey: string): Promise<any> => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('keys', documentKey);

  const response = await api.post(`/conformidades/${id}/documents`, formData, {
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

  const response = await api.post(`/conformidades/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};



