// Tipos para el módulo de Conformidad de Obra

export interface ConformidadFormData {
  // Información General
  selectedClient: any | null;
  modalidad: 'sin_variaciones' | 'con_variaciones' | 'casco_habitable' | '';

  // Sin Variaciones - Documentos del Cliente
  licencia_obra_sv: UploadedDocument[];
  planos_aprobados_sv: UploadedDocument[];
  
  // Sin Variaciones - Verificación Preliminar
  verificacion_campo_sv: boolean;
  fecha_verificacion_sv: string;

  // Con Variaciones - Información Inicial
  servicios_previos_fsr: boolean;
  
  // Con Variaciones - Documentos Iniciales del Cliente
  licencia_obra_cv: UploadedDocument[];
  planos_aprobados_licencia_cv: UploadedDocument[];
  planos_digitales_cad_cv: UploadedDocument[];

  // Con Variaciones - Análisis de Antecedentes
  primer_expediente: boolean;
  descripcion_antecedentes: string;
  expedientes_anteriores: UploadedDocument[];

  // Con Variaciones - Documentos del Expediente (Elaboración FSR)
  fue_conformidad: UploadedDocument[];
  planos_conformidad: UploadedDocument[];
  memoria_descriptiva: UploadedDocument[];
  cuaderno_obra: UploadedDocument[];
  protocolos: UploadedDocument[];
  declaraciones_juradas: UploadedDocument[];
  sustentos_tecnicos: UploadedDocument[];

  // Casco Habitable (reutiliza campos de Con Variaciones)
  // Se pueden agregar campos específicos si es necesario

  // Paso 7: Entrega al Administrado
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: UploadedDocument[];
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
  data: {
    nombre_proyecto: string;
    modalidad: 'sin_variaciones' | 'con_variaciones' | 'casco_habitable';
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
