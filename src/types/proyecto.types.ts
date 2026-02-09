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
  fue_presupuesto_obra?: DocumentFile;
  sustento_tecnico_legal_mvcs?: DocumentFile;
}

export interface EstructurasDocs {
  planos_estructuras?: DocumentFile;
  memoria_calculos_estructuras?: DocumentFile;
  memoria_especificaciones_tecnicas_estructuras?: DocumentFile;
  planos_sostenimiento_excavaciones?: DocumentFile;
  memoria_descriptiva_sostenimiento_excavaciones?: DocumentFile;
  estudio_mecanica_suelos?: DocumentFile;
  otros_archivos?: DocumentFile;
}

export interface SanitariasDocs {
  plano_instalacion_sanitaria?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
  factibilidad_desague?: DocumentFile;
  memoria_calculos?: DocumentFile;
  otros_archivos?: DocumentFile;
}

// Documentos eléctricos por sub-especialidad
export interface ElectricasDocs {
  plano_instalacion_electrica?: DocumentFile;
  memoria_descriptiva?: DocumentFile;
  especificaciones_tecnicas?: DocumentFile;
  factibilidad_energia?: DocumentFile;
  memoria_calculos?: DocumentFile;
  otros_archivos?: DocumentFile;
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
  memoria_calculos?: DocumentFile;
  otros_archivos?: DocumentFile;
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
  // --- NUEVOS CAMPOS DE CONTROL (Tipo de Obra) ---
  por_etapas?: boolean;               // Boolean
  numero_obras?: number;              // Integer (Relevante si por_etapas=true)
  etapa_por_autorizar?: boolean;      // Boolean
  // --- CONTROL MVCS ---
  consulta_mvcs?: boolean;            // Boolean (Activa la obligatoriedad del documento)
  documento_consulta_mvcs?: DocumentFile;   // Obligatorio si consulta_mvcs es true
  documento_respuesta_mvcs?: DocumentFile;  // Opcional / Informativo
}

// Documentos proporcionados por el administrado
export interface DocumentosAdministradoDocs {
  partida_registral?: DocumentFile;
  certificado_parametros_urbanisticos?: DocumentFile;
  croquis_planos_ubicacion?: DocumentFile;
  vigencia_poder?: DocumentFile;
  otros_documentos?: DocumentFile;
}

export interface ProyectoData {
  service_type: string;
  titulo_proyecto: string;
  tipo_proyecto: string;
  descripcion: string;
  anteproyecto_importado_id?: string;
  anteproyecto_importado?: AnteproyectoImportado;
  licencias_normativas?: LicenciasNormativas;
  datos_predio?: Record<string, unknown>;
  documentos_administrado?: DocumentosAdministradoDocs;
  arquitectura_docs: ArquitecturaDocs;
  estructuras_docs: EstructurasDocs;
  sanitarias_docs: SanitariasDocs;
  electricas_docs: InstalacionesElectricasDocs;
  sustento_tecnico?: SustentoTecnico;
}

export interface StepStatus {
  anteproyecto: 'Completada' | 'Pendiente' | 'En progreso';
  licencias_normativas: 'Completada' | 'Pendiente' | 'En progreso';
  predio: 'Completada' | 'Pendiente' | 'En progreso';                    // Nuevo paso
  documentos_administrado: 'Completada' | 'Pendiente' | 'En progreso';   // Nuevo paso
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
  // --- NUEVOS CAMPOS DE CONTROL (Tipo de Obra) ---
  por_etapas: boolean;
  numero_obras: number;
  etapa_por_autorizar: boolean;
  // --- CONTROL MVCS ---
  consulta_mvcs: boolean;
  lic_documento_consulta_mvcs?: File[];   // Obligatorio si consulta_mvcs es true
  lic_documento_respuesta_mvcs?: File[];  // Opcional / Informativo

  // Paso 2b: Predio
  departmentId: string;
  provinceId: string;
  districtId: string;
  urbanization: string;
  mz: string;
  lote: string;
  subLote: string;
  street: string;
  number: string;
  interior: string;
  latitud: number;
  longitud: number;
  area_total_m2: number;
  frente: number;
  derecha: number;
  izquierda: number;
  fondo: number;
  tipo_edificacion: string;
  numero_pisos: number;
  area_techada_total_m2: number;
  area_libre_m2: number;
  area_libre_porcentaje: number;
  descripcion_proyecto: string;
  // --- NUEVOS CAMPOS DE EDIFICACIÓN ---
  zonificacion: string;               // String (Requerido)
  numero_sotanos: number;             // Integer
  azotea: string;                     // String
  semisotano: string;                 // String
  uso_edificacion: string;            // String (Requerido)

  // Paso 2c: Documentos Administrado - Archivos
  admin_partida_registral?: File[];
  admin_certificado_parametros_urbanisticos?: File[];
  admin_croquis_planos_ubicacion?: File[];
  admin_vigencia_poder?: File[];
  admin_otros_documentos?: File[];

  // Paso 3: Arquitectura - Archivos
  arq_plano_ubicacion?: File[];
  arq_plano_arquitectura?: File[];
  arq_plano_seguridad?: File[];
  arq_memoria_descriptiva_seguridad?: File[];
  arq_memoria_descriptiva_arquitectura?: File[];
  arq_memoria_descriptiva_estructura?: File[];
  arq_fue_presupuesto_obra?: File[];
  arq_sustento_tecnico_legal_mvcs?: File[];
  arq_otros_archivos?: File[];

  // Paso 4: Estructuras - Archivos
  est_planos_estructuras?: File[];
  est_memoria_calculos_estructuras?: File[];
  est_memoria_especificaciones_tecnicas_estructuras?: File[];
  est_planos_sostenimiento_excavaciones?: File[];
  est_memoria_descriptiva_sostenimiento_excavaciones?: File[];
  est_estudio_mecanica_suelos?: File[];
  est_otros_archivos?: File[];

  // Paso 5: Sanitarias - Archivos
  san_plano_instalacion_sanitaria?: File[];
  san_memoria_descriptiva?: File[];
  san_especificaciones_tecnicas?: File[];
  san_factibilidad_desague?: File[];
  san_memoria_calculos?: File[];
  san_otros_archivos?: File[];

  // Paso 6: Eléctricas - Archivos por sub-especialidad
  // Eléctricas
  elec_plano_instalacion_electrica?: File[];
  elec_memoria_descriptiva?: File[];
  elec_especificaciones_tecnicas?: File[];
  elec_factibilidad_energia?: File[];
  elec_memoria_calculos?: File[];
  
  // Mecánicas
  mec_plano_instalacion_mecanica?: File[];
  mec_memoria_descriptiva?: File[];
  mec_especificaciones_tecnicas?: File[];
  
  // Gas
  gas_plano_instalacion_gas?: File[];
  gas_memoria_descriptiva?: File[];
  gas_especificaciones_tecnicas?: File[];
  gas_factibilidad_gas?: File[];
  gas_memoria_calculos?: File[];
  
  // Paneles Solares
  pan_planos?: File[];
  pan_memoria_descriptiva?: File[];
  pan_especificaciones_tecnicas?: File[];
  
  // Comunicaciones
  com_planos?: File[];
  com_memoria_descriptiva?: File[];

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