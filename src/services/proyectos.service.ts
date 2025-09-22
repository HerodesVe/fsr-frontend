import api from './api';
import type { 
  Proyecto, 
  CreateProyectoRequest, 
  UpdateProyectoRequest,
  UploadDocumentRequest 
} from '@/types/proyecto.types';

export const getAllProyectos = async (): Promise<Proyecto[]> => {
  const response = await api.get('/proyectos/');
  return response.data;
};

export const getProyectoById = async (id: string): Promise<Proyecto> => {
  const response = await api.get(`/proyectos/${id}/`);
  return response.data;
};

export const createProyecto = async (proyectoData: CreateProyectoRequest | any): Promise<Proyecto> => {
  const response = await api.post('/proyectos/', proyectoData);
  return response.data;
};

export const createInitialProyecto = async (data: { 
  client_id: string; 
  data: { 
    service_type: string; 
    titulo_proyecto: string;
    tipo_proyecto: string;
    descripcion: string;
    anteproyecto_importado_id?: string; 
  } 
}): Promise<Proyecto> => {
  const response = await api.post('/proyectos/', data);
  return response.data;
};

export const updateProyecto = async (proyectoData: UpdateProyectoRequest | any): Promise<Proyecto> => {
  const { id, ...data } = proyectoData;
  const response = await api.patch(`/proyectos/${id}/`, data);
  return response.data;
};

export const deleteProyecto = async (id: string): Promise<void> => {
  await api.delete(`/proyectos/${id}/`);
};

export const uploadSingleDocument = async (id: string, file: File, documentKey: string): Promise<any> => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('keys', documentKey);

  const response = await api.post(`/proyectos/${id}/documents`, formData, {
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

  const response = await api.post(`/proyectos/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};