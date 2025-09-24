import { Switch, DateInput } from '@/components/ui';
import type { StepProps } from '@/types/conformidad.types';

export default function StepVerificacion({
  formData,
  errors,
  onInputChange
}: StepProps) {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Verificación Preliminar
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          {formData.modalidad === 'sin_variaciones'
            ? 'Configure la verificación en campo para el trámite sin variaciones.'
            : 'Este paso de verificación se completará durante el proceso de revisión.'
          }
        </p>
      </div>

      {formData.modalidad === 'sin_variaciones' ? (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿Se realizó la verificación en campo?
                </label>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Indique si ya se realizó la verificación física de la obra
                </p>
              </div>
              <Switch
                isSelected={formData.verificacion_campo_sv}
                onValueChange={(checked) => onInputChange('verificacion_campo_sv', checked)}
              />
            </div>
          </div>

          {formData.verificacion_campo_sv && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Fecha de Verificación <span className="text-red-500">*</span>
              </label>
              <DateInput
                value={formData.fecha_verificacion_sv}
                onChange={(value) => onInputChange('fecha_verificacion_sv', value)}
              />
              {errors?.fecha_verificacion_sv && (
                <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {errors.fecha_verificacion_sv}
                </p>
              )}
            </div>
          )}

          {formData.verificacion_campo_sv && formData.fecha_verificacion_sv && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Verificación Completada
                  </h4>
                  <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    La verificación en campo se realizó el {new Date(formData.fecha_verificacion_sv).toLocaleDateString('es-PE')}.
                    El expediente está listo para su presentación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!formData.verificacion_campo_sv && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Verificación Pendiente
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Será necesario coordinar la verificación en campo antes de presentar el expediente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Verificación durante el proceso
              </h4>
              <p className="text-sm text-blue-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Para las modalidades "Con Variaciones" y "En Casco Habitable", la verificación se realizará 
                durante el proceso de revisión municipal.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Resumen del Estado
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Modalidad:</span>
            <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.modalidad === 'sin_variaciones' && 'Sin Variaciones'}
              {formData.modalidad === 'con_variaciones' && 'Con Variaciones'}
              {formData.modalidad === 'casco_habitable' && 'En Casco Habitable'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cliente:</span>
            <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedClient?.name || 'No seleccionado'}
            </span>
          </div>
          {formData.modalidad === 'sin_variaciones' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Verificación:</span>
              <span className={`text-sm font-medium ${
                formData.verificacion_campo_sv && formData.fecha_verificacion_sv 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.verificacion_campo_sv && formData.fecha_verificacion_sv 
                  ? 'Completada' 
                  : 'Pendiente'
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
