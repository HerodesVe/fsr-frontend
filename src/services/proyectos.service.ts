import api from './api';
import type { 
  Proyecto, 
  CreateProyectoRequest, 
  UpdateProyectoRequest
} from '@/types/proyecto.types';

// Base URL según la guía de integración (con trailing slash para evitar redirecciones)
const PROYECTO_ENDPOINT = '/proyectos/';

export const getAllProyectos = async (): Promise<Proyecto[]> => {
  const response = await api.get(PROYECTO_ENDPOINT);
  return response.data;
};

export const getProyectoById = async (id: string): Promise<Proyecto> => {
  const response = await api.get(`${PROYECTO_ENDPOINT}${id}`);
  return response.data;
};

export const createProyecto = async (proyectoData: CreateProyectoRequest | any): Promise<Proyecto> => {
  const response = await api.post(PROYECTO_ENDPOINT, proyectoData);
  return response.data;
};

export const createInitialProyecto = async (data: { 
  client_id: string; 
  data: { 
    service_type: string; 
    titulo_proyecto: string;
    tipo_proyecto: string;
    descripcion: string;
    anteproyecto_importado_id?: string; 
  } 
}): Promise<Proyecto> => {
  const response = await api.post(PROYECTO_ENDPOINT, data);
  return response.data;
};

// Actualizar proyecto con PATCH según la guía de integración
export const updateProyecto = async (proyectoData: UpdateProyectoRequest | any): Promise<Proyecto> => {
  const { id, ...data } = proyectoData;
  const response = await api.patch(`${PROYECTO_ENDPOINT}${id}`, data);
  return response.data;
};

// Actualizar datos del predio (Paso 3 - Nuevo)
export interface DatosPredioPayload {
  ubicacion: {
    departmentId: string;
    provinceId: string;
    districtId: string;
    urbanization: string;
    street: string;
    number: string;
    mz?: string;
    lote?: string;
    subLote?: string;
    interior?: string;
  };
  latitud?: number;
  longitud?: number;
  medidas_perimetricas: {
    area_total_m2: number;
    frente?: number;
    derecha?: number;
    izquierda?: number;
    fondo?: number;
  };
  edificacion: {
    tipo_edificacion: string;
    numero_pisos: number;
    descripcion_proyecto?: string;
    area_techada_total_m2?: number;
    area_libre_m2?: number;
    area_libre_porcentaje?: number;
  };
}

export const updateDatosPredio = async (id: string, datosPredio: DatosPredioPayload): Promise<Proyecto> => {
  const response = await api.patch(`${PROYECTO_ENDPOINT}${id}`, {
    data: {
      datos_predio: datosPredio
    }
  });
  return response.data;
};

// Actualizar licencias normativas (Paso 2)
export interface LicenciasNormativasPayload {
  tipo_licencia_edificacion: string;
  tipo_modalidad: string;
  link_normativas?: string;
}

export const updateLicenciasNormativas = async (id: string, licencias: LicenciasNormativasPayload): Promise<Proyecto> => {
  const response = await api.patch(`${PROYECTO_ENDPOINT}${id}`, {
    data: {
      licencias_normativas: licencias
    }
  });
  return response.data;
};

export const deleteProyecto = async (id: string): Promise<void> => {
  await api.delete(`${PROYECTO_ENDPOINT}${id}`);
};

// Subir un solo documento
export const uploadSingleDocument = async (id: string, file: File, documentKey: string): Promise<any> => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('keys', documentKey);

  const response = await api.post(`${PROYECTO_ENDPOINT}${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Subir múltiples documentos
export const uploadDocuments = async (id: string, uploadData: { files: File[]; keys: string[] }): Promise<any> => {
  const formData = new FormData();
  
  // Agregar archivos al FormData
  uploadData.files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Agregar keys al FormData
  uploadData.keys.forEach((key) => {
    formData.append('keys', key);
  });

  const response = await api.post(`${PROYECTO_ENDPOINT}${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// ============================================
// TABLA MAESTRA DE KEYS PARA DOCUMENTOS
// Según la guía de integración del backend (Versión Final)
// ============================================

export const DOCUMENT_KEYS = {
  // A. Documentos Administrado
  ADMIN: {
    PARTIDA_REGISTRAL: 'admin_partida_registral',
    CERTIFICADO_PARAMETROS: 'admin_certificado_parametros_urbanisticos',
    CROQUIS_PLANOS: 'admin_croquis_planos_ubicacion',
    VIGENCIA_PODER: 'admin_vigencia_poder',
    OTROS: 'admin_otros_documentos',
  },
  
  // B. Arquitectura
  ARQUITECTURA: {
    FUE_PRESUPUESTO: 'arq_fue_presupuesto_obra',
    SUSTENTO_TECNICO_MVCS: 'arq_sustento_tecnico_legal_mvcs',
    PLANO_UBICACION: 'plano_ubicacion',                    // También acepta 'arq_plano_ubicacion'
    PLANO_ARQUITECTURA: 'plano_arquitectura',              // También acepta 'arq_plano_arquitectura'
    PLANO_SEGURIDAD: 'plano_seguridad',                    // También acepta 'arq_plano_seguridad'
    MEMORIA_ARQUITECTURA: 'memoria_descriptiva_arquitectura',
    MEMORIA_SEGURIDAD: 'memoria_descriptiva_seguridad',
  },
  
  // C. Estructuras
  ESTRUCTURAS: {
    PLANOS: 'est_planos_estructuras',
    MEMORIA_CALCULOS: 'est_memoria_calculos_estructuras',
    ESPECIFICACIONES_TECNICAS: 'est_memoria_especificaciones_tecnicas_estructuras',
    PLANOS_SOSTENIMIENTO: 'est_planos_sostenimiento_excavaciones',
    MEMORIA_SOSTENIMIENTO: 'est_memoria_descriptiva_sostenimiento_excavaciones',
    ESTUDIO_MECANICA_SUELOS: 'est_estudio_mecanica_suelos',
    OTROS: 'est_otros_archivos',
  },
  
  // D. Sanitarias
  SANITARIAS: {
    PLANO_INSTALACION: 'san_plano_instalacion_sanitaria',
    MEMORIA_DESCRIPTIVA: 'san_memoria_descriptiva',
    MEMORIA_CALCULOS: 'san_memoria_calculos',
    ESPECIFICACIONES_TECNICAS: 'san_especificaciones_tecnicas',
    FACTIBILIDAD_DESAGUE: 'san_factibilidad_desague',
    OTROS: 'san_otros_archivos',
  },
  
  // E. Eléctricas
  ELECTRICAS: {
    PLANO_INSTALACION: 'elec_plano_instalacion_electrica',
    MEMORIA_DESCRIPTIVA: 'elec_memoria_descriptiva',
    MEMORIA_CALCULOS: 'elec_memoria_calculos',
    ESPECIFICACIONES_TECNICAS: 'elec_especificaciones_tecnicas',
    FACTIBILIDAD_ENERGIA: 'elec_factibilidad_energia',
    OTROS: 'elec_otros_archivos',
  },
  
  // F. Gas
  GAS: {
    PLANO_INSTALACION: 'gas_plano_instalacion_gas',
    MEMORIA_DESCRIPTIVA: 'gas_memoria_descriptiva',
    MEMORIA_CALCULOS: 'gas_memoria_calculos',
    ESPECIFICACIONES_TECNICAS: 'gas_especificaciones_tecnicas',
    FACTIBILIDAD_GAS: 'gas_factibilidad_gas',
    OTROS: 'gas_otros_archivos',
  },
  
  // G. Mecánicas
  MECANICAS: {
    PLANO_INSTALACION: 'mec_plano_instalacion_mecanica',
    MEMORIA_DESCRIPTIVA: 'mec_memoria_descriptiva',
    ESPECIFICACIONES_TECNICAS: 'mec_especificaciones_tecnicas',
  },
  
  // H. Paneles Solares
  PANELES_SOLARES: {
    PLANOS: 'pan_planos',
    MEMORIA_DESCRIPTIVA: 'pan_memoria_descriptiva',
    ESPECIFICACIONES_TECNICAS: 'pan_especificaciones_tecnicas',
  },
  
  // I. Comunicaciones
  COMUNICACIONES: {
    PLANOS: 'com_planos',
  },
} as const;