import api from './api';
import type { GestionAnteproyecto } from '@/types/gestionAnteproyecto.types';

const GESTION_ANTEPROYECTO_ENDPOINT = '/gestion-anteproyectos/';

// Obtener todas las gestiones de anteproyectos
export const getAllGestionAnteproyectos = async (): Promise<GestionAnteproyecto[]> => {
  const response = await api.get(GESTION_ANTEPROYECTO_ENDPOINT);
  return response.data;
};

// Obtener una gestión por ID
export const getGestionAnteproyectoById = async (id: string): Promise<GestionAnteproyecto> => {
  const response = await api.get(`${GESTION_ANTEPROYECTO_ENDPOINT}${id}`);
  return response.data;
};

// Crear una nueva gestión
export const createGestionAnteproyecto = async (data: any): Promise<GestionAnteproyecto> => {
  const response = await api.post(GESTION_ANTEPROYECTO_ENDPOINT, data);
  return response.data;
};

// Actualizar una gestión existente
export const updateGestionAnteproyecto = async (id: string, data: any): Promise<GestionAnteproyecto> => {
  const response = await api.patch(`${GESTION_ANTEPROYECTO_ENDPOINT}${id}`, data);
  return response.data;
};

// Eliminar una gestión
export const deleteGestionAnteproyecto = async (id: string): Promise<void> => {
  await api.delete(`${GESTION_ANTEPROYECTO_ENDPOINT}${id}`);
};

// Subir documentos para una gestión
export const uploadDocuments = async (
  gestionId: string,
  files: File[],
  documentKeys: string[]
): Promise<GestionAnteproyecto> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Agregar cada key individualmente (el backend espera 'keys', no 'document_keys')
  documentKeys.forEach((key) => {
    formData.append('keys', key);
  });
  
  const response = await api.post(
    `${GESTION_ANTEPROYECTO_ENDPOINT}${gestionId}/documents`,
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
    `${GESTION_ANTEPROYECTO_ENDPOINT}${gestionId}/documents/${documentId}`,
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

