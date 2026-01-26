import { useState, useMemo, useCallback, useEffect } from 'react';
import { LuInfo, LuCheck, LuX, LuPlus, LuTriangle, LuFileText, LuRotateCcw } from 'react-icons/lu';
import { DateInput, FileUpload, Button, Switch } from '@/components/ui';
import { RevisionHistorial, ProcesoRecurso } from './components';
import type { 
  GestionAnteproyectoFormData, 
  UploadedDocument, 
  RevisionData, 
  ProcesoRecursoData,
  NotificacionData
} from '@/types/gestionAnteproyecto.types';

const MAX_REVISIONES = 4;

interface StepSeguimientoRespuestaProps {
  formData: GestionAnteproyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Función para crear una nueva revisión vacía
const createEmptyRevision = (numeroRevision: number): RevisionData => ({
  id: `revision_${Date.now()}_${numeroRevision}`,
  numero_revision: numeroRevision,
  fecha_creacion: new Date().toISOString().split('T')[0],
  notificacion: {
    tiene_notificacion: false,
  },
  resultado_acta: null,
  subsanacion_completada: false,
  reconsideracion: {
    habilitado: false,
    resultado: null,
  },
  apelacion: {
    habilitado: false,
    resultado: null,
  },
  estado: 'en_progreso',
});

// Función para crear datos de recurso vacíos
const createEmptyRecurso = (): ProcesoRecursoData => ({
  habilitado: false,
  resultado: null,
});

export default function StepSeguimientoRespuesta({
  formData,
  errors,
  gestionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepSeguimientoRespuestaProps) {
  
  // Inicializar revisiones en formData si no existen
  useEffect(() => {
    if (!formData.revisiones || formData.revisiones.length === 0) {
      // Migrar datos legacy si existen
      if (formData.fecha_respuesta || formData.resultado_acta) {
        const legacyRevision: RevisionData = {
          id: 'revision_legacy_1',
          numero_revision: 1,
          fecha_creacion: formData.fecha_respuesta || new Date().toISOString().split('T')[0],
          fecha_respuesta: formData.fecha_respuesta,
          resultado_acta: formData.resultado_acta,
          notificacion: { tiene_notificacion: false },
          reconsideracion: {
            habilitado: !!formData.fecha_presentacion_reconsideracion,
            fecha_presentacion: formData.fecha_presentacion_reconsideracion,
            resultado: null,
          },
          apelacion: createEmptyRecurso(),
          estado: formData.resultado_acta === 'conforme' ? 'completada' : 'en_progreso',
        };
        onInputChange('revisiones', [legacyRevision]);
      } else {
        // Crear primera revisión vacía
        onInputChange('revisiones', [createEmptyRevision(1)]);
      }
    }
  }, []); // Solo ejecutar una vez al montar

  // Obtener revisiones del formData (ya inicializadas)
  const revisiones = formData.revisiones && formData.revisiones.length > 0 
    ? formData.revisiones 
    : [createEmptyRevision(1)];

  const revisionActualIndex = formData.revision_actual_index ?? revisiones.length - 1;
  const revisionActual = revisiones[revisionActualIndex] || revisiones[revisiones.length - 1];

  // Estado del seguimiento
  const estadoSeguimiento = useMemo(() => {
    if (revisiones.some(r => r.resultado_acta === 'conforme')) {
      return 'conforme';
    }
    if (revisiones.length >= MAX_REVISIONES && revisiones[revisiones.length - 1]?.resultado_acta === 'no_conforme') {
      return 'improcedente';
    }
    return 'en_proceso';
  }, [revisiones]);

  // Verificar si se puede crear nueva revisión
  const puedeCrearNuevaRevision = useMemo(() => {
    if (estadoSeguimiento !== 'en_proceso') return false;
    if (revisiones.length >= MAX_REVISIONES) return false;
    
    const ultimaRevision = revisiones[revisiones.length - 1];
    if (!ultimaRevision) return true;
    
    // Solo se puede crear nueva revisión si la anterior fue No Conforme y se completó la subsanación
    if (ultimaRevision.resultado_acta !== 'no_conforme') return false;
    
    // Verificar si se completó la subsanación (o si el recurso fue fundado)
    const recursoFundado = 
      ultimaRevision.reconsideracion?.resultado === 'fundado' ||
      ultimaRevision.apelacion?.resultado === 'fundado';
    
    if (recursoFundado) return true;
    
    return ultimaRevision.subsanacion_completada === true;
  }, [revisiones, estadoSeguimiento]);

  // Revisiones anteriores (todas menos la actual)
  const revisionesAnteriores = useMemo(() => {
    return revisiones.slice(0, -1);
  }, [revisiones]);

  // Actualizar revisión actual - acepta múltiples campos a la vez
  const updateRevisionActual = useCallback((updates: Partial<RevisionData>) => {
    const currentRevisiones = formData.revisiones && formData.revisiones.length > 0 
      ? formData.revisiones 
      : [createEmptyRevision(1)];
    const currentIndex = formData.revision_actual_index ?? currentRevisiones.length - 1;
    
    const nuevasRevisiones = [...currentRevisiones];
    nuevasRevisiones[currentIndex] = {
      ...nuevasRevisiones[currentIndex],
      ...updates,
    };
    onInputChange('revisiones', nuevasRevisiones);
  }, [formData.revisiones, formData.revision_actual_index, onInputChange]);

  // Actualizar notificación de la revisión actual
  const updateNotificacion = useCallback((field: keyof NotificacionData, value: any) => {
    const nuevaNotificacion: NotificacionData = {
      tiene_notificacion: revisionActual.notificacion?.tiene_notificacion || false,
      ...revisionActual.notificacion,
      [field]: value,
    };
    updateRevisionActual({ notificacion: nuevaNotificacion });
  }, [revisionActual.notificacion, updateRevisionActual]);

  // Actualizar reconsideración
  const updateReconsideracion = useCallback((field: keyof ProcesoRecursoData, value: any) => {
    const nuevaReconsideracion: ProcesoRecursoData = {
      habilitado: revisionActual.reconsideracion?.habilitado || false,
      resultado: revisionActual.reconsideracion?.resultado || null,
      ...revisionActual.reconsideracion,
      [field]: value,
    };
    updateRevisionActual({ reconsideracion: nuevaReconsideracion });
  }, [revisionActual.reconsideracion, updateRevisionActual]);

  // Actualizar apelación
  const updateApelacion = useCallback((field: keyof ProcesoRecursoData, value: any) => {
    const nuevaApelacion: ProcesoRecursoData = {
      habilitado: revisionActual.apelacion?.habilitado || false,
      resultado: revisionActual.apelacion?.resultado || null,
      ...revisionActual.apelacion,
      [field]: value,
    };
    updateRevisionActual({ apelacion: nuevaApelacion });
  }, [revisionActual.apelacion, updateRevisionActual]);

  // Document key prefix para la revisión actual (definido antes de usarse)
  const docKeyPrefix = `seguimiento_respuesta.revision_${revisionActualIndex}`;

  // Estado para mensaje de validación
  const [validationError, setValidationError] = useState<string | null>(null);

  // Verificar si tiene los datos requeridos para seleccionar resultado
  const tieneArchivoActa = useMemo(() => {
    // Verificar en documentos subidos
    return uploadedDocuments.some(doc => 
      doc.key === `${docKeyPrefix}.archivo_acta` || 
      doc.key === 'seguimiento_respuesta.archivo_respuesta'
    );
  }, [uploadedDocuments, docKeyPrefix]);

  const puedeSeleccionarResultado = useMemo(() => {
    const tieneFecha = !!revisionActual.fecha_respuesta && revisionActual.fecha_respuesta.trim() !== '';
    return tieneFecha && tieneArchivoActa;
  }, [revisionActual.fecha_respuesta, tieneArchivoActa]);

  // Manejar cambio de resultado del acta
  const handleResultadoActaChange = useCallback((resultado: 'conforme' | 'no_conforme') => {
    // Si se hace clic en el mismo resultado, deseleccionar (toggle)
    if (revisionActual.resultado_acta === resultado) {
      updateRevisionActual({
        resultado_acta: null,
        estado: 'en_progreso'
      });
      onInputChange('estado_seguimiento', 'en_proceso');
      onInputChange('resultado_acta', null);
      setValidationError(null);
      return;
    }

    // Validar que tenga fecha y archivo antes de permitir seleccionar
    if (!revisionActual.fecha_respuesta || revisionActual.fecha_respuesta.trim() === '') {
      setValidationError('Debe ingresar la fecha de respuesta de la municipalidad antes de seleccionar el resultado.');
      return;
    }

    if (!tieneArchivoActa) {
      setValidationError('Debe cargar el archivo del acta antes de seleccionar el resultado.');
      return;
    }

    // Limpiar error de validación
    setValidationError(null);
    
    // Actualizar resultado y estado en una sola llamada
    if (resultado === 'conforme') {
      updateRevisionActual({
        resultado_acta: resultado,
        estado: 'completada'
      });
      onInputChange('estado_seguimiento', 'conforme');
    } else {
      updateRevisionActual({
        resultado_acta: resultado,
        estado: 'en_progreso'
      });
      onInputChange('estado_seguimiento', 'en_proceso');
    }
    
    // Compatibilidad con campos legacy
    onInputChange('resultado_acta', resultado);
  }, [updateRevisionActual, revisionActual.resultado_acta, revisionActual.fecha_respuesta, tieneArchivoActa, onInputChange]);

  // Limpiar selección de resultado
  const handleLimpiarResultado = useCallback(() => {
    updateRevisionActual({
      resultado_acta: null,
      estado: 'en_progreso',
      subsanacion_completada: false,
      reconsideracion: { habilitado: false, resultado: null },
      apelacion: { habilitado: false, resultado: null }
    });
    onInputChange('estado_seguimiento', 'en_proceso');
    onInputChange('resultado_acta', null);
  }, [updateRevisionActual, onInputChange]);

  // Crear nueva revisión
  const handleCrearNuevaRevision = useCallback(() => {
    if (!puedeCrearNuevaRevision) return;
    
    // Marcar la revisión actual como completada
    const nuevasRevisiones = [...revisiones];
    nuevasRevisiones[revisionActualIndex] = {
      ...nuevasRevisiones[revisionActualIndex],
      estado: 'completada',
    };
    
    // Crear nueva revisión
    const nuevaRevision = createEmptyRevision(revisiones.length + 1);
    nuevasRevisiones.push(nuevaRevision);
    
    onInputChange('revisiones', nuevasRevisiones);
    onInputChange('revision_actual_index', nuevasRevisiones.length - 1);
  }, [puedeCrearNuevaRevision, revisiones, revisionActualIndex, onInputChange]);

  // Verificar si se requiere subsanación
  const requiereSubsanacion = useMemo(() => {
    if (revisionActual.resultado_acta !== 'no_conforme') return false;
    
    // Si hay recurso fundado, no se requiere subsanación
    if (revisionActual.reconsideracion?.resultado === 'fundado' ||
        revisionActual.apelacion?.resultado === 'fundado') {
      return false;
    }
    
    return true;
  }, [revisionActual]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seguimiento y Respuesta de la Municipalidad
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre la respuesta de la municipalidad y de ser el caso gestione el levantamiento de observaciones.
        </p>
      </div>

      {/* Estado del proceso */}
      {estadoSeguimiento === 'improcedente' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LuTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proceso Improcedente
            </h4>
          </div>
          <p className="text-sm text-red-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Se han agotado las 4 oportunidades de revisión sin obtener conformidad. El proceso ha sido declarado improcedente.
          </p>
        </div>
      )}

      {estadoSeguimiento === 'conforme' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LuCheck className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Anteproyecto Conforme
            </h4>
          </div>
          <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            El anteproyecto ha sido aprobado por la municipalidad. Puede proceder con la entrega de documentos finales.
          </p>
        </div>
      )}

      {/* Información de plazos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <LuInfo className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Plazo de Respuesta
          </h4>
        </div>
        <p className="text-sm text-yellow-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          La municipalidad tiene un plazo de 5 días hábiles para emitir respuesta desde la fecha de ingreso.
          Máximo {MAX_REVISIONES} oportunidades de revisión.
        </p>
      </div>

      {/* Historial de revisiones anteriores */}
      {revisionesAnteriores.length > 0 && (
        <RevisionHistorial 
          revisiones={revisionesAnteriores}
        />
      )}

      {/* Revisión Actual */}
      {estadoSeguimiento === 'en_proceso' && (
        <div className="border-2 border-teal-200 rounded-lg p-6 bg-teal-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Revisión {revisionActual.numero_revision} de {MAX_REVISIONES}
              <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                En Progreso
              </span>
            </h3>
          </div>

          {/* FLUJO A: Notificación o Carta */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LuFileText className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿Se emitió Notificación o Carta de observaciones?
                </h4>
              </div>
              <Switch
                isSelected={revisionActual.notificacion?.tiene_notificacion || false}
                onValueChange={(value: boolean) => updateNotificacion('tiene_notificacion', value)}
              />
            </div>

            {revisionActual.notificacion?.tiene_notificacion && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateInput
                    label="Fecha de Notificación"
                    required
                    value={revisionActual.notificacion.fecha_notificacion || ''}
                    onChange={(value) => updateNotificacion('fecha_notificacion', value)}
                  />

                  <FileUpload
                    label="Archivo de Notificación/Carta"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(files) => updateNotificacion('archivo_notificacion', files)}
                    onUpload={onFileUpload}
                    documentKey={`${docKeyPrefix}.notificacion.archivo_notificacion`}
                    anteproyectoId={gestionId}
                    uploadedFiles={uploadedDocuments
                      .filter(doc => doc.key === `${docKeyPrefix}.notificacion.archivo_notificacion`)
                      .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                    onDownload={onDownloadDocument}
                  />
                </div>

                {/* Subsanación de Notificación */}
                <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                  <h5 className="font-medium text-orange-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Subsanación de Observaciones de Notificación
                  </h5>
                  <p className="text-sm text-orange-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Cargue los documentos que subsanan las observaciones indicadas en la notificación.
                  </p>
                  
                  <FileUpload
                    label="Documentos de Subsanación (Notificación)"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(files) => updateNotificacion('documentos_subsanacion_notificacion', files)}
                    onUpload={onFileUpload}
                    documentKey={`${docKeyPrefix}.notificacion.documentos_subsanacion`}
                    anteproyectoId={gestionId}
                    uploadedFiles={uploadedDocuments
                      .filter(doc => doc.key === `${docKeyPrefix}.notificacion.documentos_subsanacion`)
                      .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                    onDownload={onDownloadDocument}
                  />

                  <div className="mt-3 flex items-center gap-2">
                    <Switch
                      isSelected={revisionActual.notificacion?.subsanacion_completada || false}
                      onValueChange={(value: boolean) => updateNotificacion('subsanacion_completada', value)}
                    />
                    <span className="text-sm text-gray-700">Subsanación de notificación completada</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FLUJO B: Evaluación del Acta */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Evaluación del Acta
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DateInput
                label="Fecha de Respuesta de la Municipalidad"
                required
                value={revisionActual.fecha_respuesta || ''}
                onChange={(value) => {
                  updateRevisionActual({ fecha_respuesta: value });
                  onInputChange('fecha_respuesta', value); // Compatibilidad legacy
                }}
                error={errors.fecha_respuesta}
              />

              <FileUpload
                label="Archivo del Acta"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(files) => updateRevisionActual({ archivo_acta: files })}
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.archivo_acta`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments
                  .filter(doc => doc.key === `${docKeyPrefix}.archivo_acta` || doc.key === 'seguimiento_respuesta.archivo_respuesta')
                  .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
                error={errors.archivo_respuesta}
              />
            </div>

            {/* Resultado del Acta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resultado del Acta <span className="text-red-500">*</span>
              </label>
              
              {/* Mensaje de requisitos si no se puede seleccionar */}
              {!puedeSeleccionarResultado && !revisionActual.resultado_acta && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <LuInfo className="w-4 h-4 inline mr-1" />
                    Para seleccionar el resultado, primero debe:
                  </p>
                  <ul className="text-sm text-blue-600 mt-1 ml-5 list-disc">
                    {(!revisionActual.fecha_respuesta || revisionActual.fecha_respuesta.trim() === '') && (
                      <li>Ingresar la fecha de respuesta de la municipalidad</li>
                    )}
                    {!tieneArchivoActa && (
                      <li>Cargar el archivo del acta</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Mensaje de error de validación */}
              {validationError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <LuTriangle className="w-4 h-4 inline mr-1" />
                    {validationError}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  variant={revisionActual.resultado_acta === 'conforme' ? 'solid' : 'bordered'}
                  onClick={() => handleResultadoActaChange('conforme')}
                  startContent={<LuCheck className="w-4 h-4" />}
                  style={revisionActual.resultado_acta === 'conforme' ? { backgroundColor: '#10b981' } : {}}
                  className={`${revisionActual.resultado_acta === 'conforme' ? 'text-white' : 'text-green-600 border-green-600 hover:bg-green-50'} ${!puedeSeleccionarResultado && !revisionActual.resultado_acta ? 'opacity-60' : ''}`}
                >
                  Conforme
                </Button>
                <Button
                  variant={revisionActual.resultado_acta === 'no_conforme' ? 'solid' : 'bordered'}
                  onClick={() => handleResultadoActaChange('no_conforme')}
                  startContent={<LuX className="w-4 h-4" />}
                  style={revisionActual.resultado_acta === 'no_conforme' ? { backgroundColor: '#ef4444' } : {}}
                  className={`${revisionActual.resultado_acta === 'no_conforme' ? 'text-white' : 'text-red-600 border-red-600 hover:bg-red-50'} ${!puedeSeleccionarResultado && !revisionActual.resultado_acta ? 'opacity-60' : ''}`}
                >
                  No Conforme
                </Button>
                
                {/* Botón para limpiar selección */}
                {revisionActual.resultado_acta && (
                  <Button
                    variant="bordered"
                    onClick={handleLimpiarResultado}
                    startContent={<LuRotateCcw className="w-4 h-4" />}
                    className="text-gray-600 border-gray-400 hover:bg-gray-50"
                    size="sm"
                  >
                    Limpiar selección
                  </Button>
                )}
              </div>
              
              {/* Mensaje de ayuda */}
              {revisionActual.resultado_acta && (
                <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Puede hacer clic en el mismo botón o en "Limpiar selección" para cambiar su respuesta.
                </p>
              )}
              
              {errors.resultado_acta && (
                <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {errors.resultado_acta}
                </p>
              )}
            </div>
          </div>

          {/* Sección de No Conforme */}
          {revisionActual.resultado_acta === 'no_conforme' && (
            <div className="mt-6 space-y-4">
              {/* Alerta de revisión utilizada */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <LuTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Revisión {revisionActual.numero_revision} de {MAX_REVISIONES} utilizada
                  </span>
                </div>
                {revisionActual.numero_revision >= MAX_REVISIONES && (
                  <p className="text-sm text-red-700 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Esta es la última oportunidad de revisión. Si no se obtiene conformidad, el proceso será declarado improcedente.
                  </p>
                )}
              </div>

              {/* FLUJO C: Proceso de Reconsideración */}
              <ProcesoRecurso
                tipo="reconsideracion"
                data={revisionActual.reconsideracion || createEmptyRecurso()}
                gestionId={gestionId}
                revisionIndex={revisionActualIndex}
                uploadedDocuments={uploadedDocuments}
                onToggle={(habilitado) => updateReconsideracion('habilitado', habilitado)}
                onChange={updateReconsideracion}
                onFileUpload={onFileUpload}
                onDownloadDocument={onDownloadDocument}
              />

              {/* FLUJO D: Proceso de Apelación */}
              <ProcesoRecurso
                tipo="apelacion"
                data={revisionActual.apelacion || createEmptyRecurso()}
                gestionId={gestionId}
                revisionIndex={revisionActualIndex}
                uploadedDocuments={uploadedDocuments}
                onToggle={(habilitado) => updateApelacion('habilitado', habilitado)}
                onChange={updateApelacion}
                onFileUpload={onFileUpload}
                onDownloadDocument={onDownloadDocument}
              />

              {/* Sección de Subsanación de Observaciones */}
              {requiereSubsanacion && (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg space-y-4">
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Sección de Subsanación de Observaciones
                      <span className="text-red-500 ml-1">*</span>
                    </h4>
                    <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Plazo para subsanar: 15 días hábiles desde la fecha de notificación.
                      {revisionActual.reconsideracion?.resultado === 'fundado_en_parte' && (
                        <span className="block mt-1 font-medium">
                          Solo debe subsanar las observaciones no reconsideradas.
                        </span>
                      )}
                    </p>
                  </div>

                  <FileUpload
                    label="Documentos de Subsanación"
                    required
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(files) => updateRevisionActual({ documentos_subsanacion: files })}
                    onUpload={onFileUpload}
                    documentKey={`${docKeyPrefix}.documentos_subsanacion`}
                    anteproyectoId={gestionId}
                    uploadedFiles={uploadedDocuments
                      .filter(doc => doc.key === `${docKeyPrefix}.documentos_subsanacion` || doc.key === 'seguimiento_respuesta.documentos_subsanacion')
                      .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                    onDownload={onDownloadDocument}
                  />

                  <div className="flex items-center gap-2">
                    <Switch
                      isSelected={revisionActual.subsanacion_completada || false}
                      onValueChange={(value: boolean) => updateRevisionActual({ subsanacion_completada: value })}
                    />
                    <span className="text-sm text-gray-700">Subsanación completada</span>
                  </div>
                </div>
              )}

              {/* Botón para crear nueva revisión */}
              {puedeCrearNuevaRevision && revisionActual.numero_revision < MAX_REVISIONES && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleCrearNuevaRevision}
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className="text-white hover:opacity-90"
                    startContent={<LuPlus className="w-4 h-4" />}
                  >
                    Crear Nueva Revisión ({revisionActual.numero_revision + 1} de {MAX_REVISIONES})
                  </Button>
                  <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Al crear una nueva revisión, la actual se marcará como completada y podrá iniciar un nuevo ciclo de evaluación.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mensaje de éxito para resultado conforme */}
          {revisionActual.resultado_acta === 'conforme' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <LuCheck className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Anteproyecto Conforme
                </h4>
              </div>
              <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                El anteproyecto ha sido aprobado por la municipalidad en la revisión {revisionActual.numero_revision}. 
                Puede proceder con la entrega de documentos finales.
              </p>

              {/* Sección de Documentación Final */}
              <div className="mt-4 pt-4 border-t border-green-200">
                <h5 className="font-medium text-green-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Carga de Documentación Final Aprobada
                </h5>
                <p className="text-sm text-green-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Puede cargar aquí los documentos finales aprobados o continuar al siguiente paso para completar la entrega.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
