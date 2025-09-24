import { Switch, Textarea } from '@/components/ui';
import { FileUpload } from '@/components/ui';
import type { StepProps } from '@/types/conformidad.types';

export default function StepAntecedentes({
  formData,
  errors,
  onInputChange,
  onFileUpload
}: StepProps) {

  const handleFileChange = async (files: File[], fieldName: keyof typeof formData) => {
    const uploadPromises = files.map(file => onFileUpload(file));
    const uploadedFiles = await Promise.all(uploadPromises);
    onInputChange(fieldName, uploadedFiles);
  };

  // Solo mostrar para modalidades con variaciones o casco habitable
  if (formData.modalidad === 'sin_variaciones') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Análisis de Antecedentes
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                El análisis de antecedentes no es requerido para la modalidad "Sin Variaciones".
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Análisis de Antecedentes
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Analice los antecedentes del administrado para determinar si es el primer expediente.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              ¿Es el primer expediente del administrado?
            </label>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Indique si este es el primer trámite del cliente con la municipalidad
            </p>
          </div>
          <Switch
            isSelected={formData.primer_expediente}
            onValueChange={(checked) => onInputChange('primer_expediente', checked)}
          />
        </div>

        {!formData.primer_expediente && (
          <div className="space-y-4 pt-4 mt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Descripción de Antecedentes <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.descripcion_antecedentes}
                onChange={(e) => onInputChange('descripcion_antecedentes', e.target.value)}
                placeholder="Ej: 'Segundo expediente, el primero fue rechazado por...'"
                rows={3}
              />
              {errors?.descripcion_antecedentes && (
                <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {errors.descripcion_antecedentes}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Vincular Expedientes Anteriores (Actas, Dictámenes)
              </label>
              <FileUpload
                onChange={(files) => handleFileChange(files, 'expedientes_anteriores')}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={true}
              />
              <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                Adjunte documentos de expedientes anteriores relacionados
              </p>
            </div>
          </div>
        )}
      </div>

      {formData.primer_expediente && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Primer Expediente
              </h4>
              <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Este es el primer expediente del administrado. No se requiere análisis de antecedentes adicional.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
