import api from './api';
import type { Ampliacion } from '@/types/ampliacion.types';

export const getAllAmpliaciones = async (): Promise<Ampliacion[]> => {
  const response = await api.get('/ampliaciones/');
  return response.data;
};

export const getAmpliacionById = async (id: string): Promise<Ampliacion> => {
  const response = await api.get(`/ampliaciones/${id}/`);
  return response.data;
};

export const createAmpliacion = async (ampliacionData: any): Promise<Ampliacion> => {
  const response = await api.post('/ampliaciones/', ampliacionData);
  return response.data;
};

export const updateAmpliacion = async (id: string, ampliacionData: any): Promise<Ampliacion> => {
  const response = await api.patch(`/ampliaciones/${id}/`, ampliacionData);
  return response.data;
};

export const deleteAmpliacion = async (id: string): Promise<void> => {
  await api.delete(`/ampliaciones/${id}/`);
};

export const uploadDocuments = async (id: string, uploadData: { files: File[]; keys: string[] }): Promise<any> => {
  const formData = new FormData();
  
  uploadData.files.forEach((file) => {
    formData.append('files', file);
  });
  
  uploadData.keys.forEach((key) => {
    formData.append('keys', key);
  });

  const response = await api.post(`/ampliaciones/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const downloadDocument = async (ampliacionId: string, documentId: string): Promise<Blob> => {
  const response = await api.get(`/ampliaciones/${ampliacionId}/documents/${documentId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const downloadDocumentWithName = async (ampliacionId: string, documentId: string, fileName: string): Promise<void> => {
  const blob = await downloadDocument(ampliacionId, documentId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

