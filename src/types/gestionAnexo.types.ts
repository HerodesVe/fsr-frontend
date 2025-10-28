// Estructura de información de documentos
export interface DocumentInfo {
  name: string;
  is_mandatory: boolean;
  status: 'Pendiente' | 'Subido' | 'Rechazado';
  file_reference: string;
  emission_date?: string;
  observation: string;
}

export interface GestionAnexoFormData {
  // Paso 1: Administrado
  selectedClient: any | null;
  nombre_proyecto: string;

  // Paso 2: Documentación del Administrado
  anexo_h_formato: File[];
  contrato_supervisor: File[];
  poliza_car: File[];
  resolucion_licencia_obra: File[];
  cronograma_visitas: File[];
  cronograma_obra: File[];
  otros_documentos: File[];
  fecha_inicio_ejecucion: string;
  comentarios_documentacion: string;

  // Paso 3: Presentación en Municipalidad
  hoja_tramite_cargo: File[];
  fecha_ingreso_municipalidad: string;

  // Paso 4: Cierre y Entrega
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: File[];
  observaciones_entrega: string;
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
  key?: string;
}

export interface GestionAnexoItem {
  id: string;
  instance_code: string;
  client_id: string;
  service_id: string;
  user_id: string;
  administrado: string;
  responsable: string;
  fecha_creacion: string;
  fecha_culminacion: string;
  status: string;
  progress_percentage?: number;
  created_at: string;
  scheduled_completion_date: string | null;
  next_step?: string;
  data?: {
    service_type?: string;
    nombre_proyecto?: string;
    documentacion_anexo?: {
      anexo_h_formato?: DocumentInfo;
      contrato_supervisor?: DocumentInfo;
      poliza_car?: DocumentInfo;
      resolucion_licencia_obra?: DocumentInfo;
      cronograma_visitas?: DocumentInfo;
      cronograma_obra?: DocumentInfo;
      otros_documentos?: DocumentInfo;
      fecha_inicio_ejecucion?: string;
      comentarios_documentacion?: string;
    };
    presentacion_municipal?: {
      hoja_tramite_cargo?: DocumentInfo;
      fecha_ingreso_municipalidad?: string;
    };
    cierre_servicio?: {
      fecha_entrega_administrado?: string;
      receptor_administrado?: string;
      cargo_entrega_administrado?: DocumentInfo;
      observaciones_entrega?: string;
    };
    [key: string]: any;
  };
  steps_status: {
    administrado: string;
    documentacion: string;
    presentacion: string;
    cierre: string;
  };
  uploaded_documents?: Array<{
    key: string;
    name: string;
    file_id: string;
  }>;
}

export enum GestionAnexoStatus {
  TODOS = 'todos',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado'
}

export interface StepStatus {
  administrado: 'Pendiente' | 'En progreso' | 'Completada';
  documentacion: 'Pendiente' | 'En progreso' | 'Completada';
  presentacion: 'Pendiente' | 'En progreso' | 'Completada';
  cierre: 'Pendiente' | 'En progreso' | 'Completada';
}
