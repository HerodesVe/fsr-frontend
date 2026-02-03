import { useState, useMemo, useCallback } from 'react';
import { LuCheck, LuX, LuInfo, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { DateInput, FileUpload, Button, Switch } from '@/components/ui';
import { generateDocumentKey } from '@/services/gestionProyectos.service';
import type { 
  RevisionEspecialidadData, 
  ProcesoRecursoProyectoData, 
  NotificacionProyectoData,
  ResultadoRecursoProyecto,
  TipoEspecialidad 
} from '@/types/gestionProyecto.types';

interface RevisionFormProps {
  revision: RevisionEspecialidadData;
  especialidadKey: TipoEspecialidad;
  gestionId: string;
  numeroRevisionLocal: number;
  numeroRevisionGlobal: number;
  revisionesGlobalesUsadas: number;
  limiteEspecialidad: number;
  uploadedDocuments: any[];
  readOnly?: boolean;
  onRevisionChange: (updates: Partial<RevisionEspecialidadData>) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onDownloadDocument?: (documentKey: string) => void;
}

// Componente para proceso de recurso (Reconsideración/Apelación)
interface ProcesoRecursoFormProps {
  tipo: 'reconsideracion' | 'apelacion';
  data: ProcesoRecursoProyectoData;
  especialidadKey: TipoEspecialidad;
  revisionIndex: number;
  disabled: boolean;
  uploadedDocuments: any[];
  onToggle: (habilitado: boolean) => void;
  onChange: (updates: Partial<ProcesoRecursoProyectoData>) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

function ProcesoRecursoForm({
  tipo,
  data,
  especialidadKey,
  revisionIndex,
  disabled,
  uploadedDocuments,
  onToggle,
  onChange,
  onFileUpload,
}: ProcesoRecursoFormProps) {
  const [expanded, setExpanded] = useState(data.habilitado);
  
  const titulo = tipo === 'reconsideracion' ? 'Proceso de Reconsideración' : 'Proceso de Apelación';
  
  // Usar el formato de key del backend: {especialidad}_rev{numero}_{tipo_documento}
  const docKeyDocumento = generateDocumentKey(
    especialidadKey, 
    revisionIndex, 
    tipo === 'reconsideracion' ? 'reconsideracion_documento' : 'apelacion_documento'
  );
  const docKeyResolucion = generateDocumentKey(
    especialidadKey, 
    revisionIndex, 
    tipo === 'reconsideracion' ? 'reconsideracion_resolucion' : 'apelacion_resolucion'
  );

  const handleResultadoChange = (resultado: ResultadoRecursoProyecto) => {
    if (disabled) return;
    onChange({ resultado: data.resultado === resultado ? null : resultado });
  };

  const requiereSubsanacion = data.resultado === 'infundado' || data.resultado === 'fundado_en_parte';

  return (
    <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Switch
            isSelected={data.habilitado}
            onValueChange={(checked) => {
              if (disabled) return;
              onToggle(checked);
              setExpanded(checked);
            }}
            isDisabled={disabled}
          />
          <h6 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            {titulo} {data.habilitado ? '(Activo)' : '(Opcional)'}
          </h6>
        </div>
        <div className="flex items-center gap-2">
          {data.resultado && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              data.resultado === 'fundado' ? 'bg-green-100 text-green-800' :
              data.resultado === 'infundado' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {data.resultado === 'fundado' ? 'Fundado' : 
               data.resultado === 'infundado' ? 'Infundado' : 'Fundado en Parte'}
            </span>
          )}
          {expanded ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && data.habilitado && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DateInput
              label="Fecha de Presentación"
              value={data.fecha_presentacion || ''}
              onChange={(value) => onChange({ fecha_presentacion: value })}
              disabled={disabled}
            />

            <FileUpload
              label={`Documento de ${tipo === 'reconsideracion' ? 'Reconsideración' : 'Apelación'}`}
              accept=".pdf,.doc,.docx"
              multiple={false}
              disabled={disabled}
              uploadedFiles={uploadedDocuments}
              documentKey={docKeyDocumento}
              onChange={async (files: File[]) => {
                if (files.length > 0 && !disabled) {
                  try {
                    await onFileUpload(files[0], docKeyDocumento);
                    onChange({ documento_recurso: files });
                  } catch (error) {
                    console.error('Error uploading file:', error);
                  }
                }
              }}
            />

            <FileUpload
              label="Resolución del Recurso"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={false}
              disabled={disabled}
              uploadedFiles={uploadedDocuments}
              documentKey={docKeyResolucion}
              onChange={async (files: File[]) => {
                if (files.length > 0 && !disabled) {
                  try {
                    await onFileUpload(files[0], docKeyResolucion);
                    onChange({ resolucion_recurso: files });
                  } catch (error) {
                    console.error('Error uploading file:', error);
                  }
                }
              }}
            />
          </div>

          {/* Botones de resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Resultado del Recurso
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={data.resultado === 'fundado' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoChange('fundado')}
                disabled={disabled}
                style={data.resultado === 'fundado' ? { backgroundColor: '#10b981' } : {}}
                className={data.resultado === 'fundado' ? 'text-white' : 'text-green-600 border-green-600 hover:bg-green-50'}
              >
                Fundado
              </Button>
              <Button
                size="sm"
                variant={data.resultado === 'infundado' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoChange('infundado')}
                disabled={disabled}
                style={data.resultado === 'infundado' ? { backgroundColor: '#ef4444' } : {}}
                className={data.resultado === 'infundado' ? 'text-white' : 'text-red-600 border-red-600 hover:bg-red-50'}
              >
                Infundado
              </Button>
              <Button
                size="sm"
                variant={data.resultado === 'fundado_en_parte' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoChange('fundado_en_parte')}
                disabled={disabled}
                style={data.resultado === 'fundado_en_parte' ? { backgroundColor: '#f59e0b' } : {}}
                className={data.resultado === 'fundado_en_parte' ? 'text-white' : 'text-yellow-600 border-yellow-600 hover:bg-yellow-50'}
              >
                Fundado en Parte
              </Button>
            </div>
          </div>

          {/* Mensaje contextual según resultado */}
          {data.resultado === 'fundado' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                El recurso fue aceptado. La especialidad puede proceder a aprobación.
              </p>
            </div>
          )}
          {requiereSubsanacion && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                <LuInfo className="inline w-4 h-4 mr-1" />
                {data.resultado === 'infundado' 
                  ? 'El recurso fue rechazado. Se requiere subsanación completa para continuar.'
                  : 'El recurso fue parcialmente aceptado. Se requiere subsanar las observaciones no reconsideradas.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RevisionForm({
  revision,
  especialidadKey,
  numeroRevisionLocal,
  numeroRevisionGlobal,
  uploadedDocuments,
  readOnly = false,
  onRevisionChange,
  onFileUpload,
}: RevisionFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Usar el formato de key del backend: {especialidad}_rev{numero}_{tipo_documento}
  const docKeyNotificacion = generateDocumentKey(especialidadKey, numeroRevisionLocal, 'notificacion');
  const docKeySubsanacionNotificacion = generateDocumentKey(especialidadKey, numeroRevisionLocal, 'subsanacion_notificacion');
  const docKeyActa = generateDocumentKey(especialidadKey, numeroRevisionLocal, 'acta');
  const docKeySubsanacion = generateDocumentKey(especialidadKey, numeroRevisionLocal, 'subsanacion');

  // Verificar si tiene archivo de acta
  const tieneArchivoActa = useMemo(() => {
    const archivoSubido = uploadedDocuments.some(
      doc => doc.key === docKeyActa || doc.name?.includes(`acta_${especialidadKey}`)
    );
    return archivoSubido || (revision.archivo_acta && revision.archivo_acta.length > 0);
  }, [uploadedDocuments, revision.archivo_acta, docKeyActa, especialidadKey]);

  // Verificar si puede seleccionar resultado
  const puedeSeleccionarResultado = useMemo(() => {
    return revision.fecha_respuesta && revision.fecha_respuesta.length === 10 && tieneArchivoActa;
  }, [revision.fecha_respuesta, tieneArchivoActa]);

  // Calcular si requiere subsanación
  const requiereSubsanacion = useMemo(() => {
    if (revision.resultado_acta !== 'no_conforme') return false;
    
    // Si recurso fundado, no requiere subsanación
    if (revision.reconsideracion?.resultado === 'fundado') return false;
    if (revision.apelacion?.resultado === 'fundado') return false;
    
    return true;
  }, [revision.resultado_acta, revision.reconsideracion?.resultado, revision.apelacion?.resultado]);

  // Handler para cambiar resultado del acta
  const handleResultadoActaChange = useCallback((resultado: 'conforme' | 'no_conforme') => {
    if (readOnly) return;
    
    // Validar requisitos
    if (!puedeSeleccionarResultado) {
      setValidationError('Debe completar la fecha de respuesta y cargar el archivo del acta antes de seleccionar un resultado.');
      return;
    }

    setValidationError(null);

    // Toggle si es el mismo valor
    if (revision.resultado_acta === resultado) {
      onRevisionChange({
        resultado_acta: null,
        estado: 'en_progreso'
      });
      return;
    }

    // Actualizar resultado
    const newEstado = resultado === 'conforme' ? 'completada' : 'en_progreso';
    onRevisionChange({
      resultado_acta: resultado,
      estado: newEstado
    });
  }, [readOnly, puedeSeleccionarResultado, revision.resultado_acta, onRevisionChange]);

  // Handler para notificación
  const handleNotificacionChange = useCallback((updates: Partial<NotificacionProyectoData>) => {
    if (readOnly) return;
    onRevisionChange({
      notificacion: {
        ...(revision.notificacion || { tiene_notificacion: false }),
        ...updates
      }
    });
  }, [readOnly, revision.notificacion, onRevisionChange]);

  // Handler para reconsideración
  const handleReconsideracionChange = useCallback((updates: Partial<ProcesoRecursoProyectoData>) => {
    if (readOnly) return;
    onRevisionChange({
      reconsideracion: {
        ...(revision.reconsideracion || { habilitado: false }),
        ...updates
      }
    });
  }, [readOnly, revision.reconsideracion, onRevisionChange]);

  // Handler para apelación
  const handleApelacionChange = useCallback((updates: Partial<ProcesoRecursoProyectoData>) => {
    if (readOnly) return;
    onRevisionChange({
      apelacion: {
        ...(revision.apelacion || { habilitado: false }),
        ...updates
      }
    });
  }, [readOnly, revision.apelacion, onRevisionChange]);

  return (
    <div className="space-y-6">
      {/* Header de la revisión */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Revisión #{numeroRevisionLocal}
          </h5>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Revisión Global #{numeroRevisionGlobal} • Creada: {revision.fecha_creacion}
          </p>
        </div>
        {revision.estado === 'completada' && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <LuCheck className="inline w-4 h-4 mr-1" /> Completada
          </span>
        )}
        {revision.estado === 'improcedente' && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            <LuX className="inline w-4 h-4 mr-1" /> Improcedente
          </span>
        )}
      </div>

      {/* Flujo A: Notificación Previa */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h6 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            ¿Se emitió Notificación o Carta de observaciones?
          </h6>
          <Switch
            isSelected={revision.notificacion?.tiene_notificacion || false}
            onValueChange={(checked) => handleNotificacionChange({ tiene_notificacion: checked })}
            isDisabled={readOnly}
          />
        </div>

        {revision.notificacion?.tiene_notificacion && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput
                label="Fecha de Notificación"
                value={revision.notificacion.fecha_notificacion || ''}
                onChange={(value) => handleNotificacionChange({ fecha_notificacion: value })}
                disabled={readOnly}
              />
              <FileUpload
                label="Archivo de Notificación/Carta"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={false}
                disabled={readOnly}
                uploadedFiles={uploadedDocuments}
                documentKey={docKeyNotificacion}
                onChange={async (files: File[]) => {
                  if (files.length > 0 && !readOnly) {
                    try {
                      await onFileUpload(files[0], docKeyNotificacion);
                      handleNotificacionChange({ archivo_notificacion: files });
                    } catch (error) {
                      console.error('Error uploading file:', error);
                    }
                  }
                }}
              />
            </div>

            {/* Subsanación de Notificación */}
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
              <h6 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Subsanación de Observaciones de Notificación
              </h6>
              <FileUpload
                label="Documentos de Subsanación"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={true}
                disabled={readOnly}
                uploadedFiles={uploadedDocuments}
                documentKey={docKeySubsanacionNotificacion}
                onChange={async (files: File[]) => {
                  if (files.length > 0 && !readOnly) {
                    try {
                      const uploadPromises = files.map(file => 
                        onFileUpload(file, docKeySubsanacionNotificacion)
                      );
                      await Promise.all(uploadPromises);
                      handleNotificacionChange({ 
                        documentos_subsanacion_notificacion: files,
                        subsanacion_completada: true 
                      });
                    } catch (error) {
                      console.error('Error uploading files:', error);
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Flujo B: Evaluación del Acta */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h6 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
          Evaluación del Acta de Respuesta
        </h6>

        {/* Mensaje de validación */}
        {!puedeSeleccionarResultado && !readOnly && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <LuInfo className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Complete la fecha de respuesta y cargue el archivo del acta para poder seleccionar el resultado.
              </p>
            </div>
          </div>
        )}

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <LuInfo className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                {validationError}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <DateInput
            label="Fecha de Respuesta"
            value={revision.fecha_respuesta || ''}
            onChange={(value) => onRevisionChange({ fecha_respuesta: value })}
            disabled={readOnly}
            required
          />

          <FileUpload
            label="Archivo del Acta/Respuesta"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={false}
            disabled={readOnly}
            uploadedFiles={uploadedDocuments}
            documentKey={docKeyActa}
            onChange={async (files: File[]) => {
              if (files.length > 0 && !readOnly) {
                try {
                  await onFileUpload(files[0], docKeyActa);
                  onRevisionChange({ archivo_acta: files });
                } catch (error) {
                  console.error('Error uploading file:', error);
                }
              }
            }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Resultado del Acta <span className="text-red-500">*</span>
            </label>
            <div className={`flex gap-2 ${!puedeSeleccionarResultado && !readOnly ? 'opacity-50' : ''}`}>
              <Button
                size="sm"
                variant={revision.resultado_acta === 'conforme' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoActaChange('conforme')}
                disabled={readOnly}
                startContent={<LuCheck className="w-4 h-4" />}
                style={revision.resultado_acta === 'conforme' ? { backgroundColor: '#10b981' } : {}}
                className={revision.resultado_acta === 'conforme' ? 'text-white' : 'text-green-600 border-green-600 hover:bg-green-50'}
              >
                Conforme
              </Button>
              <Button
                size="sm"
                variant={revision.resultado_acta === 'no_conforme' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoActaChange('no_conforme')}
                disabled={readOnly}
                startContent={<LuX className="w-4 h-4" />}
                style={revision.resultado_acta === 'no_conforme' ? { backgroundColor: '#ef4444' } : {}}
                className={revision.resultado_acta === 'no_conforme' ? 'text-white' : 'text-red-600 border-red-600 hover:bg-red-50'}
              >
                No Conforme
              </Button>
            </div>
          </div>
        </div>

        {/* Botón para limpiar selección */}
        {revision.resultado_acta && !readOnly && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="light"
              onClick={() => onRevisionChange({ resultado_acta: null, estado: 'en_progreso' })}
              className="text-gray-500 hover:text-gray-700"
            >
              Limpiar selección
            </Button>
          </div>
        )}
      </div>

      {/* Sección de No Conforme */}
      {revision.resultado_acta === 'no_conforme' && (
        <div className="space-y-4">
          {/* Subsanación de Observaciones */}
          {requiereSubsanacion && (
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg space-y-4">
              <div>
                <h6 className="font-medium text-yellow-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Sección de Subsanación (Obligatorio)
                </h6>
                <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plazo para subsanar: 15 días hábiles desde la fecha de notificación.
                </p>
              </div>

              <FileUpload
                label={`Documentos de Subsanación (Revisión ${numeroRevisionLocal})`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={true}
                disabled={readOnly}
                uploadedFiles={uploadedDocuments}
                documentKey={docKeySubsanacion}
                onChange={async (files: File[]) => {
                  if (files.length > 0 && !readOnly) {
                    try {
                      const uploadPromises = files.map(file => 
                        onFileUpload(file, docKeySubsanacion)
                      );
                      await Promise.all(uploadPromises);
                      onRevisionChange({ 
                        documentos_subsanacion: files,
                        subsanacion_completada: true 
                      });
                    } catch (error) {
                      console.error('Error uploading files:', error);
                    }
                  }
                }}
              />

              {revision.subsanacion_completada && (
                <div className="p-2 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center gap-1">
                    <LuCheck className="w-4 h-4" /> Subsanación completada
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Flujo C: Reconsideración */}
          <ProcesoRecursoForm
            tipo="reconsideracion"
            data={revision.reconsideracion || { habilitado: false }}
            especialidadKey={especialidadKey}
            revisionIndex={numeroRevisionLocal}
            disabled={readOnly}
            uploadedDocuments={uploadedDocuments}
            onToggle={(habilitado) => handleReconsideracionChange({ habilitado })}
            onChange={handleReconsideracionChange}
            onFileUpload={onFileUpload}
          />

          {/* Flujo D: Apelación */}
          <ProcesoRecursoForm
            tipo="apelacion"
            data={revision.apelacion || { habilitado: false }}
            especialidadKey={especialidadKey}
            revisionIndex={numeroRevisionLocal}
            disabled={readOnly}
            uploadedDocuments={uploadedDocuments}
            onToggle={(habilitado) => handleApelacionChange({ habilitado })}
            onChange={handleApelacionChange}
            onFileUpload={onFileUpload}
          />
        </div>
      )}
    </div>
  );
}
