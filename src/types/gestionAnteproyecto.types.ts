export interface GestionAnteproyectoFormData {
  // Paso 1: Selección/Carga del Anteproyecto
  selectedAnteproyecto?: any;
  anteproyecto_importado_id?: string;
  
  // Documentos del anteproyecto externo (si aplica)
  partida_registral?: File[];
  certificado_parametro_municipal?: File[];
  plano_ubicacion?: File[];
  plano_arquitectura?: File[];
  plano_seguridad?: File[];
  memoria_descriptiva_arquitectura?: File[];
  memoria_descriptiva_seguridad?: File[];
  formulario_unico_edificacion?: File[];
  presupuesto?: File[];
  pago_derecho_revision_cap?: File[];
  factura?: File[];
  liquidacion?: File[];
  
  // Paso 2: Presentación en Municipalidad
  fecha_ingreso?: string;
  numero_expediente?: string;
  archivo_cargo?: File[];
  
  // Paso 3: Seguimiento y Respuesta
  fecha_respuesta?: string;
  archivo_respuesta?: File[];
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  documentos_subsanacion?: File[];
  
  // Proceso de Reconsideración (opcional)
  fecha_presentacion_reconsideracion?: string;
  documento_reconsideracion?: File[];
  resolucion_reconsideracion?: File[];
  
  // Paso 4: Entrega Final
  carta_conformidad?: File[];
  acta_final?: File[];
  fue_aprobado?: File[];
  planos_aprobados?: File[];
  otros_documentos?: File[];
}

export interface GestionAnteproyecto {
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
  data: GestionAnteproyectoFormData;
  steps_status: StepStatus;
}

export interface StepStatus {
  seleccion_anteproyecto: 'Pendiente' | 'En progreso' | 'Completada';
  presentacion_municipal: 'Pendiente' | 'En progreso' | 'Completada';
  seguimiento_respuesta: 'Pendiente' | 'En progreso' | 'Completada';
  entrega_final: 'Pendiente' | 'En progreso' | 'Completada';
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

export enum GestionAnteproyectoStatus {
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
