// ============================================
// TIPOS PARA EL SISTEMA DE REVISIONES (8 VIDAS GLOBALES)
// ============================================

// Tipos para el resultado de recursos (Reconsideración/Apelación)
export type ResultadoRecursoProyecto = 'fundado' | 'infundado' | 'fundado_en_parte' | null;

// Estructura de un Proceso de Recurso (Reconsideración o Apelación)
export interface ProcesoRecursoProyectoData {
  habilitado: boolean;
  fecha_presentacion?: string;
  documento_recurso?: File[];
  resolucion_recurso?: File[];
  resultado?: ResultadoRecursoProyecto;
  observaciones?: string;
}

// Estructura de Notificación/Carta previa al Acta
export interface NotificacionProyectoData {
  tiene_notificacion: boolean;
  fecha_notificacion?: string;
  archivo_notificacion?: File[];
  documentos_subsanacion_notificacion?: File[];
  subsanacion_completada?: boolean;
}

// Estructura de una Revisión individual por Especialidad
export interface RevisionEspecialidadData {
  id: string;
  numero_revision: number; // 1, 2, 3, ... hasta el límite de la especialidad
  numero_revision_global: number; // Posición en el contador global (1-8)
  fecha_creacion: string;
  
  // Notificación previa (Flujo A)
  notificacion?: NotificacionProyectoData;
  
  // Datos del Acta (Flujo B)
  fecha_respuesta?: string;
  archivo_acta?: File[];
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  
  // Subsanación de observaciones (requerida si No Conforme)
  documentos_subsanacion?: File[];
  subsanacion_completada?: boolean;
  
  // Proceso de Reconsideración (Flujo C)
  reconsideracion?: ProcesoRecursoProyectoData;
  
  // Proceso de Apelación (Flujo D)
  apelacion?: ProcesoRecursoProyectoData;
  
  // Estado de la revisión
  estado: 'en_progreso' | 'completada' | 'improcedente';
}

// Tipo de especialidad
export type TipoEspecialidad = 'arquitectura' | 'estructuras' | 'electricas' | 'sanitarias';

// Límites máximos por especialidad (considerando secuencialidad mínima)
export const LIMITES_ESPECIALIDAD: Record<TipoEspecialidad, number> = {
  arquitectura: 8,  // Puede usar todas las 8 revisiones
  estructuras: 7,   // Máximo 7 (Global 8 - 1 mínimo de Arquitectura)
  electricas: 6,    // Máximo 6 (Global 8 - 1 Arq - 1 Estructuras)
  sanitarias: 6,    // Máximo 6 (Global 8 - 1 Arq - 1 Estructuras)
};

// Constante del máximo global
export const MAX_REVISIONES_GLOBALES = 8;

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface GestionProyectoFormData {
  // Paso 1: Selección del Proyecto
  selectedProyecto?: any;
  proyecto_importado_id?: string;
  
  // Documentos del proyecto externo (si aplica)
  acta_anteproyecto_conforme?: File[];
  ficha_registral?: File[];
  planos_especialidades?: File[];
  
  // Paso 2: Gestión por Especialidades
  especialidades: {
    arquitectura: EspecialidadData;
    estructuras: EspecialidadData;
    electricas: EspecialidadData;
    sanitarias: EspecialidadData;
  };
  
  // Contador global de revisiones (8 vidas)
  revisiones_globales_usadas: number;
  estado_proyecto: 'en_proceso' | 'conforme' | 'improcedente';
  
  // Paso 3: Emisión de Licencia
  licencia_final?: File[];
  cargo_entrega_administrado?: File[];
}

export interface EspecialidadData {
  // Nuevo: Array de revisiones históricas
  revisiones: RevisionEspecialidadData[];
  revision_actual_index: number;
  
  // Estado de la especialidad
  es_conforme: boolean;
  es_improcedente: boolean;
  estado: 'pendiente' | 'en_progreso' | 'conforme' | 'improcedente';
  
  // Campos legacy para compatibilidad
  fecha_respuesta?: string;
  archivo_respuesta?: File[];
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  revision_count: number;
  documentos_subsanacion?: File[];
  
  // Proceso de Reconsideración (opcional) - legacy
  fecha_presentacion_reconsideracion?: string;
  documento_reconsideracion?: File[];
  resolucion_reconsideracion?: File[];
}

// Respuesta del backend según la guía de integración
export interface GestionProyecto {
  id: string;
  instance_code: string;
  service_id?: string;
  client_id: string;
  user_id?: string;
  administrado?: string;
  responsable?: string;
  fecha_creacion?: string;
  fecha_culminacion?: string;
  status: string; // 'Borrador', 'En Proceso', 'Completado', etc.
  progress_percentage?: number;
  created_at?: string;
  scheduled_completion_date?: string;
  next_step?: string;
  uploaded_documents: UploadedDocumentBackend[];
  data: GestionProyectoData;
  steps_status?: StepStatus;
}

// Estructura de data según el backend
export interface GestionProyectoData {
  service_type?: string; // 'gestion_proyectos'
  nombre_proyecto?: string;
  revisiones_globales_usadas: number;
  estado_proyecto: 'en_proceso' | 'conforme' | 'improcedente';
  especialidades: {
    arquitectura: EspecialidadDataBackend;
    estructuras: EspecialidadDataBackend;
    electricas: EspecialidadDataBackend;
    sanitarias: EspecialidadDataBackend;
  };
  // Campos adicionales del frontend
  selectedProyecto?: any;
  proyecto_importado_id?: string;
  acta_anteproyecto_conforme?: File[];
  ficha_registral?: File[];
  planos_especialidades?: File[];
  licencia_final?: File[];
  cargo_entrega_administrado?: File[];
}

// Estructura de especialidad según el backend
export interface EspecialidadDataBackend {
  estado: 'pendiente' | 'en_progreso' | 'conforme' | 'improcedente';
  revisiones: RevisionEspecialidadDataBackend[];
  // Campos calculados en frontend
  revision_actual_index?: number;
  es_conforme?: boolean;
  es_improcedente?: boolean;
  revision_count?: number;
}

// Estructura de revisión según el backend
export interface RevisionEspecialidadDataBackend {
  id: string;
  numero_revision: number;
  numero_revision_global: number;
  fecha_creacion: string;
  fecha_respuesta?: string;
  estado: 'en_progreso' | 'completada' | 'improcedente';
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  // Notificación
  notificacion?: {
    tiene_notificacion: boolean;
    fecha_notificacion?: string;
    subsanacion_completada?: boolean;
  };
  // Reconsideración
  reconsideracion?: {
    habilitado: boolean;
    fecha_presentacion?: string;
    resultado?: 'fundado' | 'infundado' | 'fundado_en_parte' | null;
  };
  // Apelación
  apelacion?: {
    habilitado: boolean;
    fecha_presentacion?: string;
    resultado?: 'fundado' | 'infundado' | 'fundado_en_parte' | null;
  };
  // Campos de archivos (referencias, no archivos físicos)
  archivo_acta?: any;
  archivo_notificacion?: any;
  documentos_subsanacion?: any;
  documentos_subsanacion_notificacion?: any;
  documento_reconsideracion?: any;
  resolucion_reconsideracion?: any;
  documento_apelacion?: any;
  resolucion_apelacion?: any;
  // Campo adicional del frontend
  subsanacion_completada?: boolean;
}

// Documento subido según el backend
export interface UploadedDocumentBackend {
  key: string; // Formato: {especialidad}_rev{numero}_{tipo_documento}
  name: string;
  file_id: string;
  url?: string;
  size?: number;
  type?: string;
}

export interface StepStatus {
  seleccion_proyecto: 'Pendiente' | 'En progreso' | 'Completada';
  gestion_especialidades: 'Pendiente' | 'En progreso' | 'Completada';
  emision_licencia: 'Pendiente' | 'En progreso' | 'Completada';
}

export interface FormStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  key?: string; // Agregado para compatibilidad con backend
  file_id?: string; // Agregado para compatibilidad con backend
}

export enum GestionProyectoStatus {
  TODOS = 'todos',
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
}

export enum DocumentStatus {
  PENDIENTE = 'Pendiente',
  SUBIDO = 'Subido',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
}














