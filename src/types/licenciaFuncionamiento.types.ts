export interface LicenciaFuncionamientoFormData {
  // Paso 1: Administrado
  selectedClient: any | null;

  // Paso 2: Consulta Inicial
  direccion_local: string;
  giro_negocio: string;
  zonificacion: string;
  compatibilidad_uso: string;
  compatibilidad_verificada: boolean;

  // Paso 3: Documentación del Cliente
  vigencia_poder: File[];
  hrpu: File[];
  declaratoria_fabrica: File[];
  certificado_pozo_tierra: File[];

  // Paso 4: Visitas de Verificación
  visitas: VisitaVerificacion[];

  // Paso 5: Clasificación del Riesgo
  nivel_riesgo: string;
  
  // Documentos para riesgo alto/muy alto
  planos_arquitectura: File[];
  planos_seguridad: File[];
  planos_electricos: File[];
  plan_seguridad: File[];

  // Paso 6: Ingreso de Expediente
  fecha_ingreso_expediente: string;
  numero_expediente_municipal: string;
  estado_tramite: string;

  // Paso 7: Inspección Municipal
  fecha_inspeccion: string;
  resultado_inspeccion: string;
  acta_inspeccion: File[];
  fecha_limite_subsanar: string;

  // Paso 8: Emisión y Entrega
  certificado_itse: File[];
  licencia_funcionamiento: File[];
  acta_entrega_firmada: File[];
  fecha_entrega_cliente: string;

  // Paso 9: Entrega al Administrado
  fecha_entrega_administrado: string;
  receptor_administrado: string;
  cargo_entrega_administrado: File[];
  observaciones_entrega: string;
}

export interface VisitaVerificacion {
  id: string;
  fecha: string;
  estado_local: string;
  observaciones: string;
}

export enum NivelRiesgoITSE {
  TODOS = 'Todos',
  BAJO = 'Bajo',
  MEDIO = 'Medio',
  ALTO = 'Alto',
  MUY_ALTO = 'Muy Alto'
}

export enum EstadoLocal {
  PENDIENTE = 'Pendiente',
  OBSERVADO = 'Observado',
  CONFORME = 'Conforme'
}

export enum EstadoTramite {
  EN_REVISION = 'En Revisión',
  OBSERVADO = 'Observado',
  APROBADO = 'Aprobado'
}

export enum ResultadoInspeccion {
  CONFORME = 'Conforme',
  OBSERVADO = 'Observado'
}

export enum LicenciaFuncionamientoStatus {
  TODOS = 'Todos',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado'
}

export interface LicenciaFuncionamiento {
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
    giro_negocio: string;
    direccion_local?: string;
  };
  steps_status: {
    administrado: string;
    consulta_inicial: string;
    documentacion_cliente: string;
    visitas_verificacion: string;
    clasificacion_riesgo: string;
    ingreso_expediente: string;
    inspeccion_municipal: string;
    emision_entrega: string;
  };
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
