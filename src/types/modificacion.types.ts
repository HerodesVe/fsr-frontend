import type { ClientOut } from './client.types';

export interface ModificacionFormData {
  // Paso 1: Administrado
  selectedClient: ClientOut | null;

  // Paso 2: Licencia
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;

  // Paso 3: Antecedentes
  vincular_expediente_fsr: string;
  numero_expediente_externo: string;
  licencia_obra_anterior: UploadedDocument[];
  planos_aprobados_anteriores: UploadedDocument[];
  formulario_unico_anterior: UploadedDocument[];

  // Paso 4: Elaboración del Nuevo Proyecto
  planos_arquitectura: UploadedDocument[];
  planos_estructuras: UploadedDocument[];
  planos_sanitarias: UploadedDocument[];
  planos_electricas: UploadedDocument[];
  memoria_descriptiva: UploadedDocument[];
  documentacion_adicional: UploadedDocument[];

  // Paso 5: Gestión - Ingreso y Seguimiento
  fecha_ingreso_entidad: string;
  cargo_ingreso_expediente: UploadedDocument | null;
  acta_observaciones: UploadedDocument | null;
  acta_conformidad: UploadedDocument | null;
  acta_reconsideracion: UploadedDocument | null;

  // Paso 5: Gestión - Subsanación
  anexo_subsanacion: UploadedDocument | null;
  planos_corregidos: UploadedDocument | null;

  // Paso 5: Gestión - Finalización
  licencia_modificacion_emitida: UploadedDocument | null;
  cargo_entrega_administrado: UploadedDocument | null;
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

export interface Modificacion {
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
    administrado: string;
    licencia: string;
    antecedentes: string;
    elaboracion: string;
    gestion: string;
  };
}

export enum ModificacionStatus {
  TODOS = 'todos',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado'
}

