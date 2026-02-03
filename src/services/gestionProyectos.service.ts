import api from './api';
import type { GestionProyecto } from '@/types/gestionProyecto.types';

const GESTION_PROYECTO_ENDPOINT = '/gestion-proyectos/';

// Obtener todas las gestiones de proyectos
export const getAllGestionProyectos = async (): Promise<GestionProyecto[]> => {
  const response = await api.get(GESTION_PROYECTO_ENDPOINT);
  return response.data;
};

// Obtener una gestión por ID
export const getGestionProyectoById = async (id: string): Promise<GestionProyecto> => {
  const response = await api.get(`${GESTION_PROYECTO_ENDPOINT}${id}`);
  return response.data;
};

// Crear una nueva gestión (Endpoint 1: Crear Expediente)
export interface CreateGestionProyectoPayload {
  client_id: string;
  data?: {
    nombre_proyecto?: string;
  };
}

export const createGestionProyecto = async (payload: CreateGestionProyectoPayload): Promise<GestionProyecto> => {
  const response = await api.post(GESTION_PROYECTO_ENDPOINT, payload);
  return response.data;
};

// Actualizar una gestión existente (Endpoint 3: PATCH)
// Este es el endpoint principal para agregar/actualizar revisiones
export interface UpdateGestionProyectoPayload {
  data: {
    especialidades?: {
      arquitectura?: EspecialidadPayload;
      estructuras?: EspecialidadPayload;
      electricas?: EspecialidadPayload;
      sanitarias?: EspecialidadPayload;
    };
  };
}

export interface EspecialidadPayload {
  estado?: 'pendiente' | 'en_progreso' | 'conforme' | 'improcedente';
  revision_actual_index?: number;
  revisiones?: RevisionPayload[];
}

export interface RevisionPayload {
  id: string;
  numero_revision: number;
  numero_revision_global: number;
  fecha_creacion?: string;
  fecha_respuesta?: string;
  estado?: 'en_progreso' | 'completada' | 'improcedente';
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  notificacion?: {
    tiene_notificacion: boolean;
    fecha_notificacion?: string;
    subsanacion_completada?: boolean;
  };
  reconsideracion?: {
    habilitado: boolean;
    fecha_presentacion?: string;
    resultado?: 'fundado' | 'infundado' | 'fundado_en_parte' | null;
  };
  apelacion?: {
    habilitado: boolean;
    fecha_presentacion?: string;
    resultado?: 'fundado' | 'infundado' | 'fundado_en_parte' | null;
  };
}

export const updateGestionProyecto = async (id: string, payload: UpdateGestionProyectoPayload): Promise<GestionProyecto> => {
  const response = await api.patch(`${GESTION_PROYECTO_ENDPOINT}${id}`, payload);
  return response.data;
};

// Eliminar una gestión
export const deleteGestionProyecto = async (id: string): Promise<void> => {
  await api.delete(`${GESTION_PROYECTO_ENDPOINT}${id}`);
};

// Subir documentos para una gestión (Endpoint 4: Multi-part)
// Formato de keys: {especialidad}_rev{numero}_{tipo_documento}
// Tipos de documento soportados:
// - notificacion
// - subsanacion_notificacion
// - acta
// - subsanacion
// - reconsideracion_documento
// - reconsideracion_resolucion
// - apelacion_documento
// - apelacion_resolucion
export const uploadGestionProyectoDocuments = async (
  gestionId: string,
  files: File[],
  documentKeys: string[]
): Promise<GestionProyecto> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Agregar cada key individualmente (el backend espera 'keys')
  documentKeys.forEach((key) => {
    formData.append('keys', key);
  });
  
  const response = await api.post(
    `${GESTION_PROYECTO_ENDPOINT}${gestionId}/documents`,
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
export const downloadGestionProyectoDocument = async (
  gestionId: string,
  documentId: string
): Promise<Blob> => {
  const response = await api.get(
    `${GESTION_PROYECTO_ENDPOINT}${gestionId}/documents/${documentId}`,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

// Descargar un documento con nombre específico
export const downloadGestionProyectoDocumentWithName = async (
  gestionId: string,
  documentId: string,
  fileName: string
): Promise<void> => {
  const blob = await downloadGestionProyectoDocument(gestionId, documentId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Utilidad para generar la key del documento según el formato del backend
export const generateDocumentKey = (
  especialidad: 'arquitectura' | 'estructuras' | 'electricas' | 'sanitarias',
  numeroRevision: number,
  tipoDocumento: 
    | 'notificacion' 
    | 'subsanacion_notificacion' 
    | 'acta' 
    | 'subsanacion' 
    | 'reconsideracion_documento' 
    | 'reconsideracion_resolucion' 
    | 'apelacion_documento' 
    | 'apelacion_resolucion'
): string => {
  return `${especialidad}_rev${numeroRevision}_${tipoDocumento}`;
};
