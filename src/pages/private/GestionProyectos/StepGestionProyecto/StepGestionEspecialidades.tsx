import { useState, useEffect, useMemo, useCallback } from 'react';
import { LuCheck, LuX, LuClock, LuLock, LuInfo, LuPlus, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { RevisionForm, RevisionHistorial } from './components';
import type { 
  GestionProyectoFormData, 
  EspecialidadData, 
  RevisionEspecialidadData,
  TipoEspecialidad,
  LIMITES_ESPECIALIDAD,
  MAX_REVISIONES_GLOBALES
} from '@/types/gestionProyecto.types';

// Importar constantes
const LIMITES: Record<TipoEspecialidad, number> = {
  arquitectura: 8,
  estructuras: 7,
  electricas: 6,
  sanitarias: 6,
};
const MAX_GLOBAL = 8;

interface StepGestionEspecialidadesProps {
  formData: GestionProyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

// Configuración de especialidades
const ESPECIALIDADES_CONFIG: { key: TipoEspecialidad; nombre: string }[] = [
  { key: 'arquitectura', nombre: 'Arquitectura' },
  { key: 'estructuras', nombre: 'Estructuras' },
  { key: 'electricas', nombre: 'Eléctricas' },
  { key: 'sanitarias', nombre: 'Sanitarias' },
];

// Función para generar ID único
const generateRevisionId = () => `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Función para obtener fecha actual formateada
const getCurrentDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para crear especialidad inicial
const createInitialEspecialidad = (): EspecialidadData => ({
  revisiones: [],
  revision_actual_index: -1,
  es_conforme: false,
  es_improcedente: false,
  estado: 'pendiente',
  revision_count: 0,
});

// Función para crear nueva revisión
const createNewRevision = (
  numeroLocal: number, 
  numeroGlobal: number
): RevisionEspecialidadData => ({
  id: generateRevisionId(),
  numero_revision: numeroLocal,
  numero_revision_global: numeroGlobal,
  fecha_creacion: getCurrentDate(),
  notificacion: { tiene_notificacion: false },
  resultado_acta: null,
  estado: 'en_progreso',
});

// Componente de Especialidad Individual
interface EspecialidadComponentProps {
  nombre: string;
  especialidadKey: TipoEspecialidad;
  data: EspecialidadData;
  isEnabled: boolean;
  revisionesGlobalesUsadas: number;
  limiteEspecialidad: number;
  gestionId: string;
  uploadedDocuments: any[];
  onDataChange: (data: EspecialidadData) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onAddRevision: () => boolean;
}

function EspecialidadComponent({
  nombre,
  especialidadKey,
  data,
  isEnabled,
  revisionesGlobalesUsadas,
  limiteEspecialidad,
  gestionId,
  uploadedDocuments,
  onDataChange,
  onFileUpload,
  onAddRevision,
}: EspecialidadComponentProps) {
  const [expanded, setExpanded] = useState(true);
  const [showHistorial, setShowHistorial] = useState(false);

  // Revisión actual
  const revisionActual = useMemo(() => {
    if (data.revision_actual_index >= 0 && data.revisiones[data.revision_actual_index]) {
      return data.revisiones[data.revision_actual_index];
    }
    return null;
  }, [data.revisiones, data.revision_actual_index]);

  // Revisiones anteriores (solo las completadas o las que no son la actual)
  const revisionesAnteriores = useMemo(() => {
    return data.revisiones.filter((_, index) => index < data.revision_actual_index);
  }, [data.revisiones, data.revision_actual_index]);

  // Revisiones disponibles para esta especialidad
  const revisionesDisponibles = useMemo(() => {
    const usadasEspecialidad = data.revisiones.filter(r => r.resultado_acta === 'no_conforme').length;
    const limiteRelativo = Math.min(
      limiteEspecialidad,
      MAX_GLOBAL - revisionesGlobalesUsadas + usadasEspecialidad
    );
    return Math.max(0, limiteRelativo - usadasEspecialidad);
  }, [data.revisiones, limiteEspecialidad, revisionesGlobalesUsadas]);

  // Verificar si puede crear nueva revisión
  const canCreateRevision = useMemo(() => {
    // Si está conforme o improcedente, no puede crear más
    if (data.es_conforme || data.es_improcedente) return false;
    
    // Si no hay revisión actual, puede crear la primera
    if (!revisionActual) return revisionesGlobalesUsadas < MAX_GLOBAL;

    // Si la revisión actual no tiene resultado, no puede crear otra
    if (!revisionActual.resultado_acta) return false;

    // Si fue conforme, no necesita más revisiones
    if (revisionActual.resultado_acta === 'conforme') return false;

    // Si fue no conforme, verificar subsanación
    const requiereSubsanacion = 
      revisionActual.resultado_acta === 'no_conforme' &&
      revisionActual.reconsideracion?.resultado !== 'fundado' &&
      revisionActual.apelacion?.resultado !== 'fundado';

    if (requiereSubsanacion && !revisionActual.subsanacion_completada) {
      return false;
    }

    // Verificar límites
    return revisionesDisponibles > 0 && revisionesGlobalesUsadas < MAX_GLOBAL;
  }, [data.es_conforme, data.es_improcedente, revisionActual, revisionesDisponibles, revisionesGlobalesUsadas]);

  // Handler para actualizar revisión actual
  const handleRevisionChange = useCallback((updates: Partial<RevisionEspecialidadData>) => {
    if (!revisionActual) return;

    const newRevisiones = [...data.revisiones];
    newRevisiones[data.revision_actual_index] = {
      ...revisionActual,
      ...updates,
    };

    // Actualizar estado de especialidad si cambió el resultado
    let newEstado = data.estado;
    let newEsConforme = data.es_conforme;
    let newEsImprocedente = data.es_improcedente;

    if (updates.resultado_acta === 'conforme') {
      newEstado = 'conforme';
      newEsConforme = true;
      newRevisiones[data.revision_actual_index].estado = 'completada';
    } else if (updates.resultado_acta === 'no_conforme') {
      newEstado = 'en_progreso';
      newEsConforme = false;
      
      // Verificar si alcanzó el límite
      const noConformes = newRevisiones.filter(r => r.resultado_acta === 'no_conforme').length;
      if (noConformes >= limiteEspecialidad || revisionesGlobalesUsadas >= MAX_GLOBAL) {
        newEstado = 'improcedente';
        newEsImprocedente = true;
        newRevisiones[data.revision_actual_index].estado = 'improcedente';
      }
    }

    onDataChange({
      ...data,
      revisiones: newRevisiones,
      estado: newEstado,
      es_conforme: newEsConforme,
      es_improcedente: newEsImprocedente,
    });
  }, [revisionActual, data, limiteEspecialidad, revisionesGlobalesUsadas, onDataChange]);

  // Si no está habilitada
  if (!isEnabled) {
    return (
      <div className="p-4 rounded-lg bg-gray-100 opacity-60">
        <div className="flex items-center gap-2">
          <LuLock className="w-5 h-5 text-gray-500" />
          <h4 className="text-md font-bold text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            {nombre} (Bloqueado)
          </h4>
        </div>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Esta especialidad se habilitará cuando la anterior esté conforme.
        </p>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${
      data.es_conforme ? 'border-green-300 bg-green-50' :
      data.es_improcedente ? 'border-red-300 bg-red-50' :
      'border-gray-300 bg-white'
    }`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer ${
          data.es_conforme ? 'bg-green-100' :
          data.es_improcedente ? 'bg-red-100' :
          'bg-gray-50'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {data.es_conforme ? (
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <LuCheck className="w-5 h-5 text-white" />
            </div>
          ) : data.es_improcedente ? (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <LuX className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
              <LuClock className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h4 className="text-md font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {nombre}
            </h4>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Revisión local {data.revisiones.length > 0 ? data.revisiones.length : 0} • 
              Límite: {limiteEspecialidad} • 
              Disponibles: {revisionesDisponibles}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {data.es_conforme && (
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
              Aprobada
            </span>
          )}
          {data.es_improcedente && (
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
              Improcedente
            </span>
          )}
          {expanded ? <LuChevronUp className="w-5 h-5" /> : <LuChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Contenido expandido */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Estado de improcedencia */}
          {data.es_improcedente && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <LuInfo className="w-5 h-5" />
                <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Especialidad Improcedente
                </span>
              </div>
              <p className="text-sm text-red-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Se ha alcanzado el límite de revisiones sin obtener conformidad.
              </p>
            </div>
          )}

          {/* Historial de revisiones */}
          {revisionesAnteriores.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3">
              <button
                onClick={() => setShowHistorial(!showHistorial)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {showHistorial ? <LuChevronUp /> : <LuChevronDown />}
                Ver historial ({revisionesAnteriores.length} revisiones anteriores)
              </button>
              {showHistorial && (
                <div className="mt-3">
                  <RevisionHistorial
                    revisiones={revisionesAnteriores}
                    especialidadNombre={nombre}
                  />
                </div>
              )}
            </div>
          )}

          {/* Formulario de revisión actual */}
          {revisionActual && !data.es_conforme && !data.es_improcedente ? (
            <RevisionForm
              revision={revisionActual}
              especialidadKey={especialidadKey}
              gestionId={gestionId}
              numeroRevisionLocal={revisionActual.numero_revision}
              numeroRevisionGlobal={revisionActual.numero_revision_global}
              revisionesGlobalesUsadas={revisionesGlobalesUsadas}
              limiteEspecialidad={limiteEspecialidad}
              uploadedDocuments={uploadedDocuments}
              onRevisionChange={handleRevisionChange}
              onFileUpload={onFileUpload}
            />
          ) : !data.es_conforme && !data.es_improcedente && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <LuInfo className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                No hay revisión activa para esta especialidad
              </p>
              <Button
                onClick={onAddRevision}
                startContent={<LuPlus className="w-4 h-4" />}
                className="bg-blue-600 text-white"
              >
                Iniciar Primera Revisión
              </Button>
            </div>
          )}

          {/* Mensaje de conformidad */}
          {data.es_conforme && (
            <div className="text-center py-8">
              <LuCheck className="w-12 h-12 mx-auto text-green-600 mb-2" />
              <p className="text-lg font-medium text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Especialidad Aprobada
              </p>
              <p className="text-sm text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {nombre} ha sido aprobada exitosamente
              </p>
            </div>
          )}

          {/* Botón para nueva revisión */}
          {canCreateRevision && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={onAddRevision}
                startContent={<LuPlus className="w-4 h-4" />}
                variant="bordered"
                className="w-full"
              >
                Crear Nueva Revisión (#{data.revisiones.length + 1})
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                Revisiones globales restantes: {MAX_GLOBAL - revisionesGlobalesUsadas}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente Principal
export default function StepGestionEspecialidades({
  formData,
  errors,
  gestionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepGestionEspecialidadesProps) {
  // Inicializar especialidades si no existen
  useEffect(() => {
    let needsUpdate = false;
    const newEspecialidades = { ...formData.especialidades };

    ESPECIALIDADES_CONFIG.forEach(({ key }) => {
      if (!newEspecialidades[key] || !newEspecialidades[key].revisiones) {
        newEspecialidades[key] = {
          ...createInitialEspecialidad(),
          ...(newEspecialidades[key] || {}),
          revisiones: newEspecialidades[key]?.revisiones || [],
          revision_actual_index: newEspecialidades[key]?.revision_actual_index ?? -1,
        };
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      onInputChange('especialidades', newEspecialidades);
    }
  }, []);

  // Calcular revisiones globales usadas
  const revisionesGlobalesUsadas = useMemo(() => {
    let total = 0;
    ESPECIALIDADES_CONFIG.forEach(({ key }) => {
      const esp = formData.especialidades[key];
      if (esp?.revisiones) {
        total += esp.revisiones.filter(r => r.resultado_acta === 'no_conforme').length;
      }
    });
    return total;
  }, [formData.especialidades]);

  // Calcular estado del proyecto
  const estadoProyecto = useMemo(() => {
    const todasConformes = ESPECIALIDADES_CONFIG.every(
      ({ key }) => formData.especialidades[key]?.es_conforme
    );
    if (todasConformes) return 'conforme';

    const algunaImprocedente = ESPECIALIDADES_CONFIG.some(
      ({ key }) => formData.especialidades[key]?.es_improcedente
    );
    if (algunaImprocedente || revisionesGlobalesUsadas >= MAX_GLOBAL) return 'improcedente';

    return 'en_proceso';
  }, [formData.especialidades, revisionesGlobalesUsadas]);

  // Verificar si especialidad está habilitada
  const isEspecialidadEnabled = useCallback((index: number) => {
    if (index === 0) return true; // Arquitectura siempre habilitada

    // Eléctricas y Sanitarias se habilitan juntas cuando Estructuras está conforme
    if (index >= 2) {
      return formData.especialidades.estructuras?.es_conforme || false;
    }

    // Estructuras se habilita cuando Arquitectura está conforme
    return formData.especialidades.arquitectura?.es_conforme || false;
  }, [formData.especialidades]);

  // Handler para cambio de especialidad
  const handleEspecialidadChange = useCallback((
    especialidadKey: TipoEspecialidad, 
    data: EspecialidadData
  ) => {
    const newEspecialidades = {
      ...formData.especialidades,
      [especialidadKey]: data,
    };
    
    onInputChange('especialidades', newEspecialidades);
    
    // Actualizar estado global si es necesario
    const newRevisionesGlobales = ESPECIALIDADES_CONFIG.reduce((total, { key }) => {
      const esp = newEspecialidades[key];
      return total + (esp?.revisiones?.filter(r => r.resultado_acta === 'no_conforme').length || 0);
    }, 0);

    if (newRevisionesGlobales !== formData.revisiones_globales_usadas) {
      onInputChange('revisiones_globales_usadas', newRevisionesGlobales);
    }
  }, [formData.especialidades, formData.revisiones_globales_usadas, onInputChange]);

  // Handler para agregar revisión
  const handleAddRevision = useCallback((especialidadKey: TipoEspecialidad): boolean => {
    const esp = formData.especialidades[especialidadKey];
    if (!esp) return false;

    // Verificar límites
    if (revisionesGlobalesUsadas >= MAX_GLOBAL) return false;
    
    const noConformesEsp = esp.revisiones?.filter(r => r.resultado_acta === 'no_conforme').length || 0;
    if (noConformesEsp >= LIMITES[especialidadKey]) return false;

    const newRevision = createNewRevision(
      (esp.revisiones?.length || 0) + 1,
      revisionesGlobalesUsadas + 1
    );

    handleEspecialidadChange(especialidadKey, {
      ...esp,
      revisiones: [...(esp.revisiones || []), newRevision],
      revision_actual_index: (esp.revisiones?.length || 0),
      estado: 'en_progreso',
    });

    return true;
  }, [formData.especialidades, revisionesGlobalesUsadas, handleEspecialidadChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestión por Especialidades (Secuencial)
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestione la aprobación de cada especialidad. El proyecto tiene un máximo de 8 revisiones globales.
        </p>
      </div>

      {/* Barra de progreso global */}
      <div className={`p-4 rounded-lg ${
        estadoProyecto === 'conforme' ? 'bg-green-100 border border-green-300' :
        estadoProyecto === 'improcedente' ? 'bg-red-100 border border-red-300' :
        'bg-blue-100 border border-blue-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Revisiones Globales Utilizadas
          </h4>
          <span className={`text-2xl font-bold ${
            estadoProyecto === 'conforme' ? 'text-green-700' :
            estadoProyecto === 'improcedente' ? 'text-red-700' :
            revisionesGlobalesUsadas >= 6 ? 'text-red-600' :
            revisionesGlobalesUsadas >= 4 ? 'text-yellow-600' :
            'text-blue-700'
          }`}>
            {revisionesGlobalesUsadas} / {MAX_GLOBAL}
          </span>
        </div>
        
        {/* Barra visual */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              estadoProyecto === 'conforme' ? 'bg-green-600' :
              estadoProyecto === 'improcedente' ? 'bg-red-600' :
              revisionesGlobalesUsadas >= 6 ? 'bg-red-500' :
              revisionesGlobalesUsadas >= 4 ? 'bg-yellow-500' :
              'bg-blue-600'
            }`}
            style={{ width: `${(revisionesGlobalesUsadas / MAX_GLOBAL) * 100}%` }}
          />
        </div>

        {/* Indicadores */}
        <div className="flex justify-between text-xs text-gray-600">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <span 
              key={num} 
              className={num <= revisionesGlobalesUsadas ? 'text-gray-900 font-medium' : ''}
            >
              {num}
            </span>
          ))}
        </div>

        {/* Mensaje de estado */}
        {estadoProyecto === 'improcedente' && (
          <div className="mt-3 p-3 bg-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium flex items-center gap-2">
              <LuInfo className="w-4 h-4" />
              Proyecto Improcedente - Se agotaron las oportunidades de revisión
            </p>
          </div>
        )}
        {estadoProyecto === 'conforme' && (
          <div className="mt-3 p-3 bg-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium flex items-center gap-2">
              <LuCheck className="w-4 h-4" />
              Todas las especialidades han sido aprobadas
            </p>
          </div>
        )}
      </div>

      {/* Información del proceso */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Reglas del Proceso
        </h4>
        <ul className="text-sm text-gray-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li>• <strong>Arquitectura:</strong> Puede consumir hasta 8 revisiones</li>
          <li>• <strong>Estructuras:</strong> Máximo 7 revisiones (se habilita cuando Arquitectura está conforme)</li>
          <li>• <strong>Eléctricas y Sanitarias:</strong> Máximo 6 revisiones cada una (se habilitan cuando Estructuras está conforme)</li>
          <li>• El contador global de 8 revisiones se comparte entre todas las especialidades</li>
        </ul>
      </div>

      {/* Especialidades */}
      <div className="space-y-4">
        {ESPECIALIDADES_CONFIG.map((esp, index) => (
          <EspecialidadComponent
            key={esp.key}
            nombre={esp.nombre}
            especialidadKey={esp.key}
            data={formData.especialidades[esp.key] || createInitialEspecialidad()}
            isEnabled={isEspecialidadEnabled(index)}
            revisionesGlobalesUsadas={revisionesGlobalesUsadas}
            limiteEspecialidad={LIMITES[esp.key]}
            gestionId={gestionId}
            uploadedDocuments={uploadedDocuments}
            onDataChange={(data) => handleEspecialidadChange(esp.key, data)}
            onFileUpload={onFileUpload}
            onAddRevision={() => handleAddRevision(esp.key)}
          />
        ))}
      </div>

      {/* Progreso visual de especialidades */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Progreso de Especialidades
        </h4>
        <div className="flex items-center gap-2 flex-wrap">
          {ESPECIALIDADES_CONFIG.map((esp, index) => {
            const espData = formData.especialidades[esp.key];
            const enabled = isEspecialidadEnabled(index);
            
            return (
              <div key={esp.key} className="flex items-center">
                <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-xs font-medium ${
                    espData?.es_conforme
                      ? 'bg-green-600 text-white'
                      : espData?.es_improcedente
                      ? 'bg-red-600 text-white'
                      : enabled
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {espData?.es_conforme ? (
                      <LuCheck className="w-5 h-5" />
                    ) : espData?.es_improcedente ? (
                      <LuX className="w-5 h-5" />
                    ) : enabled ? (
                      <LuClock className="w-5 h-5" />
                    ) : (
                      <LuLock className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-1 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {esp.nombre}
                  </span>
                  {espData?.revisiones?.length > 0 && (
                    <span className="text-xs text-gray-500">
                      Rev: {espData.revisiones.length}
                    </span>
                  )}
                </div>
                {index < ESPECIALIDADES_CONFIG.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    espData?.es_conforme ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
