import { useState } from 'react';
import { LuCheck, LuX, LuClock, LuLock, LuInfo } from 'react-icons/lu';
import { DateInput, FileUpload, Button } from '@/components/ui';
import type { GestionProyectoFormData, EspecialidadData } from '@/types/gestionProyecto.types';

interface StepGestionEspecialidadesProps {
  formData: GestionProyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

interface EspecialidadComponentProps {
  nombre: string;
  especialidadKey: keyof GestionProyectoFormData['especialidades'];
  data: EspecialidadData;
  isEnabled: boolean;
  onDataChange: (data: EspecialidadData) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

function EspecialidadComponent({
  nombre,
  especialidadKey,
  data,
  isEnabled,
  onDataChange,
  onFileUpload
}: EspecialidadComponentProps) {
  const [mostrarReconsideracion, setMostrarReconsideracion] = useState(false);

  const handleResultadoChange = (resultado: 'conforme' | 'no_conforme') => {
    const newData = {
      ...data,
      resultado_acta: resultado,
      es_conforme: resultado === 'conforme'
    };
    
    if (resultado === 'no_conforme') {
      newData.revision_count = data.revision_count + 1;
    }
    
    onDataChange(newData);
  };

  if (!isEnabled) {
    return (
      <div className="p-4 rounded-lg bg-gray-100 opacity-50">
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
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-bold text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestión de {nombre}
        </h4>
        {data.es_conforme && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <LuCheck className="w-4 h-4" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Aprobada
            </span>
          </div>
        )}
      </div>

      {/* Información de revisiones */}
      {data.revision_count > 0 && (
        <div className={`mb-4 p-3 rounded-lg ${
          data.revision_count >= 3 
            ? 'bg-red-100 border-l-4 border-red-500' 
            : 'bg-yellow-100 border-l-4 border-yellow-500'
        }`}>
          <div className="flex items-center gap-2">
            <LuInfo className={`w-4 h-4 ${data.revision_count >= 3 ? 'text-red-600' : 'text-yellow-600'}`} />
            <span className={`text-sm font-medium ${data.revision_count >= 3 ? 'text-red-800' : 'text-yellow-800'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
              Revisión #{data.revision_count + 1} 
              {data.revision_count >= 2 && ' - Se requiere pago adicional'}
            </span>
          </div>
          <p className={`text-xs mt-1 ${data.revision_count >= 3 ? 'text-red-700' : 'text-yellow-700'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            Máximo 8 oportunidades de subsanación disponibles.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <DateInput
          label="Fecha de Respuesta"
          value={data.fecha_respuesta || ''}
          onChange={(value) => onDataChange({ ...data, fecha_respuesta: value })}
        />

        <div>
          <FileUpload
            label="Archivo del Acta/Respuesta"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={false}
            onChange={async (files: File[]) => {
              if (files.length > 0) {
                try {
                  await onFileUpload(files[0], `archivo_respuesta_${especialidadKey}`);
                  onDataChange({ ...data, archivo_respuesta: files });
                } catch (error) {
                  console.error('Error uploading file:', error);
                }
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Resultado del Acta
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={data.resultado_acta === 'conforme' ? 'solid' : 'bordered'}
              onClick={() => handleResultadoChange('conforme')}
              startContent={<LuCheck className="w-4 h-4" />}
              style={data.resultado_acta === 'conforme' ? { backgroundColor: '#10b981' } : {}}
              className={data.resultado_acta === 'conforme' ? 'text-white' : 'text-green-600 border-green-600 hover:bg-green-50'}
            >
              Conforme
            </Button>
            <Button
              size="sm"
              variant={data.resultado_acta === 'no_conforme' ? 'solid' : 'bordered'}
              onClick={() => handleResultadoChange('no_conforme')}
              startContent={<LuX className="w-4 h-4" />}
              style={data.resultado_acta === 'no_conforme' ? { backgroundColor: '#ef4444' } : {}}
              className={data.resultado_acta === 'no_conforme' ? 'text-white' : 'text-red-600 border-red-600 hover:bg-red-50'}
            >
              No Conforme
            </Button>
          </div>
        </div>
      </div>

      {/* Sección de Subsanación */}
      {data.resultado_acta === 'no_conforme' && (
        <div className="mt-6 border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg space-y-4">
          <div>
            <h5 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sección de Subsanación
            </h5>
            <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Plazo para subsanar: 15 días hábiles desde la fecha de notificación.
            </p>
          </div>

          <FileUpload
            label={`Documentos de Subsanación (Revisión ${data.revision_count + 1})`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple={true}
            onChange={async (files: File[]) => {
              if (files.length > 0) {
                try {
                  const uploadPromises = files.map((file: File) => onFileUpload(file, `subsanacion_${especialidadKey}`));
                  await Promise.all(uploadPromises);
                  onDataChange({ ...data, documentos_subsanacion: files });
                } catch (error) {
                  console.error('Error uploading files:', error);
                }
              }
            }}
          />

          {/* Proceso de Reconsideración */}
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h6 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Proceso de Reconsideración (Opcional)
              </h6>
              <Button
                size="sm"
                variant="bordered"
                onClick={() => setMostrarReconsideracion(!mostrarReconsideracion)}
              >
                {mostrarReconsideracion ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            
            {mostrarReconsideracion && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DateInput
                  label="Fecha de Presentación"
                  value={data.fecha_presentacion_reconsideracion || ''}
                  onChange={(value) => onDataChange({ ...data, fecha_presentacion_reconsideracion: value })}
                />

                <div>
                  <FileUpload
                    label="Documento de Reconsideración"
                    accept=".pdf,.doc,.docx"
                    multiple={false}
                    onChange={async (files: File[]) => {
                      if (files.length > 0) {
                        try {
                          await onFileUpload(files[0], `reconsideracion_${especialidadKey}`);
                          onDataChange({ ...data, documento_reconsideracion: files });
                        } catch (error) {
                          console.error('Error uploading file:', error);
                        }
                      }
                    }}
                  />
                </div>

                <div>
                  <FileUpload
                    label="Resolución de Reconsideración"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple={false}
                    onChange={async (files: File[]) => {
                      if (files.length > 0) {
                        try {
                          await onFileUpload(files[0], `resolucion_reconsideracion_${especialidadKey}`);
                          onDataChange({ ...data, resolucion_reconsideracion: files });
                        } catch (error) {
                          console.error('Error uploading file:', error);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepGestionEspecialidades({
  formData,
  onInputChange,
  onFileUpload
}: StepGestionEspecialidadesProps) {
  const especialidades = [
    { key: 'arquitectura' as const, nombre: 'Arquitectura' },
    { key: 'estructuras' as const, nombre: 'Estructuras' },
    { key: 'electricas' as const, nombre: 'Eléctricas' },
    { key: 'sanitarias' as const, nombre: 'Sanitarias' },
  ];

  const isEspecialidadEnabled = (index: number) => {
    if (index === 0) return true; // Arquitectura siempre está habilitada
    
    // La especialidad actual se habilita si la anterior está conforme
    const previousEsp = especialidades[index - 1];
    return formData.especialidades[previousEsp.key]?.es_conforme || false;
  };

  const handleEspecialidadChange = (especialidadKey: keyof GestionProyectoFormData['especialidades'], data: EspecialidadData) => {
    const newEspecialidades = {
      ...formData.especialidades,
      [especialidadKey]: data
    };
    
    onInputChange('especialidades', newEspecialidades);
  };

  const todasEspecialidadesConformes = especialidades.every(esp => 
    formData.especialidades[esp.key]?.es_conforme || false
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestión por Especialidades (Secuencial)
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestione la aprobación de cada especialidad de forma ordenada. Cada especialidad debe estar conforme antes de pasar a la siguiente.
        </p>
      </div>

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Proceso Secuencial de Especialidades
        </h4>
        <ul className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li>• El orden de aprobación es: Arquitectura → Estructuras → Eléctricas → Sanitarias</li>
          <li>• Cada especialidad puede tener hasta 8 revisiones/oportunidades de subsanación</li>
          <li>• A partir de la 3ra observación se requiere un pago adicional</li>
          <li>• Las especialidades posteriores se habilitan solo cuando la anterior esté conforme</li>
        </ul>
      </div>

      {/* Especialidades */}
      <div className="space-y-4">
        {especialidades.map((esp, index) => (
          <EspecialidadComponent
            key={esp.key}
            nombre={esp.nombre}
            especialidadKey={esp.key}
            data={formData.especialidades[esp.key] || {
              es_conforme: false,
              revision_count: 0,
              resultado_acta: null
            }}
            isEnabled={isEspecialidadEnabled(index)}
            onDataChange={(data) => handleEspecialidadChange(esp.key, data)}
            onFileUpload={onFileUpload}
          />
        ))}
      </div>

      {/* Estado general */}
      {todasEspecialidadesConformes && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LuCheck className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Todas las Especialidades Aprobadas
            </h4>
          </div>
          <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Todas las especialidades han sido aprobadas. Puede proceder con la emisión de la licencia final.
          </p>
        </div>
      )}

      {/* Progreso visual */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Progreso de Especialidades
        </h4>
        <div className="flex items-center gap-2">
          {especialidades.map((esp, index) => (
            <div key={esp.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                formData.especialidades[esp.key]?.es_conforme
                  ? 'bg-green-600 text-white'
                  : isEspecialidadEnabled(index)
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {formData.especialidades[esp.key]?.es_conforme ? (
                  <LuCheck className="w-4 h-4" />
                ) : isEspecialidadEnabled(index) ? (
                  <LuClock className="w-4 h-4" />
                ) : (
                  <LuLock className="w-4 h-4" />
                )}
              </div>
              <span className="ml-2 text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {esp.nombre}
              </span>
              {index < especialidades.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
