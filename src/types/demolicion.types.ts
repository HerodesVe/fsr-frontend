export interface DemolicionFormData {
  // Paso 1: Administrado
  selectedClient: any | null;

  // Paso 2: Licencia
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;
  link_normativas: string;
  archivo_normativo: File | null;

  // Paso 3: Antecedentes
  planos_ubicacion: File[];
  planos_arquitectura: File[];
  planos_sostenimiento: File[];
  planos_cercos: File[];
  planos_excavaciones: File[];
  partida_registral: File[];
  fue: File[];
  otros_antecedentes: File[];
  mostrar_otros_antecedentes: boolean;

  // Paso 4: Área y Medidas Perimétricas
  area_total: string;
  por_el_frente: string;
  por_la_derecha: string;
  por_la_izquierda: string;
  por_el_fondo: string;
  medidas_perimetricas_administrado: string;
  medidas_perimetricas_reales_fsr: string;
  descripcion_proyecto: string;

  // Paso 5: Documentos FSR
  memoria_descriptiva: File[];
  plano_ubicacion: File[];
  plano_arquitectura_demoler: File[];
  plano_serramiento: File[];
  otros_planos: File[];
  mostrar_otros_planos: boolean;

  // Paso 6: Expediente y Notificaciones
  expediente_ingresado: boolean;
  numero_expediente: string;
  cargo_ingreso: File | null;
  
  // Notificación del Expediente
  consulta_ministerio: File | null;
  fecha_subida: string;
  fecha_recepcion: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  
  // Notificación del Expediente (segunda instancia)
  fecha_notificacion: string;
  hora_notificacion: string;
  motivo_notificacion: string;
  funcionario: string;
  documento_relacionado: File | null;
  
  // Levantamiento de Observaciones
  levantamiento_presentado: boolean;
  fecha_presentacion: string;
  documento_levantamiento: File | null;
  
  // Citas con Equipo Técnico
  citas_tecnico: CitaTecnico[];

  // Paso 7: Actas por Especialidad
  actas_especialidad: ActasEspecialidad;
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
