// Tipos para el módulo de Conformidad de Obra

// Interfaces para documentos
export interface DocumentInfo {
  name: string;
  is_mandatory: boolean;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  file_reference: string;
  emission_date?: string;
  observation?: string;
}

// ============================================
// TIPOS PARA GESTIÓN CONFORMIDAD CON VARIACIÓN
// ============================================

// Documento de expediente/licencia
export interface ExpedienteDocumento {
  id: string;
  tipo: 'licencia_edificacion' | 'fue' | 'arquitectura_aprobada' | 'planos_arquitectura' | 
        'planos_seguridad' | 'memoria_arquitectura' | 'memoria_seguridad' | 
        'especialidades_aprobadas' | 'otros';
  nombre: string;
  archivo?: File[];
  file_reference?: string;
  is_mandatory: boolean;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  observation?: string;
}

// Expediente/Licencia (para el CRUD de Antecedentes)
export interface ExpedienteLicencia {
  id: string;
  numero_licencia: number; // 1, 2, 3...
  nombre: string; // "Licencia 1", "Licencia 2"...
  fecha_creacion: string;
  documentos: {
    licencia_edificacion_primigenia: File[];
    fue: File[];
    arquitectura_aprobada: File[];
    planos_arquitectura: File[];
    planos_seguridad: File[];
    memoria_arquitectura: File[];
    memoria_seguridad: File[];
    especialidades_aprobadas: File[];
    otros_documentos: File[];
  };
  observaciones?: string;
}

// Checklist Casco Habitable
export interface ChecklistCascoHabitable {
  // Bienes y servicios comunes
  estructuras_terminadas: boolean;
  fachadas_terminadas: boolean;
  instalaciones_operativas: boolean;
  ascensores_operativos: boolean;
  areas_comunes_terminadas: boolean;
  estacionamientos_habilitados: boolean;
  
  // Áreas de propiedad exclusiva
  muros_revocados: boolean;
  falsos_pisos_terminados: boolean;
  vidrios_instalados: boolean;
  bano_terminado: boolean;
  instalaciones_electricas_operativas: boolean;
  instalaciones_sanitarias_operativas: boolean;
}

// Datos del Predio para Conformidad de Obra
export interface PredioConformidadObra {
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
  latitud: number;
  longitud: number;
  
  // Área y medidas
  area_total_m2: number;
  frente: number;
  derecha: number;
  izquierda: number;
  fondo: number;
  
  // Características de edificación
  tipo_edificacion: string;
  numero_pisos: number;
  numero_sotanos: number;
  numero_semisotanos: number;
  tiene_azotea: boolean;
  area_techada_total_m2: number;
  area_libre_m2: number;
  descripcion_proyecto: string;
}

// Datos de Licencia de Edificación y Uso
export interface LicenciaEdificacionUso {
  resolucion_licencia: string;
  modalidad_aprobacion: string;
  tipo_licencia: string;
  uso_aprobado: string;
  zonificacion: string;
  altura: string;
  uso_edificacion: 'vivienda_unifamiliar' | 'vivienda_multifamiliar' | 'comercio' | 
                   'oficina' | 'industrial' | 'educacion' | 'salud' | 'otros' | '';
  solicita_casco_habitable: boolean;
}

// Documentos de Presentación de Copias
export interface PresentacionCopias {
  cargo_presentacion: File[];
  fecha_recoleccion: string;
  fue_conformidad_declaratoria: File[];
  plano_ubicacion: File[];
  resolucion_conformidad: File[];
  otros_documentos: File[];
}

// Tipos de uso de edificación
export const USOS_EDIFICACION = [
  { value: 'vivienda_unifamiliar', label: 'Vivienda Unifamiliar' },
  { value: 'vivienda_multifamiliar', label: 'Vivienda Multifamiliar' },
  { value: 'comercio', label: 'Comercio' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'otros', label: 'Otros' },
] as const;

// Revisión de seguimiento (similar a GestionAnteproyecto)
export interface RevisionConformidad {
  id: string;
  numero_revision: number;
  fecha_creacion: string;
  fecha_respuesta?: string;
  resultado_acta: 'conforme' | 'no_conforme' | null;
  archivo_acta?: File[];
  notificacion?: {
    tiene_notificacion: boolean;
    fecha_notificacion?: string;
    archivo_notificacion?: File[];
    subsanacion_completada?: boolean;
  };
  subsanacion_completada: boolean;
  documentos_subsanacion?: File[];
  reconsideracion?: {
    habilitado: boolean;
    fecha_presentacion?: string;
    resultado: 'fundado' | 'fundado_en_parte' | 'infundado' | null;
    archivo?: File[];
  };
  apelacion?: {
    habilitado: boolean;
    fecha_presentacion?: string;
    resultado: 'fundado' | 'fundado_en_parte' | 'infundado' | null;
    archivo?: File[];
  };
  estado: 'en_progreso' | 'completada';
}

// Interfaces para el backend
export interface CreateConformidadRequest {
  client_id: string;
  data: {
    service_type: 'conformidad_obra';
    nombre_proyecto: string;
    modalidad: 'sin_variaciones' | 'con_variaciones' | 'casco_habitable';
    documentos_iniciales_sv?: {
      licencia_obra_sv: DocumentInfo;
      planos_aprobados_sv: DocumentInfo;
    };
    verificacion_sv?: {
      verificacion_campo_sv: boolean;
      fecha_verificacion_sv: string;
    };
    informacion_inicial_cv?: {
      servicios_previos_fsr: boolean;
    };
    documentos_iniciales_cv?: {
      licencia_obra_cv: DocumentInfo;
      planos_aprobados_licencia_cv: DocumentInfo;
      planos_digitales_cad_cv: DocumentInfo;
    };
    antecedentes_cv?: {
      primer_expediente: boolean;
      descripcion_antecedentes: string;
      expedientes_anteriores: DocumentInfo;
    };
    documentos_expediente?: {
      fue_conformidad: DocumentInfo;
      planos_conformidad: DocumentInfo;
      memoria_descriptiva: DocumentInfo;
      cuaderno_obra: DocumentInfo;
      protocolos: DocumentInfo;
      declaraciones_juradas: DocumentInfo;
      sustentos_tecnicos: DocumentInfo;
    };
    entrega_final: {
      fecha_entrega_administrado: string;
      receptor_administrado: string;
      cargo_entrega_administrado: DocumentInfo;
      observaciones_entrega: string;
    };
  };
}

export interface UpdateConformidadRequest extends Partial<CreateConformidadRequest> {}

// Interfaz para el formulario local
export interface ConformidadFormData {
  // Información General
  selectedClient: any | null;
  nombre_proyecto: string;
  modalidad: 'sin_variaciones' | 'con_variaciones' | 'casco_habitable' | '';

  // Sin Variaciones - Documentos del Cliente
  licencia_obra_sv: File[];
  planos_aprobados_sv: File[];
  
  // Sin Variaciones - Verificación Preliminar
  verificacion_campo_sv: boolean;
  fecha_verificacion_sv: string;

  // Con Variaciones - Información Inicial
  servicios_previos_fsr: boolean;
  
  // Con Variaciones - Documentos Iniciales del Cliente
  licencia_obra_cv: File[];
  planos_aprobados_licencia_cv: File[];
  planos_digitales_cad_cv: File[];

  // Con Variaciones - Análisis de Antecedentes
  primer_expediente: boolean;
  descripcion_antecedentes: string;
  expedientes_anteriores: File[];

  // Con Variaciones - Documentos del Expediente (Elaboración FSR)
  fue_conformidad: File[];
  planos_conformidad: File[];
  memoria_descriptiva: File[];
  cuaderno_obra: File[];
  protocolos: File[];
  declaraciones_juradas: File[];
  sustentos_tecnicos: File[];

  // Casco Habitable (reutiliza campos de Con Variaciones)
  // Se pueden agregar campos específicos si es necesario

  // Paso 7: Entrega al Administrado
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: File[];
  observaciones_entrega: string;
}

export interface Conformidad {
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
    modalidad?: 'sin_variaciones' | 'con_variaciones' | 'casco_habitable';
    documentos_iniciales_sv?: any;
    verificacion_sv?: any;
    informacion_inicial_cv?: any;
    documentos_iniciales_cv?: any;
    antecedentes_cv?: any;
    documentos_expediente?: any;
    entrega_final?: any;
    [key: string]: any;
  };
  steps_status: {
    administrado: StepStatus;
    modalidad: StepStatus;
    documentos_iniciales: StepStatus;
    antecedentes: StepStatus;
    documentos_expediente: StepStatus;
    verificacion: StepStatus;
  };
  uploaded_documents?: Array<{
    key: string;
    name: string;
    file_id: string;
  }>;
}

export interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  key?: string;
}

export interface FormStep {
  id: number;
  title: string;
  completed: boolean;
}

export type StepStatus = 'Pendiente' | 'En progreso' | 'Completada';

export enum ConformidadStatus {
  TODOS = 'todos',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado'
}

// Props para los componentes de steps
export interface StepProps {
  formData: ConformidadFormData;
  errors?: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export interface StepAdministradoProps extends Omit<StepProps, 'conformidadId' | 'uploadedDocuments' | 'onFileUpload'> {
  clients: any[];
}

// ============================================
// FORM DATA PARA GESTIÓN CONFORMIDAD CON VARIACIÓN
// ============================================

export interface ConformidadConVariacionFormData {
  // Step 1: Administrado
  selectedClient: any | null;
  nombre_proyecto: string;

  // Step 2: Documentos Iniciales
  documentos_iniciales: File[];
  
  // Step 3: Antecedentes (CRUD de Licencias)
  expedientes_licencias: ExpedienteLicencia[];
  
  // Step 4: Licencia de Edificación y Uso
  licencia_edificacion: LicenciaEdificacionUso;
  
  // Step 5: Checklist Casco Habitable (condicional)
  checklist_casco_habitable: ChecklistCascoHabitable;
  
  // Step 6: Datos del Predio
  predio: PredioConformidadObra;
  
  // Step 7: Inspección Ocular (Verificación)
  verificacion_campo: boolean;
  fecha_verificacion: string;
  observaciones_verificacion: string;
  
  // Step 8: Presentación ante Municipalidad
  fecha_ingreso: string;
  numero_expediente: string;
  archivo_cargo: File[];
  
  // Step 9: Seguimiento
  revisiones: RevisionConformidad[];
  revision_actual_index: number;
  estado_seguimiento: 'en_proceso' | 'conforme' | 'improcedente';
  
  // Step 10: Presentación de Copias
  presentacion_copias: PresentacionCopias;
  
  // Step 11: Entrega al Administrado
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: File[];
  observaciones_entrega: string;
}

// Request para crear Conformidad Con Variación
export interface CreateConformidadConVariacionRequest {
  client_id: string;
  data: {
    service_type: 'conformidad_obra_con_variacion';
    nombre_proyecto: string;
    documentos_iniciales?: DocumentInfo[];
    expedientes_licencias?: any[];
    licencia_edificacion?: LicenciaEdificacionUso;
    checklist_casco_habitable?: ChecklistCascoHabitable;
    predio?: PredioConformidadObra;
    verificacion?: {
      verificacion_campo: boolean;
      fecha_verificacion?: string;
      observaciones_verificacion?: string;
    };
    presentacion_municipal?: {
      fecha_ingreso?: string;
      numero_expediente?: string;
      archivo_cargo?: DocumentInfo;
    };
    seguimiento?: {
      revisiones?: any[];
      estado_seguimiento?: string;
    };
    presentacion_copias?: {
      cargo_presentacion?: DocumentInfo;
      fecha_recoleccion?: string;
      documentos_aprobados?: DocumentInfo[];
    };
    entrega_final?: {
      fecha_entrega_administrado?: string;
      receptor_administrado?: string;
      cargo_entrega_administrado?: DocumentInfo;
      observaciones_entrega?: string;
    };
  };
}

// Props para Steps de Conformidad Con Variación
export interface StepConformidadConVariacionProps {
  formData: ConformidadConVariacionFormData;
  errors?: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Helper para crear expediente vacío
export const createEmptyExpedienteLicencia = (numeroLicencia: number): ExpedienteLicencia => ({
  id: `licencia_${Date.now()}_${numeroLicencia}`,
  numero_licencia: numeroLicencia,
  nombre: `Licencia ${numeroLicencia}`,
  fecha_creacion: new Date().toISOString().split('T')[0],
  documentos: {
    licencia_edificacion_primigenia: [],
    fue: [],
    arquitectura_aprobada: [],
    planos_arquitectura: [],
    planos_seguridad: [],
    memoria_arquitectura: [],
    memoria_seguridad: [],
    especialidades_aprobadas: [],
    otros_documentos: [],
  },
  observaciones: '',
});

// Helper para crear checklist vacío
export const createEmptyChecklistCascoHabitable = (): ChecklistCascoHabitable => ({
  estructuras_terminadas: false,
  fachadas_terminadas: false,
  instalaciones_operativas: false,
  ascensores_operativos: false,
  areas_comunes_terminadas: false,
  estacionamientos_habilitados: false,
  muros_revocados: false,
  falsos_pisos_terminados: false,
  vidrios_instalados: false,
  bano_terminado: false,
  instalaciones_electricas_operativas: false,
  instalaciones_sanitarias_operativas: false,
});

// Helper para crear predio vacío
export const createEmptyPredioConformidad = (): PredioConformidadObra => ({
  departmentId: '',
  provinceId: '',
  districtId: '',
  urbanization: '',
  mz: '',
  lote: '',
  subLote: '',
  street: '',
  number: '',
  interior: '',
  latitud: 0,
  longitud: 0,
  area_total_m2: 0,
  frente: 0,
  derecha: 0,
  izquierda: 0,
  fondo: 0,
  tipo_edificacion: '',
  numero_pisos: 0,
  numero_sotanos: 0,
  numero_semisotanos: 0,
  tiene_azotea: false,
  area_techada_total_m2: 0,
  area_libre_m2: 0,
  descripcion_proyecto: '',
});

// Helper para crear licencia edificación vacía
export const createEmptyLicenciaEdificacion = (): LicenciaEdificacionUso => ({
  resolucion_licencia: '',
  modalidad_aprobacion: '',
  tipo_licencia: '',
  uso_aprobado: '',
  zonificacion: '',
  altura: '',
  uso_edificacion: '',
  solicita_casco_habitable: false,
});

// Helper para crear presentación copias vacía
export const createEmptyPresentacionCopias = (): PresentacionCopias => ({
  cargo_presentacion: [],
  fecha_recoleccion: '',
  fue_conformidad_declaratoria: [],
  plano_ubicacion: [],
  resolucion_conformidad: [],
  otros_documentos: [],
});

// Helper para crear revisión vacía
export const createEmptyRevisionConformidad = (numeroRevision: number): RevisionConformidad => ({
  id: `revision_${Date.now()}_${numeroRevision}`,
  numero_revision: numeroRevision,
  fecha_creacion: new Date().toISOString().split('T')[0],
  resultado_acta: null,
  notificacion: {
    tiene_notificacion: false,
  },
  subsanacion_completada: false,
  reconsideracion: {
    habilitado: false,
    resultado: null,
  },
  apelacion: {
    habilitado: false,
    resultado: null,
  },
  estado: 'en_progreso',
});

// Initial form data para Conformidad Con Variación
export const initialConformidadConVariacionFormData: ConformidadConVariacionFormData = {
  selectedClient: null,
  nombre_proyecto: '',
  documentos_iniciales: [],
  expedientes_licencias: [createEmptyExpedienteLicencia(1)],
  licencia_edificacion: createEmptyLicenciaEdificacion(),
  checklist_casco_habitable: createEmptyChecklistCascoHabitable(),
  predio: createEmptyPredioConformidad(),
  verificacion_campo: false,
  fecha_verificacion: '',
  observaciones_verificacion: '',
  fecha_ingreso: '',
  numero_expediente: '',
  archivo_cargo: [],
  revisiones: [createEmptyRevisionConformidad(1)],
  revision_actual_index: 0,
  estado_seguimiento: 'en_proceso',
  presentacion_copias: createEmptyPresentacionCopias(),
  fecha_entrega_administrado: '',
  receptor_administrado: '',
  cargo_entrega_administrado: [],
  observaciones_entrega: '',
};

// ============================================
// TIPOS PARA ELABORACIÓN DE CONFORMIDAD
// ============================================

// Expediente/Licencia para Elaboración (documentos diferentes)
export interface ExpedienteLicenciaElaboracion {
  id: string;
  numero_licencia: number;
  nombre: string;
  fecha_creacion: string;
  documentos: {
    licencia_modificacion_proyecto: File[];
    fue: File[];
    arquitectura_aprobada: File[];
    planos_arquitectura: File[];
    planos_seguridad: File[];
    memoria_arquitectura: File[];
    memoria_seguridad: File[];
    especialidades_aprobadas: File[];
    otros_documentos: File[];
  };
  observaciones?: string;
}

// Documentos del Administrado - Sin Variación
export interface DocumentosAdministradoSinVariacion {
  derecho_edificar: File[];
  planos_aprobados_licencia: File[];
  fecha_culminacion_obra: File[];
  anexo_h_visado: File[];
  vigencia_poder: File[];
  protocolos_equipos: File[];
  otros_documentos: File[];
}

// Documentos del Administrado - Con Variación
export interface DocumentosAdministradoConVariacion {
  derecho_edificar: File[];
  anexo_h_visado: File[];
  fecha_culminacion_obra: File[];
  vigencia_poder: File[];
  cuaderno_obra_variaciones: File[];
  protocolos_equipos: File[];
  otros_documentos: File[];
}

// Documentos FSR - Sin Variación
export interface DocumentosFSRSinVariacion {
  fue_conformidad_declaratoria: File[];
  presupuesto_obra: File[];
  fecha_ejecucion_obra: File[];
  otros_documentos: File[];
}

// Documentos FSR - Con Variación
export interface DocumentosFSRConVariacion {
  fecha_ejecucion_obra: File[];
  fue_conformidad_declaratoria: File[];
  presupuesto_obra: File[];
  planos_replanteo_ubicacion: File[];
  planos_replanteo_arquitectura: File[];
  planos_replanteo_seguridad: File[];
  protocolos_equipos: File[];
  otros_documentos: File[];
}

// Form Data para Elaboración Con Variación
export interface ElaboracionConVariacionFormData {
  // Step 1: Administrado
  selectedClient: any | null;
  nombre_proyecto: string;

  // Step 2: Datos del Predio
  predio: PredioConformidadObra;

  // Step 3: Antecedentes (CRUD de Licencias)
  expedientes_licencias: ExpedienteLicenciaElaboracion[];

  // Step 4: Licencia de Edificación y Uso
  licencia_edificacion: LicenciaEdificacionUso;

  // Step 5: Checklist Casco Habitable (condicional)
  checklist_casco_habitable: ChecklistCascoHabitable;

  // Step 6: Inspección Ocular
  verificacion_campo: boolean;
  fecha_verificacion: string;
  observaciones_verificacion: string;

  // Step 7: Documentación del Administrado
  documentos_administrado: DocumentosAdministradoConVariacion;

  // Step 8: Documentación FSR
  documentos_fsr: DocumentosFSRConVariacion;

  // Entrega al Administrado
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: File[];
  observaciones_entrega: string;
}

// Form Data para Elaboración Sin Variación
export interface ElaboracionSinVariacionFormData {
  // Step 1: Administrado
  selectedClient: any | null;
  nombre_proyecto: string;

  // Step 2: Datos del Predio
  predio: PredioConformidadObra;

  // Step 3: Antecedentes (CRUD de Licencias)
  expedientes_licencias: ExpedienteLicenciaElaboracion[];

  // Step 4: Licencia de Edificación y Uso
  licencia_edificacion: LicenciaEdificacionUso;

  // Step 5: Checklist Casco Habitable (condicional)
  checklist_casco_habitable: ChecklistCascoHabitable;

  // Step 6: Inspección Ocular
  verificacion_campo: boolean;
  fecha_verificacion: string;
  observaciones_verificacion: string;

  // Step 7: Documentación del Administrado
  documentos_administrado: DocumentosAdministradoSinVariacion;

  // Step 8: Documentación FSR
  documentos_fsr: DocumentosFSRSinVariacion;

  // Entrega al Administrado
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: File[];
  observaciones_entrega: string;
}

// Helper para crear expediente de elaboración vacío
export const createEmptyExpedienteLicenciaElaboracion = (numeroLicencia: number): ExpedienteLicenciaElaboracion => ({
  id: `licencia_elab_${Date.now()}_${numeroLicencia}`,
  numero_licencia: numeroLicencia,
  nombre: `Licencia ${numeroLicencia}`,
  fecha_creacion: new Date().toISOString().split('T')[0],
  documentos: {
    licencia_modificacion_proyecto: [],
    fue: [],
    arquitectura_aprobada: [],
    planos_arquitectura: [],
    planos_seguridad: [],
    memoria_arquitectura: [],
    memoria_seguridad: [],
    especialidades_aprobadas: [],
    otros_documentos: [],
  },
  observaciones: '',
});

// Helper para crear documentos administrado sin variación vacíos
export const createEmptyDocumentosAdministradoSinVariacion = (): DocumentosAdministradoSinVariacion => ({
  derecho_edificar: [],
  planos_aprobados_licencia: [],
  fecha_culminacion_obra: [],
  anexo_h_visado: [],
  vigencia_poder: [],
  protocolos_equipos: [],
  otros_documentos: [],
});

// Helper para crear documentos administrado con variación vacíos
export const createEmptyDocumentosAdministradoConVariacion = (): DocumentosAdministradoConVariacion => ({
  derecho_edificar: [],
  anexo_h_visado: [],
  fecha_culminacion_obra: [],
  vigencia_poder: [],
  cuaderno_obra_variaciones: [],
  protocolos_equipos: [],
  otros_documentos: [],
});

// Helper para crear documentos FSR sin variación vacíos
export const createEmptyDocumentosFSRSinVariacion = (): DocumentosFSRSinVariacion => ({
  fue_conformidad_declaratoria: [],
  presupuesto_obra: [],
  fecha_ejecucion_obra: [],
  otros_documentos: [],
});

// Helper para crear documentos FSR con variación vacíos
export const createEmptyDocumentosFSRConVariacion = (): DocumentosFSRConVariacion => ({
  fecha_ejecucion_obra: [],
  fue_conformidad_declaratoria: [],
  presupuesto_obra: [],
  planos_replanteo_ubicacion: [],
  planos_replanteo_arquitectura: [],
  planos_replanteo_seguridad: [],
  protocolos_equipos: [],
  otros_documentos: [],
});

// Initial form data para Elaboración Con Variación
export const initialElaboracionConVariacionFormData: ElaboracionConVariacionFormData = {
  selectedClient: null,
  nombre_proyecto: '',
  predio: createEmptyPredioConformidad(),
  expedientes_licencias: [],
  licencia_edificacion: createEmptyLicenciaEdificacion(),
  checklist_casco_habitable: createEmptyChecklistCascoHabitable(),
  verificacion_campo: false,
  fecha_verificacion: '',
  observaciones_verificacion: '',
  documentos_administrado: createEmptyDocumentosAdministradoConVariacion(),
  documentos_fsr: createEmptyDocumentosFSRConVariacion(),
  fecha_entrega_administrado: '',
  receptor_administrado: '',
  cargo_entrega_administrado: [],
  observaciones_entrega: '',
};

// Initial form data para Elaboración Sin Variación
export const initialElaboracionSinVariacionFormData: ElaboracionSinVariacionFormData = {
  selectedClient: null,
  nombre_proyecto: '',
  predio: createEmptyPredioConformidad(),
  expedientes_licencias: [],
  licencia_edificacion: createEmptyLicenciaEdificacion(),
  checklist_casco_habitable: createEmptyChecklistCascoHabitable(),
  verificacion_campo: false,
  fecha_verificacion: '',
  observaciones_verificacion: '',
  documentos_administrado: createEmptyDocumentosAdministradoSinVariacion(),
  documentos_fsr: createEmptyDocumentosFSRSinVariacion(),
  fecha_entrega_administrado: '',
  receptor_administrado: '',
  cargo_entrega_administrado: [],
  observaciones_entrega: '',
};
