// Tipos para el resultado de recursos (Reconsideración/Apelación)
export type ResultadoRecurso = 'fundado' | 'infundado' | 'fundado_en_parte' | null;

// Estructura de un Proceso de Recurso (Reconsideración o Apelación)
export interface ProcesoRecursoData {
  habilitado: boolean;
  fecha_presentacion?: string;
  documento_recurso?: File[];
  resolucion_recurso?: File[];
  resultado?: ResultadoRecurso;
  observaciones?: string;
}

// Estructura de Notificación/Carta previa al Acta
export interface NotificacionData {
  tiene_notificacion: boolean;
  fecha_notificacion?: string;
  archivo_notificacion?: File[];
  documentos_subsanacion_notificacion?: File[];
  subsanacion_completada?: boolean;
}

// Estructura de una Revisión individual
export interface RevisionData {
  id: string;
  numero_revision: number; // 1, 2, 3 o 4
  fecha_creacion: string;
  
  // Notificación previa (Flujo A)
  notificacion?: NotificacionData;
  
  // Datos del Acta (Flujo B)
  fecha_respuesta?: string;
  archivo_acta?: File[];
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  
  // Subsanación de observaciones (requerida si No Conforme)
  documentos_subsanacion?: File[];
  subsanacion_completada?: boolean;
  
  // Proceso de Reconsideración (Flujo C)
  reconsideracion?: ProcesoRecursoData;
  
  // Proceso de Apelación (Flujo D)
  apelacion?: ProcesoRecursoData;
  
  // Estado de la revisión
  estado: 'en_progreso' | 'completada' | 'improcedente';
}

export interface GestionAnteproyectoFormData {
  // Administrado y Proyecto
  client_id?: string;
  nombre_proyecto?: string;
  
  // Paso 1: Selección/Carga del Anteproyecto
  selectedAnteproyecto?: any;
  anteproyecto_importado_id?: string;
  
  // ============================================
  // DATOS DEL ANTEPROYECTO EXTERNO
  // ============================================
  
  // Tipo de Obra y Modalidad
  tipo_licencia_edificacion?: string;
  tipo_modalidad?: string;
  link_normativas?: string;
  
  // Datos del Predio - Ubicación
  departmentId?: string;
  provinceId?: string;
  districtId?: string;
  urbanization?: string;
  mz?: string;
  lote?: string;
  subLote?: string;
  street?: string;
  number?: string;
  interior?: string;
  latitud?: number;
  longitud?: number;
  
  // Datos del Predio - Medidas
  area_total_m2?: number;
  frente?: number;
  derecha?: number;
  izquierda?: number;
  fondo?: number;
  
  // Datos del Predio - Edificación
  tipo_edificacion?: string;
  numero_pisos?: number;
  area_techada_total_m2?: number;
  area_libre_m2?: number;
  area_libre_porcentaje?: number;
  descripcion_proyecto?: string;
  
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
  
  // Paso 3: Seguimiento y Respuesta - NUEVO: Array de Revisiones
  revisiones?: RevisionData[];
  revision_actual_index?: number; // Índice de la revisión activa
  estado_seguimiento?: 'en_proceso' | 'conforme' | 'improcedente';
  
  // Campos legacy para compatibilidad (se migrarán a revisiones)
  fecha_respuesta?: string;
  archivo_respuesta?: File[];
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  documentos_subsanacion?: File[];
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

// Estructura de Recurso para el backend
export interface RecursoBackendData {
  habilitado: boolean;
  fecha_presentacion?: string;
  resultado?: ResultadoRecurso;
  observaciones?: string;
  documento_recurso?: DocumentInfo;
  resolucion_recurso?: DocumentInfo;
}

// Estructura de Notificación para el backend
export interface NotificacionBackendData {
  tiene_notificacion: boolean;
  fecha_notificacion?: string;
  subsanacion_completada?: boolean;
  archivo_notificacion?: DocumentInfo;
  documentos_subsanacion_notificacion?: DocumentInfo;
}

// Estructura de Revisión para el backend
export interface RevisionBackendData {
  id: string;
  numero_revision: number;
  fecha_creacion: string;
  fecha_respuesta?: string;
  resultado_acta?: 'conforme' | 'no_conforme' | null;
  subsanacion_completada?: boolean;
  estado: 'en_progreso' | 'completada' | 'improcedente';
  notificacion?: NotificacionBackendData;
  archivo_acta?: DocumentInfo;
  documentos_subsanacion?: DocumentInfo;
  reconsideracion?: RecursoBackendData;
  apelacion?: RecursoBackendData;
}

// Estructura de datos del backend
export interface GestionAnteproyectoData {
  service_type: string;
  nombre_proyecto?: string;
  seleccion_anteproyecto?: {
    selected_anteproyecto?: any;
  };
  presentacion_municipal?: {
    fecha_ingreso?: string;
    numero_expediente?: string;
    archivo_cargo?: DocumentInfo;
  };
  seguimiento_respuesta?: {
    // Nueva estructura con revisiones
    revisiones?: RevisionBackendData[];
    revision_actual_index?: number;
    estado_seguimiento?: 'en_proceso' | 'conforme' | 'improcedente';
    
    // Campos legacy para compatibilidad
    fecha_respuesta?: string;
    resultado_acta?: 'conforme' | 'no_conforme' | null;
    fecha_presentacion_reconsideracion?: string;
    archivo_respuesta?: DocumentInfo;
    documentos_subsanacion?: DocumentInfo;
    documento_reconsideracion?: DocumentInfo;
    resolucion_reconsideracion?: DocumentInfo;
  };
  entrega_final?: {
    carta_conformidad?: DocumentInfo;
    acta_final?: DocumentInfo;
    fue_aprobado?: DocumentInfo;
    planos_aprobados?: DocumentInfo;
    otros_documentos?: DocumentInfo;
  };
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
  data: GestionAnteproyectoData;
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
  key?: string;
  file_id?: string;
}

// Estructura de información de documentos
export interface DocumentInfo {
  name: string;
  is_mandatory: boolean;
  status: 'Pendiente' | 'Subido' | 'Rechazado';
  file_reference: string;
  emission_date?: string;
  observation: string;
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














