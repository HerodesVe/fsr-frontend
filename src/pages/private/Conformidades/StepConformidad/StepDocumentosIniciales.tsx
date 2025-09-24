import { Switch } from '@/components/ui';
import { FileUpload } from '@/components/ui';
import type { StepProps } from '@/types/conformidad.types';

export default function StepDocumentosIniciales({
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

  const renderSinVariaciones = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos del Cliente
        </h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Licencia de Obra <span className="text-red-500">*</span>
        </label>
        <FileUpload
          onChange={(files) => handleFileChange(files, 'licencia_obra_sv')}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple={false}
        />
        {errors?.licencia_obra_sv && (
          <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {errors.licencia_obra_sv}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Planos Aprobados (3 juegos) <span className="text-red-500">*</span>
        </label>
        <FileUpload
          onChange={(files) => handleFileChange(files, 'planos_aprobados_sv')}
          accept=".pdf,.dwg,.jpg,.jpeg,.png"
          multiple={true}
        />
        {errors?.planos_aprobados_sv && (
          <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {errors.planos_aprobados_sv}
          </p>
        )}
      </div>
    </div>
  );

  const renderConVariacionesOCasco = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información Inicial
        </h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              ¿Servicios previos a cargo de FSR?
            </label>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Indique si FSR ha realizado servicios previos para este proyecto
            </p>
          </div>
          <Switch
            isSelected={formData.servicios_previos_fsr}
            onValueChange={(checked) => onInputChange('servicios_previos_fsr', checked)}
          />
        </div>
      </div>

      {!formData.servicios_previos_fsr && (
        <div className="space-y-6 bg-amber-50 p-6 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-amber-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documentos Iniciales del Cliente
              </h4>
              <p className="text-sm text-amber-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cargar los siguientes documentos proporcionados por el administrado.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Licencia de Obra <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onChange={(files) => handleFileChange(files, 'licencia_obra_cv')}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple={false}
            />
            {errors?.licencia_obra_cv && (
              <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.licencia_obra_cv}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Planos Aprobados de Licencia <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onChange={(files) => handleFileChange(files, 'planos_aprobados_licencia_cv')}
              accept=".pdf,.dwg,.jpg,.jpeg,.png"
              multiple={true}
            />
            {errors?.planos_aprobados_licencia_cv && (
              <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.planos_aprobados_licencia_cv}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Planos Digitales (CAD) <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onChange={(files) => handleFileChange(files, 'planos_digitales_cad_cv')}
              accept=".dwg,.dxf,.rvt"
              multiple={true}
            />
            {errors?.planos_digitales_cad_cv && (
              <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.planos_digitales_cad_cv}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos Iniciales
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          {formData.modalidad === 'sin_variaciones'
            ? 'Cargar los documentos básicos requeridos para el trámite sin variaciones.'
            : 'Configure los documentos iniciales según el tipo de servicio.'
          }
        </p>
      </div>

      {formData.modalidad === 'sin_variaciones' && renderSinVariaciones()}
      {(formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') && renderConVariacionesOCasco()}

      {!formData.modalidad && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Seleccione una modalidad en el paso anterior para ver los documentos requeridos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
