// Tipos para el módulo de Ampliaciones, Remodelaciones y Demoliciones
export interface AmpliacionFormData {
  // Paso 1: Información del Proyecto
  nombre_proyecto: string;
  selectedClient: any | null;

  // Paso 2: Licencias
  tipo_licencia_edificacion?: string;
  modalidad: 'A' | 'B' | 'C' | 'D';
  link_normativas?: string;
  archivo_normativo?: UploadedDocument[];

  // Paso 3: Antecedentes
  gestionado_por_fsr: boolean;
  proyecto_fsr_id?: string;
  certificado_parametros: UploadedDocument[];
  licencia_obra: UploadedDocument[];
  conformidad_obra: UploadedDocument[];
  declaratoria_fabrica: UploadedDocument[];
  planos_fabrica: UploadedDocument[];
  partida_registral: UploadedDocument[];

  // Paso 4: Documentación Técnica
  fue: UploadedDocument[];
  
  // Arquitectura
  arquitectura_intervencion: UploadedDocument[];
  arquitectura_resultante: UploadedDocument[];
  arquitectura_memoria: UploadedDocument[];
  
  // Estructuras
  estructuras_intervencion: UploadedDocument[];
  estructuras_resultante: UploadedDocument[];
  
  // Sanitarias
  sanitarias_intervencion: UploadedDocument[];
  sanitarias_resultante: UploadedDocument[];
  sanitarias_sedapal: UploadedDocument[];
  
  // Eléctricas
  electricas_resultante: UploadedDocument[];
  electricas_luz_del_sur: UploadedDocument[];
  
  // Mecánicas
  mecanicas_ficha_tecnica: UploadedDocument[];
  
  // Gas
  gas_resultante: UploadedDocument[];
  gas_calidda: UploadedDocument[];
  
  // Casos Especiales
  es_condominio: boolean;
  tiene_junta: 'si' | 'no';
  autorizacion_condominio: UploadedDocument[];
  observaciones_condominio: string;

  // Paso 5: Trámite Municipal
  fecha_ingreso_municipalidad: string;
  cargo_ingreso: UploadedDocument[];
  fecha_comision: string;
  dictamen_comision: 'conforme' | 'no-conforme';
  acta_comision: UploadedDocument[];
  
  // Seguimiento
  seguimiento: SeguimientoItem[];
}

export interface SeguimientoItem {
  id: string;
  fecha: string;
  metodo: 'llamada' | 'presencial' | 'web';
  comentario: string;
}

export interface UploadedDocument {
  key: string;
  name: string;
  file_id: string;
  url?: string;
  size?: number;
  type?: string;
}

export interface FormStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface Ampliacion {
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
    proyecto: string;
    licencias: string;
    antecedentes: string;
    documentacion: string;
    tramite_municipal: string;
  };
}

export enum AmpliacionStatus {
  TODOS = 'todos',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado'
}

export interface ProyectoFSR {
  id: string;
  name: string;
  licencia: string;
}
