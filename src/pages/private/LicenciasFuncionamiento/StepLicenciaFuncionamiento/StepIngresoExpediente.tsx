import { Input, Select } from '@/components/ui';
import type { LicenciaFuncionamientoFormData } from '@/types/licenciaFuncionamiento.types';

interface StepIngresoExpedienteProps {
  formData: LicenciaFuncionamientoFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
}

export default function StepIngresoExpediente({
  formData,
  errors,
  onInputChange,
}: StepIngresoExpedienteProps) {
  const estadoTramiteOptions = [
    { value: 'En Revisión', label: 'En Revisión' },
    { value: 'Observado', label: 'Observado' },
    { value: 'Aprobado', label: 'Aprobado' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 6: Ingreso del Expediente y Seguimiento
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre la información del expediente ingresado a la municipalidad
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Fecha de Ingreso de Expediente"
                type="date"
                value={formData.fecha_ingreso_expediente}
                onChange={(e) => onInputChange('fecha_ingreso_expediente', e.target.value)}
                error={errors.fecha_ingreso_expediente}
              />
            </div>
            <div>
              <Input
                label="N° de Expediente Municipal"
                placeholder="Ej: 2025-12345"
                value={formData.numero_expediente_municipal}
                onChange={(e) => onInputChange('numero_expediente_municipal', e.target.value)}
                error={errors.numero_expediente_municipal}
              />
            </div>
            <div>
              <Select
                label="Estado del Trámite"
                options={estadoTramiteOptions}
                selectedKeys={formData.estado_tramite ? [formData.estado_tramite] : []}
                onSelectionChange={(keys) => {
                  const estado = Array.from(keys)[0] as string;
                  onInputChange('estado_tramite', estado);
                }}
              />
            </div>
          </div>

          {/* Información adicional según el estado */}
          {formData.estado_tramite && (
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Estado Actual: {formData.estado_tramite}
              </h4>
              <div className="text-sm text-gray-600">
                {formData.estado_tramite === 'En Revisión' && (
                  <p>El expediente está siendo revisado por la municipalidad. El tiempo promedio de revisión es de 15 a 30 días hábiles.</p>
                )}
                {formData.estado_tramite === 'Observado' && (
                  <div className="text-yellow-700 bg-yellow-50 p-3 rounded">
                    <p className="font-medium">⚠️ Expediente Observado</p>
                    <p>Se han encontrado observaciones que deben ser subsanadas. Revise las observaciones y prepare la documentación correctiva.</p>
                  </div>
                )}
                {formData.estado_tramite === 'Aprobado' && (
                  <div className="text-green-700 bg-green-50 p-3 rounded">
                    <p className="font-medium">✅ Expediente Aprobado</p>
                    <p>El expediente ha sido aprobado. Puede proceder con la siguiente etapa del proceso.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información del expediente ingresado */}
          {(formData.fecha_ingreso_expediente || formData.numero_expediente_municipal) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resumen del Expediente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {formData.fecha_ingreso_expediente && (
                  <div>
                    <span className="font-medium text-gray-700">Fecha de Ingreso:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(formData.fecha_ingreso_expediente).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
                {formData.numero_expediente_municipal && (
                  <div>
                    <span className="font-medium text-gray-700">N° Expediente:</span>
                    <span className="ml-2 text-gray-600">{formData.numero_expediente_municipal}</span>
                  </div>
                )}
                {formData.giro_negocio && (
                  <div>
                    <span className="font-medium text-gray-700">Giro:</span>
                    <span className="ml-2 text-gray-600">{formData.giro_negocio}</span>
                  </div>
                )}
                {formData.nivel_riesgo && (
                  <div>
                    <span className="font-medium text-gray-700">Nivel de Riesgo:</span>
                    <span className="ml-2 text-gray-600">{formData.nivel_riesgo}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
