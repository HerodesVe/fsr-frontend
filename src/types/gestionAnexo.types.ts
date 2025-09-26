export interface GestionAnexoFormData {
  // Paso 1: Administrado
  selectedClient: any | null;

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
  cargo_entrega_administrado: File[];
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
  administrado: string;
  responsable: string;
  fecha_creacion: string;
  fecha_culminacion: string;
  status: string;
  created_at: string;
  scheduled_completion_date: string | null;
  data: {
    nombre_proyecto: string;
  };
  steps_status: {
    administrado: string;
    documentacion: string;
    presentacion: string;
    cierre: string;
  };
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
