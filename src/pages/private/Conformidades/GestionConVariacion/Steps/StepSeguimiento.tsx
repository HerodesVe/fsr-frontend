import { useState, useMemo, useCallback, useEffect } from 'react';
import { LuInfo, LuCheck, LuX, LuPlus, LuTriangle, LuFileText, LuRotateCcw } from 'react-icons/lu';
import { DateInput, FileUpload, Button, Switch } from '@/components/ui';
import type { 
  ConformidadConVariacionFormData, 
  UploadedDocument, 
  RevisionConformidad,
} from '@/types/conformidad.types';

const MAX_REVISIONES = 4;

interface StepSeguimientoProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Función para crear una nueva revisión vacía
const createEmptyRevision = (numeroRevision: number): RevisionConformidad => ({
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

export default function StepSeguimiento({
  formData,
  errors,
  conformidadId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepSeguimientoProps) {
  
  // Inicializar revisiones si no existen
  useEffect(() => {
    if (!formData.revisiones || formData.revisiones.length === 0) {
      onInputChange('revisiones', [createEmptyRevision(1)]);
    }
  }, []);

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
    
    if (ultimaRevision.resultado_acta !== 'no_conforme') return false;
    
    const recursoFundado = 
      ultimaRevision.reconsideracion?.resultado === 'fundado' ||
      ultimaRevision.apelacion?.resultado === 'fundado';
    
    if (recursoFundado) return true;
    
    return ultimaRevision.subsanacion_completada === true;
  }, [revisiones, estadoSeguimiento]);

  // Revisiones anteriores
  const revisionesAnteriores = useMemo(() => {
    return revisiones.slice(0, -1);
  }, [revisiones]);

  // Actualizar revisión actual
  const updateRevisionActual = useCallback((updates: Partial<RevisionConformidad>) => {
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

  // Document key prefix
  const docKeyPrefix = `seguimiento.revision_${revisionActualIndex}`;

  // Estado para mensaje de validación
  const [validationError, setValidationError] = useState<string | null>(null);

  // Verificar si tiene archivo de acta
  const tieneArchivoActa = useMemo(() => {
    return uploadedDocuments.some(doc => 
      doc.key === `${docKeyPrefix}.archivo_acta`
    );
  }, [uploadedDocuments, docKeyPrefix]);

  const puedeSeleccionarResultado = useMemo(() => {
    const tieneFecha = !!revisionActual.fecha_respuesta && revisionActual.fecha_respuesta.trim() !== '';
    return tieneFecha && tieneArchivoActa;
  }, [revisionActual.fecha_respuesta, tieneArchivoActa]);

  // Manejar cambio de resultado
  const handleResultadoActaChange = useCallback((resultado: 'conforme' | 'no_conforme') => {
    if (revisionActual.resultado_acta === resultado) {
      updateRevisionActual({
        resultado_acta: null,
        estado: 'en_progreso'
      });
      onInputChange('estado_seguimiento', 'en_proceso');
      setValidationError(null);
      return;
    }

    if (!revisionActual.fecha_respuesta || revisionActual.fecha_respuesta.trim() === '') {
      setValidationError('Debe ingresar la fecha de respuesta antes de seleccionar el resultado.');
      return;
    }

    if (!tieneArchivoActa) {
      setValidationError('Debe cargar el archivo del acta antes de seleccionar el resultado.');
      return;
    }

    setValidationError(null);
    
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
  }, [updateRevisionActual, revisionActual.resultado_acta, revisionActual.fecha_respuesta, tieneArchivoActa, onInputChange]);

  // Crear nueva revisión
  const handleCrearNuevaRevision = useCallback(() => {
    if (!puedeCrearNuevaRevision) return;
    
    const nuevasRevisiones = [...revisiones];
    nuevasRevisiones[revisionActualIndex] = {
      ...nuevasRevisiones[revisionActualIndex],
      estado: 'completada',
    };
    
    const nuevaRevision = createEmptyRevision(revisiones.length + 1);
    nuevasRevisiones.push(nuevaRevision);
    
    onInputChange('revisiones', nuevasRevisiones);
    onInputChange('revision_actual_index', nuevasRevisiones.length - 1);
  }, [puedeCrearNuevaRevision, revisiones, revisionActualIndex, onInputChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 9: Seguimiento y Respuesta
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre la respuesta de la municipalidad y gestione el levantamiento de observaciones.
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
            Se han agotado las {MAX_REVISIONES} oportunidades de revisión sin obtener conformidad.
          </p>
        </div>
      )}

      {estadoSeguimiento === 'conforme' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LuCheck className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Conformidad Aprobada
            </h4>
          </div>
          <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            La conformidad de obra ha sido aprobada. Puede proceder con la presentación de copias.
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
          La municipalidad tiene un plazo de 5 días hábiles para emitir respuesta.
          Máximo {MAX_REVISIONES} oportunidades de revisión.
        </p>
      </div>

      {/* Historial de revisiones anteriores */}
      {revisionesAnteriores.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Historial de Revisiones
          </h4>
          <div className="space-y-2">
            {revisionesAnteriores.map((rev, index) => (
              <div key={rev.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    rev.resultado_acta === 'conforme' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {rev.resultado_acta === 'conforme' ? <LuCheck size={16} /> : <LuX size={16} />}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Revisión {rev.numero_revision}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {rev.fecha_respuesta ? new Date(rev.fecha_respuesta).toLocaleDateString('es-PE') : 'Sin fecha'}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rev.resultado_acta === 'conforme' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {rev.resultado_acta === 'conforme' ? 'Conforme' : 'No Conforme'}
                </span>
              </div>
            ))}
          </div>
        </div>
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

          {/* Evaluación del Acta */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Evaluación del Acta
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DateInput
                label="Fecha de Respuesta de la Municipalidad"
                required
                value={revisionActual.fecha_respuesta || ''}
                onChange={(value) => updateRevisionActual({ fecha_respuesta: value })}
                error={errors.fecha_respuesta}
              />

              <FileUpload
                label="Archivo del Acta"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(files) => updateRevisionActual({ archivo_acta: files })}
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.archivo_acta`}
                anteproyectoId={conformidadId}
                uploadedFiles={uploadedDocuments
                  .filter(doc => doc.key === `${docKeyPrefix}.archivo_acta`)
                  .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />
            </div>

            {/* Resultado del Acta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resultado del Acta <span className="text-red-500">*</span>
              </label>
              
              {!puedeSeleccionarResultado && !revisionActual.resultado_acta && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <LuInfo className="w-4 h-4 inline mr-1" />
                    Para seleccionar el resultado, primero debe ingresar la fecha y cargar el archivo del acta.
                  </p>
                </div>
              )}

              {validationError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <LuTriangle className="w-4 h-4 inline mr-1" />
                    {validationError}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Button
                  variant={revisionActual.resultado_acta === 'conforme' ? 'solid' : 'bordered'}
                  onClick={() => handleResultadoActaChange('conforme')}
                  startContent={<LuCheck className="w-4 h-4" />}
                  style={revisionActual.resultado_acta === 'conforme' ? { backgroundColor: '#10b981' } : {}}
                  className={`${revisionActual.resultado_acta === 'conforme' ? 'text-white' : 'text-green-600 border-green-600 hover:bg-green-50'}`}
                >
                  Conforme
                </Button>
                <Button
                  variant={revisionActual.resultado_acta === 'no_conforme' ? 'solid' : 'bordered'}
                  onClick={() => handleResultadoActaChange('no_conforme')}
                  startContent={<LuX className="w-4 h-4" />}
                  style={revisionActual.resultado_acta === 'no_conforme' ? { backgroundColor: '#ef4444' } : {}}
                  className={`${revisionActual.resultado_acta === 'no_conforme' ? 'text-white' : 'text-red-600 border-red-600 hover:bg-red-50'}`}
                >
                  No Conforme
                </Button>
              </div>
            </div>
          </div>

          {/* Sección de No Conforme */}
          {revisionActual.resultado_acta === 'no_conforme' && (
            <div className="mt-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <LuTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Revisión {revisionActual.numero_revision} de {MAX_REVISIONES} utilizada
                  </span>
                </div>
              </div>

              {/* Subsanación */}
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg space-y-4">
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Sección de Subsanación de Observaciones
                  </h4>
                  <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Plazo para subsanar: 15 días hábiles desde la fecha de notificación.
                  </p>
                </div>

                <FileUpload
                  label="Documentos de Subsanación"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(files) => updateRevisionActual({ documentos_subsanacion: files })}
                  onUpload={onFileUpload}
                  documentKey={`${docKeyPrefix}.documentos_subsanacion`}
                  anteproyectoId={conformidadId}
                  uploadedFiles={uploadedDocuments
                    .filter(doc => doc.key === `${docKeyPrefix}.documentos_subsanacion`)
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
                </div>
              )}
            </div>
          )}

          {/* Mensaje de éxito */}
          {revisionActual.resultado_acta === 'conforme' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <LuCheck className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Conformidad Aprobada
                </h4>
              </div>
              <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                La conformidad de obra ha sido aprobada en la revisión {revisionActual.numero_revision}. 
                Puede proceder con la presentación de copias.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
