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
  administrado: string;
  responsable: string;
  fecha_creacion: string;
  fecha_culminacion: string;
  status: string;
  created_at: string;
  scheduled_completion_date: string | null;
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
}

export interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
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
  onFileUpload: (file: File) => Promise<UploadedDocument>;
}

export interface StepAdministradoProps extends Omit<StepProps, 'conformidadId' | 'uploadedDocuments' | 'onFileUpload'> {
  clients: any[];
}
