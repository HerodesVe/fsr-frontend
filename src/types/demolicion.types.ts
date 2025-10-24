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
export interface CreateDemolicionRequest {
  client_id: string;
  data: {
    service_type: 'demolicion_total';
    nombre_proyecto: string;
    documentacion_administrado: {
      partida_registral: DocumentInfo;
      fue: DocumentInfo;
      documentos_antecedentes: DocumentInfo;
      es_zona_reglamentacion_especial: boolean;
      licencia_obra_nueva: DocumentInfo;
      comentarios_adicionales: string;
    };
    documentacion_fsr: {
      memoria_descriptiva: DocumentInfo;
      plano_ubicacion: DocumentInfo;
      plano_arquitectura: DocumentInfo;
      plano_cerco: DocumentInfo;
      plano_sostenimiento: DocumentInfo;
    };
    panel_fotografico: {
      fotografias: DocumentInfo;
      link_video: string;
    };
    medidas_perimetricas: {
      frente_partida: number;
      fondo_partida: number;
      derecha_partida: number;
      izquierda_partida: number;
      area_total_partida: number;
      frente_real: number;
      fondo_real: number;
      derecha_real: number;
      izquierda_real: number;
      area_total_real: number;
      observaciones_medidas: string;
    };
    gestion_municipal: {
      cargo_ingreso_municipalidad: DocumentInfo;
      fecha_ingreso_municipalidad: string;
      respuesta_resolucion_municipal: DocumentInfo;
      fecha_respuesta_municipal: string;
      cargo_entrega_administrado: DocumentInfo;
      fecha_entrega_administrado: string;
    };
    entrega_final: {
      fecha_entrega_final_administrado: string;
      receptor_administrado: string;
      cargo_entrega_final_administrado: DocumentInfo;
      observaciones_entrega: string;
    };
  };
}

export interface UpdateDemolicionRequest extends Partial<CreateDemolicionRequest> {}

// Interfaz para el formulario local
export interface DemolicionFormData {
  // Paso 1: Administrado
  selectedClient: any | null;
  nombre_proyecto: string;

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

  // Paso 5: Entrega al Administrado
  fecha_entrega_final_administrado: string;
  receptor_administrado: string;
  cargo_entrega_final_administrado: File[];
  observaciones_entrega: string;
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
  client_id: string; // ✅ ID del cliente/administrado
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
    documentacion_administrado?: any;
    documentacion_fsr?: any;
    panel_fotografico?: any;
    medidas_perimetricas?: any;
    gestion_municipal?: any;
    entrega_final?: any;
    [key: string]: any;
  };
  steps_status: Record<string, string>;
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
  key?: string; // Document key para identificar el tipo de documento
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
