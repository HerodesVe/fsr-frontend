import api from './api';
import type { GestionAnexoItem } from '@/types/gestionAnexo.types';

const GESTION_ANEXO_ENDPOINT = '/gestion-anexo/';

// Obtener todas las gestiones del anexo H
export const getAllGestionAnexos = async (): Promise<GestionAnexoItem[]> => {
  const response = await api.get(GESTION_ANEXO_ENDPOINT);
  return response.data;
};

// Obtener una gestión por ID
export const getGestionAnexoById = async (id: string): Promise<GestionAnexoItem> => {
  const response = await api.get(`${GESTION_ANEXO_ENDPOINT}${id}`);
  return response.data;
};

// Crear una nueva gestión
export const createGestionAnexo = async (data: any): Promise<GestionAnexoItem> => {
  const response = await api.post(GESTION_ANEXO_ENDPOINT, data);
  return response.data;
};

// Actualizar una gestión existente
export const updateGestionAnexo = async (id: string, data: any): Promise<GestionAnexoItem> => {
  const response = await api.patch(`${GESTION_ANEXO_ENDPOINT}${id}`, data);
  return response.data;
};

// Eliminar una gestión
export const deleteGestionAnexo = async (id: string): Promise<void> => {
  await api.delete(`${GESTION_ANEXO_ENDPOINT}${id}`);
};

// Subir documentos para una gestión
export const uploadDocuments = async (
  gestionId: string,
  files: File[],
  documentKeys: string[]
): Promise<GestionAnexoItem> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Agregar cada key individualmente (no como JSON stringificado)
  documentKeys.forEach((key) => {
    formData.append('keys', key);
  });
  
  const response = await api.post(
    `${GESTION_ANEXO_ENDPOINT}${gestionId}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

// Descargar un documento específico
export const downloadDocument = async (
  gestionId: string,
  documentId: string
): Promise<Blob> => {
  const response = await api.get(
    `${GESTION_ANEXO_ENDPOINT}${gestionId}/documents/${documentId}`,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

// Descargar un documento con nombre específico
export const downloadDocumentWithName = async (
  gestionId: string,
  documentId: string,
  fileName: string
): Promise<void> => {
  const blob = await downloadDocument(gestionId, documentId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

