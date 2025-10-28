import api from './api';
import type { Modificacion } from '@/types/modificacion.types';

export const getAllModificaciones = async (): Promise<Modificacion[]> => {
  const response = await api.get('/modificaciones/');
  return response.data;
};

export const getModificacionById = async (id: string): Promise<Modificacion> => {
  const response = await api.get(`/modificaciones/${id}/`);
  return response.data;
};

export const createModificacion = async (modificacionData: any): Promise<Modificacion> => {
  const response = await api.post('/modificaciones/', modificacionData);
  return response.data;
};

export const updateModificacion = async (id: string, modificacionData: any): Promise<Modificacion> => {
  const response = await api.patch(`/modificaciones/${id}/`, modificacionData);
  return response.data;
};

export const deleteModificacion = async (id: string): Promise<void> => {
  await api.delete(`/modificaciones/${id}/`);
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

  const response = await api.post(`/modificaciones/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const downloadDocument = async (modificacionId: string, documentId: string): Promise<Blob> => {
  const response = await api.get(`/modificaciones/${modificacionId}/documents/${documentId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const downloadDocumentWithName = async (modificacionId: string, documentId: string, fileName: string): Promise<void> => {
  const blob = await downloadDocument(modificacionId, documentId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

