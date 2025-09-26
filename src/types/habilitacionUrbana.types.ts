export interface HabilitacionUrbanaFormData {
  // Paso 1: Administrado
  selectedClient: any | null;

  // Paso 2: Información Inicial y Clasificación
  tipo_habilitacion: string;
  uso_habilitacion: string;
  descripcion_proyecto: string;
  ficha_registros_publicos: File[];
  recibos_servicios?: File[];

  // Paso 3: Documentación Técnica FSR
  // Documentos Técnicos y Planos
  levantamiento_topografico: File[];
  estudio_mecanica_suelos: File[];
  planos_tecnicos_proyecto: File[];
  formulario_unico_fuhu: File[];
  
  // Certificados y Factibilidades
  certificado_zonificacion_vias: File[];
  factibilidad_servicios_electricos: File[];
  factibilidad_agua_desague: File[];
  
  // Estudios y Permisos Especiales
  sira_cultura: File[];
  estudio_impacto_ambiental: File[];
  estudio_impacto_vial: File[];
  permisos_ana_mtc: File[];

  // Paso 4: Base Legal y Normativa
  normas_aplicadas: NormaAplicada[];

  // Paso 5: Ingreso del Expediente
  fecha_ingreso: string;
  cargo_ingreso: File[];
  numero_expediente: string;

  // Paso 6: Proceso de Revisión y Observaciones
  acta_observaciones: File[];
  documentacion_rectificada: File[];

  // Paso 7: Aprobación y Entrega Final
  acta_dictamen_conforme: File[];
  resolucion_habilitacion_urbana: File[];
  proyecto_reconsideracion_apelacion: File[];
  cargo_entrega_cliente: File[];
}

export interface NormaAplicada {
  id: string;
  descripcion: string;
  archivo_norma: File[];
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

export enum HabilitacionUrbanaStatus {
  TODOS = 'Todos',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
}

export interface HabilitacionUrbana {
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
    tipo_habilitacion?: string;
    uso_habilitacion?: string;
  };
  steps_status: {
    administrado: string;
    informacion_inicial: string;
    documentacion_tecnica: string;
    base_legal: string;
    ingreso_expediente: string;
    revision_observaciones: string;
    aprobacion_final: string;
  };
}

export type StepStatus = {
  administrado: 'Pendiente' | 'En progreso' | 'Completada';
  informacion_inicial: 'Pendiente' | 'En progreso' | 'Completada';
  documentacion_tecnica: 'Pendiente' | 'En progreso' | 'Completada';
  base_legal: 'Pendiente' | 'En progreso' | 'Completada';
  ingreso_expediente: 'Pendiente' | 'En progreso' | 'Completada';
  revision_observaciones: 'Pendiente' | 'En progreso' | 'Completada';
  aprobacion_final: 'Pendiente' | 'En progreso' | 'Completada';
};

export interface TabConfig {
  id: 'elaboracion' | 'gestion';
  label: string;
  steps: FormStep[];
}
