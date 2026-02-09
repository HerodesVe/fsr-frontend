import { LuEye, LuInfo } from 'react-icons/lu';
import { Switch, DateInput } from '@/components/ui';
import type { ConformidadConVariacionFormData } from '@/types/conformidad.types';

interface StepVerificacionOcularProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
}

export default function StepVerificacionOcular({
  formData,
  errors,
  onInputChange
}: StepVerificacionOcularProps) {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 7: Inspección Ocular
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre la información de la verificación en campo de la obra.
        </p>
      </div>

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Verificación en Campo
            </h4>
            <p className="text-sm text-blue-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              La inspección ocular es necesaria para verificar que la obra ejecutada corresponde 
              con los planos aprobados y las especificaciones técnicas del proyecto.
            </p>
          </div>
        </div>
      </div>

      {/* Sección principal */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <LuEye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos de la Inspección
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Registre si se realizó la verificación en campo
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Switch de verificación */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿Se realizó la inspección ocular?
                </label>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Indique si ya se realizó la verificación física de la obra
                </p>
              </div>
              <Switch
                isSelected={formData.verificacion_campo}
                onValueChange={(checked) => onInputChange('verificacion_campo', checked)}
              />
            </div>
          </div>

          {/* Campos adicionales si se realizó la verificación */}
          {formData.verificacion_campo && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <DateInput
                label="Fecha de Verificación"
                required
                value={formData.fecha_verificacion}
                onChange={(value) => onInputChange('fecha_verificacion', value)}
                error={errors.fecha_verificacion}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Observaciones de la Inspección
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  rows={4}
                  placeholder="Ingrese las observaciones de la inspección ocular..."
                  value={formData.observaciones_verificacion}
                  onChange={(e) => onInputChange('observaciones_verificacion', e.target.value)}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>
          )}

          {/* Mensaje de estado */}
          {formData.verificacion_campo && formData.fecha_verificacion ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Inspección Completada
                  </h4>
                  <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    La inspección ocular se realizó el {new Date(formData.fecha_verificacion).toLocaleDateString('es-PE')}.
                    El expediente está listo para su presentación ante la municipalidad.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Inspección Pendiente
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Será necesario coordinar la inspección ocular antes de presentar el expediente ante la municipalidad.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checklist de verificación */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Puntos a Verificar en la Inspección
        </h4>
        <ul className="text-sm text-gray-600 space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Correspondencia entre planos aprobados y obra ejecutada
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Verificación de áreas construidas y libres
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Estado de las instalaciones (eléctricas, sanitarias, etc.)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Cumplimiento de retiros y alturas aprobadas
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Verificación de acabados según especificaciones
          </li>
        </ul>
      </div>
    </div>
  );
}
