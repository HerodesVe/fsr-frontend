import { useState } from 'react';
import { LuInfo, LuCheck, LuX } from 'react-icons/lu';
import { DateInput, FileUpload, Button } from '@/components/ui';
import type { GestionAnteproyectoFormData } from '@/types/gestionAnteproyecto.types';

interface StepSeguimientoRespuestaProps {
  formData: GestionAnteproyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepSeguimientoRespuesta({
  formData,
  errors,
  onInputChange,
  onFileUpload
}: StepSeguimientoRespuestaProps) {
  const [mostrarReconsideracion, setMostrarReconsideracion] = useState(false);

  const handleResultadoChange = (resultado: 'conforme' | 'no_conforme') => {
    onInputChange('resultado_acta', resultado);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seguimiento y Respuesta de la Municipalidad
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre la respuesta de la municipalidad y gestione las observaciones si las hubiera.
        </p>
      </div>

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
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateInput
          label="Fecha de Respuesta de la Municipalidad"
          required
          value={formData.fecha_respuesta || ''}
          onChange={(value) => onInputChange('fecha_respuesta', value)}
          error={errors.fecha_respuesta}
        />

        <div>
          <FileUpload
            label="Archivo del Acta/Respuesta"
            required
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={false}
            onChange={async (files: File[]) => {
              if (files.length > 0) {
                try {
                  await onFileUpload(files[0], 'archivo_respuesta');
                  onInputChange('archivo_respuesta', files);
                } catch (error) {
                  console.error('Error uploading file:', error);
                }
              }
            }}
            error={errors.archivo_respuesta}
          />
        </div>
      </div>

      {/* Resultado del Acta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Resultado del Acta <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <Button
            variant={formData.resultado_acta === 'conforme' ? 'solid' : 'bordered'}
            onClick={() => handleResultadoChange('conforme')}
            startContent={<LuCheck className="w-4 h-4" />}
            style={formData.resultado_acta === 'conforme' ? { backgroundColor: '#10b981' } : {}}
            className={formData.resultado_acta === 'conforme' ? 'text-white' : 'text-green-600 border-green-600 hover:bg-green-50'}
          >
            Conforme
          </Button>
          <Button
            variant={formData.resultado_acta === 'no_conforme' ? 'solid' : 'bordered'}
            onClick={() => handleResultadoChange('no_conforme')}
            startContent={<LuX className="w-4 h-4" />}
            style={formData.resultado_acta === 'no_conforme' ? { backgroundColor: '#ef4444' } : {}}
            className={formData.resultado_acta === 'no_conforme' ? 'text-white' : 'text-red-600 border-red-600 hover:bg-red-50'}
          >
            No Conforme
          </Button>
        </div>
        {errors.resultado_acta && (
          <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {errors.resultado_acta}
          </p>
        )}
      </div>

      {/* Sección de Subsanación */}
      {formData.resultado_acta === 'no_conforme' && (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg space-y-4">
          <div>
            <h4 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sección de Subsanación
            </h4>
            <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Plazo para subsanar: 15 días hábiles desde la fecha de notificación. Máximo 4 oportunidades de subsanación.
            </p>
          </div>

          <FileUpload
            label="Documentos de Subsanación"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple={true}
            onChange={async (files: File[]) => {
              if (files.length > 0) {
                try {
                  // Subir múltiples archivos
                  const uploadPromises = files.map((file: File) => onFileUpload(file, 'documentos_subsanacion'));
                  await Promise.all(uploadPromises);
                  onInputChange('documentos_subsanacion', files);
                } catch (error) {
                  console.error('Error uploading files:', error);
                }
              }
            }}
          />

          {/* Proceso de Reconsideración */}
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Proceso de Reconsideración (Opcional)
              </h5>
              <Button
                size="sm"
                variant="bordered"
                onClick={() => setMostrarReconsideracion(!mostrarReconsideracion)}
              >
                {mostrarReconsideracion ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            
            <p className="text-xs text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Si considera que la observación es incorrecta, puede solicitar una reconsideración. Plazo: 15 días hábiles.
            </p>

            {mostrarReconsideracion && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DateInput
                  label="Fecha de Presentación"
                  value={formData.fecha_presentacion_reconsideracion || ''}
                  onChange={(value) => onInputChange('fecha_presentacion_reconsideracion', value)}
                />

                <div>
                  <FileUpload
                    label="Documento de Reconsideración"
                    accept=".pdf,.doc,.docx"
                    multiple={false}
                    onChange={async (files: File[]) => {
                      if (files.length > 0) {
                        try {
                          await onFileUpload(files[0], 'documento_reconsideracion');
                          onInputChange('documento_reconsideracion', files);
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
                          await onFileUpload(files[0], 'resolucion_reconsideracion');
                          onInputChange('resolucion_reconsideracion', files);
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

      {/* Mensaje de éxito para resultado conforme */}
      {formData.resultado_acta === 'conforme' && (
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
    </div>
  );
}
