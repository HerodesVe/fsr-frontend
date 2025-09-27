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
  
  // Paso 3: Emisión de Licencia
  licencia_final?: File[];
  cargo_entrega_administrado?: File[];
}

export interface EspecialidadData {
  fecha_respuesta?: string;
  archivo_respuesta?: File[];
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  revision_count: number;
  documentos_subsanacion?: File[];
  es_conforme: boolean;
  
  // Proceso de Reconsideración (opcional)
  fecha_presentacion_reconsideracion?: string;
  documento_reconsideracion?: File[];
  resolucion_reconsideracion?: File[];
}

export interface GestionProyecto {
  id: string;
  instance_code: string;
  service_id: string;
  client_id: string;
  user_id: string;
  administrado: string;
  responsable: string;
  fecha_creacion: string;
  fecha_culminacion?: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  scheduled_completion_date?: string;
  next_step: string;
  uploaded_documents: UploadedDocument[];
  data: GestionProyectoFormData;
  steps_status: StepStatus;
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
