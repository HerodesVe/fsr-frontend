import api from './api';
import type { 
  Anteproyecto, 
  CreateAnteproyectoRequest, 
  UpdateAnteproyectoRequest,
  UploadDocumentRequest 
} from '@/types/anteproyecto.types';

export const getAllAnteproyectos = async (): Promise<Anteproyecto[]> => {
  const response = await api.get('/anteproyectos/');
  return response.data;
};

export const getAnteproyectoById = async (id: string): Promise<Anteproyecto> => {
  const response = await api.get(`/anteproyectos/${id}/`);
  return response.data;
};

export const createAnteproyecto = async (anteproyectoData: CreateAnteproyectoRequest | any): Promise<Anteproyecto> => {
  const response = await api.post('/anteproyectos/', anteproyectoData);
  return response.data;
};

export const createInitialAnteproyecto = async (data: { 
  client_id: string; 
  data: { 
    service_type: string; 
    nombre_proyecto: string; 
  } 
}): Promise<Anteproyecto> => {
  const response = await api.post('/anteproyectos/', data);
  return response.data;
};

export const updateAnteproyecto = async (anteproyectoData: UpdateAnteproyectoRequest | any): Promise<Anteproyecto> => {
  const { id, ...data } = anteproyectoData;
  const response = await api.patch(`/anteproyectos/${id}/`, data);
  return response.data;
};

export const deleteAnteproyecto = async (id: string): Promise<void> => {
  await api.delete(`/anteproyectos/${id}/`);
};


export const uploadSingleDocument = async (id: string, file: File, documentKey: string): Promise<any> => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('keys', documentKey);

  const response = await api.post(`/anteproyectos/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const uploadDocuments = async (id: string, uploadData: UploadDocumentRequest): Promise<any> => {
  const formData = new FormData();
  
  // Agregar archivos al FormData
  uploadData.files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Agregar keys al FormData
  uploadData.keys.forEach((key) => {
    formData.append('keys', key);
  });

  const response = await api.post(`/anteproyectos/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
