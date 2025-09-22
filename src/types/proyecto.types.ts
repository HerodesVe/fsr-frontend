export enum ProyectoStatus {
  TODOS = 'todos',
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
}

export enum DocumentStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  OBSERVADO = 'Observado',
}

export interface DocumentFile {
  name: string;
  is_mandatory: boolean;
  status: DocumentStatus;
  file_reference: string;
  emission_date: string;
  observation: string;
}

export interface UploadedDocument {
  key: string;
  name: string;
  file_id: string;
}

// Datos del Anteproyecto importado
export interface AnteproyectoImportado {
  id: string;
  nombre_proyecto: string;
  client_id: string;
  administrado: string;
  direccion: string;
  tipo_proyecto: string;
  descripcion: string;
  documentos_disponibles: DocumentFile[];
}

// Documentos por especialidad
export interface ArquitecturaDocs {
  plano_ubicacion?: DocumentFile;
  plano_arquitectura?: DocumentFile;
  plano_seguridad?: DocumentFile;
  memoria_descriptiva_seguridad?: DocumentFile;
  memoria_descriptiva_arquitectura?: DocumentFile;
  memoria_descriptiva_estructura?: DocumentFile;
}

export interface EstructurasDocs {
  plano_ubicacion?: DocumentFile;
  plano_arquitectura?: DocumentFile;
  plano_seguridad?: DocumentFile;
  memoria_descriptiva_seguridad?: DocumentFile;
  memoria_descriptiva_arquitectura?: DocumentFile;
  memoria_descriptiva_estructura?: DocumentFile;
}

export interface SanitariasDocs {
  plano_instalacion_sanitaria?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
  factibilidad_desague?: DocumentFile;
}

// Documentos eléctricos por sub-especialidad
export interface ElectricasDocs {
  plano_instalacion_electrica?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
  factibilidad_energia?: DocumentFile;
}

export interface MecanicasDocs {
  plano_instalacion_mecanica?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
}

export interface GasDocs {
  plano_instalacion_gas?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
  factibilidad_gas?: DocumentFile;
}

export interface PanelesSolaresDocs {
  planos?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
}

export interface ComunicacionesDocs {
  planos?: DocumentFile;
}

export interface InstalacionesElectricasDocs {
  electricas: ElectricasDocs;
  mecanicas: MecanicasDocs;
  gas: GasDocs;
  paneles_solares: PanelesSolaresDocs;
  comunicaciones: ComunicacionesDocs;
}

// Sustento Técnico
export interface SustentoTecnico {
  requiere_sustento_legal: boolean;
  requiere_informe_vinculante: boolean;
  documento_sustento_tecnico_legal?: DocumentFile;
  consulta_ministerio?: DocumentFile;
  cargo_presentacion_consulta?: DocumentFile;
}

// Licencias y Normativas (reutilizamos del anteproyecto)
export interface LicenciasNormativas {
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;
  link_normativas: string;
  archivo_normativo?: DocumentFile;
}

export interface ProyectoData {
  service_type: string;
  titulo_proyecto: string;
  tipo_proyecto: string;
  descripcion: string;
  anteproyecto_importado_id?: string;
  anteproyecto_importado?: AnteproyectoImportado;
  licencias_normativas?: LicenciasNormativas;
  arquitectura_docs: ArquitecturaDocs;
  estructuras_docs: EstructurasDocs;
  sanitarias_docs: SanitariasDocs;
  electricas_docs: InstalacionesElectricasDocs;
  sustento_tecnico?: SustentoTecnico;
}

export interface StepStatus {
  anteproyecto: 'Completada' | 'Pendiente' | 'En progreso';
  licencias_normativas: 'Completada' | 'Pendiente' | 'En progreso';
  arquitectura: 'Completada' | 'Pendiente' | 'En progreso';
  estructuras: 'Completada' | 'Pendiente' | 'En progreso';
  sanitarias: 'Completada' | 'Pendiente' | 'En progreso';
  electricas: 'Completada' | 'Pendiente' | 'En progreso';
  sustento_tecnico: 'Completada' | 'Pendiente' | 'En progreso';
}

export interface Proyecto {
  id: string;
  instance_code: string;
  service_id: string;
  client_id: string;
  user_id: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  scheduled_completion_date?: string;
  data: ProyectoData;
  steps_status: StepStatus;
  next_step: string;
  uploaded_documents: UploadedDocument[];
  // Campos adicionales que pueden venir de la API
  administrado?: string;
  responsable?: string;
  fecha_creacion?: string;
  fecha_culminacion?: string;
}

export interface CreateProyectoRequest {
  client_id: string;
  data: ProyectoData;
}

export interface UpdateProyectoRequest extends CreateProyectoRequest {
  id: string;
}

// Tipos para el formulario paso a paso
export interface FormStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface ProyectoFormData {
  // Paso 1: Anteproyecto
  selectedAnteproyecto?: AnteproyectoImportado;
  anteproyecto_importado_id?: string;
  
  // Si no hay anteproyecto seleccionado, datos manuales
  selectedClient?: any;
  titulo_proyecto: string;
  tipo_proyecto: string;
  descripcion: string;

  // Paso 2: Licencias (reutilizamos del anteproyecto)
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;
  link_normativas: string;
  archivo_normativo?: File;

  // Paso 3: Arquitectura - Archivos
  arq_plano_ubicacion?: File[];
  arq_plano_arquitectura?: File[];
  arq_plano_seguridad?: File[];
  arq_memoria_descriptiva_seguridad?: File[];
  arq_memoria_descriptiva_arquitectura?: File[];
  arq_memoria_descriptiva_estructura?: File[];
  arq_otros_archivos?: File[];

  // Paso 4: Estructuras - Archivos
  est_plano_ubicacion?: File[];
  est_plano_arquitectura?: File[];
  est_plano_seguridad?: File[];
  est_memoria_descriptiva_seguridad?: File[];
  est_memoria_descriptiva_arquitectura?: File[];
  est_memoria_descriptiva_estructura?: File[];
  est_otros_archivos?: File[];

  // Paso 5: Sanitarias - Archivos
  san_plano_instalacion_sanitaria?: File[];
  san_memoria_descriptiva?: File[];
  san_especificaciones_tecnicas?: File[];
  san_factibilidad_desague?: File[];
  san_otros_archivos?: File[];

  // Paso 6: Eléctricas - Archivos por sub-especialidad
  // Eléctricas
  elec_plano_instalacion_electrica?: File[];
  elec_memoria_descriptiva?: File[];
  elec_especificaciones_tecnicas?: File[];
  elec_factibilidad_energia?: File[];
  
  // Mecánicas
  mec_plano_instalacion_mecanica?: File[];
  mec_memoria_descriptiva?: File[];
  mec_especificaciones_tecnicas?: File[];
  
  // Gas
  gas_plano_instalacion_gas?: File[];
  gas_memoria_descriptiva?: File[];
  gas_especificaciones_tecnicas?: File[];
  gas_factibilidad_gas?: File[];
  
  // Paneles Solares
  pan_planos?: File[];
  pan_memoria_descriptiva?: File[];
  pan_especificaciones_tecnicas?: File[];
  
  // Comunicaciones
  com_planos?: File[];

  // Otros archivos para cada especialidad eléctrica
  elec_otros_archivos?: File[];
  mec_otros_archivos?: File[];
  gas_otros_archivos?: File[];
  pan_otros_archivos?: File[];
  com_otros_archivos?: File[];

  // Paso 7: Sustento Técnico
  requiere_sustento_legal: boolean;
  requiere_informe_vinculante: boolean;
  documento_sustento_tecnico_legal?: File[];
  consulta_ministerio?: File[];
  cargo_presentacion_consulta?: File[];
  sustento_otros_archivos?: File[];
}

// Tipos para las tabs de instalaciones eléctricas
export type ElectricasTabType = 'electricas' | 'mecanicas' | 'gas' | 'paneles_solares';

export interface ElectricasTab {
  key: ElectricasTabType;
  label: string;
  documents: string[];
}