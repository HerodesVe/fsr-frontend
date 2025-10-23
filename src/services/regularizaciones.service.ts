import api from './api';
import type { 
  Regularizacion,
  CreateRegularizacionRequest,
  UpdateRegularizacionRequest
} from '@/types/regularizacion.types';

export const getAllRegularizaciones = async (): Promise<Regularizacion[]> => {
  const response = await api.get('/regularizaciones/');
  return response.data;
};

export const getRegularizacionById = async (id: string): Promise<Regularizacion> => {
  const response = await api.get(`/regularizaciones/${id}/`);
  return response.data;
};

export const createRegularizacion = async (regularizacionData: CreateRegularizacionRequest): Promise<Regularizacion> => {
  const response = await api.post('/regularizaciones/', regularizacionData);
  return response.data;
};

export const updateRegularizacion = async (id: string, regularizacionData: UpdateRegularizacionRequest): Promise<Regularizacion> => {
  const response = await api.patch(`/regularizaciones/${id}/`, regularizacionData);
  return response.data;
};

export const deleteRegularizacion = async (id: string): Promise<void> => {
  await api.delete(`/regularizaciones/${id}/`);
};

export const uploadSingleDocument = async (id: string, file: File, documentKey: string): Promise<any> => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('keys', documentKey);

  const response = await api.post(`/regularizaciones/${id}/documents`, formData, {
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

  const response = await api.post(`/regularizaciones/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Función para descargar un documento específico
export const downloadDocument = async (regularizacionId: string, documentId: string): Promise<Blob> => {
  const response = await api.get(`/regularizaciones/${regularizacionId}/documents/${documentId}`, {
    responseType: 'blob',
  });
  
  return response.data;
};

// Helper para descargar documento con nombre de archivo
export const downloadDocumentWithName = async (
  regularizacionId: string, 
  documentId: string, 
  fileName: string
): Promise<void> => {
  try {
    const blob = await downloadDocument(regularizacionId, documentId);
    
    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};



