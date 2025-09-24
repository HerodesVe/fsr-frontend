export enum RegularizacionStatus {
  TODOS = 'todos',
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
}

export enum DocumentStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  OBSERVADO = 'Observado',
}

export interface DocumentFile {
  name: string;
  is_mandatory: boolean;
  status: DocumentStatus;
  file_reference: string;
  emission_date: string;
  observation: string;
}

export interface UploadedDocument {
  key: string;
  name: string;
  file_id: string;
}

export interface FormStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface RegularizacionFormData {
  // Paso 1: Administrado
  selectedClient: any | null;
  
  // Datos adicionales del administrado (si se crea nuevo)
  administrado: string;
  fue_nombre: string;
  fue_dni: string;
  fue_domicilio: string;
  fue_telefono: string;

  // Paso 2: Documentación Inicial
  fechaCulminacion: string;
  licenciaAnterior: File[];
  declaratoriaFabrica: File[];
  planosAntecedentes: File[];
  otros: File[];

  // Paso 3: Datos del Predio
  fue_ubicacion: string;
  fue_partida: string;
  fue_modalidad: string;
  fue_presupuesto: string;

  // Paso 4: FUE Firmado
  fueFirmado: File[];

  // Paso 5: Gestión Municipal
  cargoMunicipal: File[];
  actaObservacion: File[];
  docSubsanacion: File[];
  resolucionFinal: File[];
}

export interface StepStatus {
  administrado: 'Completada' | 'Pendiente' | 'En progreso';
  documentacion_inicial: 'Completada' | 'Pendiente' | 'En progreso';
  datos_predio: 'Completada' | 'Pendiente' | 'En progreso';
  fue_firmado: 'Completada' | 'Pendiente' | 'En progreso';
  gestion_municipal: 'Completada' | 'Pendiente' | 'En progreso';
}

export interface RegularizacionData {
  service_type: string;
  titulo_proceso: string;
  tipo_regularizacion: string;
  descripcion: string;
  datos_administrado: {
    nombre: string;
    dni: string;
    domicilio: string;
    telefono: string;
  };
  documentacion_inicial: {
    fecha_culminacion: string;
    licencia_anterior: DocumentFile[];
    declaratoria_fabrica: DocumentFile[];
    planos_antecedentes: DocumentFile[];
    otros_documentos: DocumentFile[];
  };
  datos_predio: {
    ubicacion: string;
    partida_registral: string;
    modalidad_licencia: string;
    presupuesto_obra: string;
  };
  fue_firmado: DocumentFile[];
  gestion_municipal: {
    cargo_municipal: DocumentFile[];
    acta_observacion: DocumentFile[];
    documentos_subsanacion: DocumentFile[];
    resolucion_final: DocumentFile[];
  };
}

export interface Regularizacion {
  id: string;
  instance_code: string;
  service_id: string;
  client_id: string;
  user_id: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  scheduled_completion_date?: string;
  data: RegularizacionData;
  steps_status: StepStatus;
  next_step: string;
  uploaded_documents: UploadedDocument[];
  // Campos adicionales que pueden venir de la API
  administrado?: string;
  responsable?: string;
  fecha_creacion?: string;
  fecha_culminacion?: string;
}

export interface CreateRegularizacionRequest {
  client_id: string;
  data: RegularizacionData;
}

export interface UpdateRegularizacionRequest extends CreateRegularizacionRequest {
  id: string;
}

export interface UploadDocumentRequest {
  files: File[];
  keys: string[];
}
