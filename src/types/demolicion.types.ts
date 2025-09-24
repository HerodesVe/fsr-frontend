export interface DemolicionFormData {
  // Paso 1: Administrado
  selectedClient: any | null;

  // Paso 2: Documentación
  // 2.1: Documentación del Administrado
  partida_registral: File[];
  fue: File[];
  documentos_antecedentes: File[];
  es_zona_reglamentacion_especial: boolean;
  licencia_obra_nueva: File[];
  comentarios_adicionales: string;

  // 2.2: Documentación FSR
  memoria_descriptiva: File[];
  plano_ubicacion: File[];
  plano_arquitectura: File[];
  plano_cerco: File[];
  plano_sostenimiento: File[];

  // 2.3: Panel Fotográfico
  fotografias: File[];
  link_video: string;

  // Paso 3: Medidas Perimétricas
  // Según Partida Registral
  frente_partida: string;
  fondo_partida: string;
  derecha_partida: string;
  izquierda_partida: string;
  area_total_partida: string;

  // Medidas Reales (de Campo)
  frente_real: string;
  fondo_real: string;
  derecha_real: string;
  izquierda_real: string;
  area_total_real: string;

  // Observaciones
  observaciones_medidas: string;

  // Paso 4: Gestión Municipal
  cargo_ingreso_municipalidad: File[];
  fecha_ingreso_municipalidad: string;
  respuesta_resolucion_municipal: File[];
  fecha_respuesta_municipal: string;
  cargo_entrega_administrado: File[];
  fecha_entrega_administrado: string;
}

export interface CitaTecnico {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  enlace_reunion: string;
}

export interface ActasEspecialidad {
  arquitectura: {
    cargo_ingreso: File | null;
    fecha_subida: string;
    fecha_recepcion: string;
    fecha_emision: string;
    fecha_vencimiento: string;
    resultado: 'conforme' | 'conforme_observaciones';
    levantamiento_observaciones: File | null;
  };
  estructura: {
    acta_estructura: File | null;
  };
  electrica: {
    acta_electrica: File | null;
  };
  sanitaria: {
    acta_sanitaria: File | null;
  };
}

export interface Demolicion {
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
    nombre_proyecto?: string;
  };
  steps_status: Record<string, string>;
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

export type DemolicionStatus = 'TODOS' | 'PENDIENTE' | 'COMPLETADO';

export const DemolicionStatus = {
  TODOS: 'TODOS' as DemolicionStatus,
  PENDIENTE: 'PENDIENTE' as DemolicionStatus,
  COMPLETADO: 'COMPLETADO' as DemolicionStatus,
};
