export enum AnteproyectoStatus {
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

export interface Ubicacion {
  urbanization: string;
  mz: string;
  lote: string;
  subLote: string;
  street: string;
  number: string;
  interior: string;
  departmentId: string;
  provinceId: string;
  districtId: string;
}

export interface MedidasPerimetricas {
  area_total_m2: number;
  frente: number;
  derecha: number;
  izquierda: number;
  fondo: number;
}

export interface Edificacion {
  tipo_edificacion: string;
  numero_pisos: number;
  descripcion_proyecto: string;
}

export interface DatosPredio {
  ubicacion: Ubicacion;
  latitud: number;
  longitud: number;
  medidas_perimetricas: MedidasPerimetricas;
  edificacion: Edificacion;
}

export interface LicenciasNormativas {
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;
  link_normativas: string;
  archivo_normativo: DocumentFile;
}

export interface AnteproyectoData {
  service_type: string;
  nombre_proyecto: string;
  licencias_normativas: LicenciasNormativas;
  datos_predio: DatosPredio;
  partida_registral: DocumentFile;
  plano_arquitectura_adm: DocumentFile;
  pago_derecho_revision_factura: DocumentFile;
  memoria_descriptiva_arquitectura: DocumentFile;
  memoria_descriptiva_seguridad: DocumentFile;
  formulario_unico_edificacion: DocumentFile;
  presupuesto: DocumentFile;
  plano_seguridad: DocumentFile;
  pago_derecho_revision_liquidacion: DocumentFile;
}

export interface StepStatus {
  datos_administrado: 'Completada' | 'Pendiente';
  licencias_normativas: 'Completada' | 'Pendiente';
  datos_predio: 'Completada' | 'Pendiente';
  documentos: 'Completada' | 'Pendiente';
}

export interface UploadedDocument {
  key: string;
  name: string;
  file_id: string;
}

export interface Anteproyecto {
  id: string;
  instance_code: string;
  service_id: string;
  client_id: string;
  user_id: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  scheduled_completion_date?: string;
  data: AnteproyectoData;
  steps_status: StepStatus;
  next_step: string;
  uploaded_documents: UploadedDocument[];
  // Campos adicionales que pueden venir de la API
  administrado?: string;
  responsable?: string;
  fecha_creacion?: string;
  fecha_culminacion?: string;
}

export interface CreateAnteproyectoRequest {
  client_id: string;
  data: AnteproyectoData;
}

export interface UpdateAnteproyectoRequest extends CreateAnteproyectoRequest {
  id: string;
}

export interface UploadDocumentRequest {
  files: File[];
  keys: string[];
}

// Tipos para el formulario paso a paso
export interface FormStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface AnteproyectoFormData {
  // Paso 1: Administrado
  selectedClient: any; // Será del tipo ClientOut cuando se seleccione

  // Paso 2: Licencias
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;
  link_normativas: string;
  archivo_normativo?: File;

  // Paso 3: Predio
  // Ubicación
  departmentId: string;
  provinceId: string;
  districtId: string;
  urbanization: string;
  mz: string;
  lote: string;
  subLote: string;
  street: string;
  number: string;
  interior: string;
  
  // Coordenadas
  latitud: number;
  longitud: number;
  
  // Medidas
  area_total_m2: number;
  frente: number;
  derecha: number;
  izquierda: number;
  fondo: number;
  
  // Edificación
  tipo_edificacion: string;
  numero_pisos: number;
  descripcion_proyecto: string;

  // Paso 4: Documentos - Archivos
  partida_registral?: File[];
  plano_arquitectura_adm?: File[];
  pago_derecho_revision_factura?: File[];
  memoria_descriptiva_arquitectura?: File[];
  memoria_descriptiva_seguridad?: File[];
  formulario_unico_edificacion?: File[];
  presupuesto?: File[];
  plano_seguridad?: File[];
  pago_derecho_revision_liquidacion?: File[];
}
