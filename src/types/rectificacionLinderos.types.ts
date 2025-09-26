// Types for Rectificación de Linderos
export interface RectificacionLinderosFormData {
  // Paso 1: Administrado
  selectedClient: any | null;

  // Paso 2: Selección del Anteproyecto (Elaboración)
  anteproyecto_id: string;

  // Paso 3: Documentos Legales y Técnicos (Elaboración)
  titulo_propiedad: File[];
  planos_anteriores: File[];
  memoria_original: File[];
  documento_identidad: File[];
  pago_predial: File[];

  // Paso 4: Elaboración del Plano de Rectificación (Elaboración)
  plano_propuesto: File[];
  fecha_elaboracion_plano: string;

  // Paso 5: Programación de Cita (Gestión)
  fecha_cita: string;
  hora_cita: string;
  entidad_revisora: string;
  funcionario_contacto: string;

  // Paso 6: Seguimiento y Observaciones (Gestión)
  notas_observaciones: string;
  documento_observaciones: File[];

  // Paso 7: Aprobación Final (Gestión)
  documento_aprobacion: File[];
  fecha_aprobacion: string;
}

export interface RectificacionLinderos {
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
    nombre_proyecto?: string;
    anteproyecto_asociado?: string;
  };
  steps_status: {
    administrado: string;
    seleccion_anteproyecto: string;
    documentos_legales: string;
    elaboracion_plano: string;
    programacion_cita: string;
    seguimiento_observaciones: string;
    aprobacion_final: string;
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

export enum RectificacionLinderosStatus {
  TODOS = 'todos',
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
}

export interface TabConfig {
  key: 'elaboracion' | 'gestion';
  label: string;
  description: string;
}
