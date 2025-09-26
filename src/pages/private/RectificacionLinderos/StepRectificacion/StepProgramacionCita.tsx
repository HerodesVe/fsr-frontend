import { Input } from '@/components/ui';
import type { RectificacionLinderosFormData } from '@/types/rectificacionLinderos.types';

interface StepProgramacionCitaProps {
  formData: RectificacionLinderosFormData;
  rectificacionId: string;
  errors: Record<string, string>;
  onInputChange: (field: keyof RectificacionLinderosFormData, value: any) => void;
}

export default function StepProgramacionCita({
  formData,
  errors,
  onInputChange,
}: StepProgramacionCitaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Carga de Cita para Revisión
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre los detalles de la cita programada con la entidad revisora (Municipalidad, COFOPRI, etc.).
        </p>
        
        <div className="space-y-6">
          {/* Información de la Cita */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Detalles de la Cita
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Información sobre la cita programada para la revisión del plano
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Cita"
                type="date"
                value={formData.fecha_cita}
                onChange={(e) => onInputChange('fecha_cita', e.target.value)}
                error={errors.fecha_cita}
                required
              />
              <Input
                label="Hora de la Cita"
                type="time"
                value={formData.hora_cita}
                onChange={(e) => onInputChange('hora_cita', e.target.value)}
                error={errors.hora_cita}
                required
              />
            </div>
          </div>

          {/* Información de la Entidad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Entidad Revisora
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Información sobre la entidad que realizará la revisión
              </p>
            </div>
            <div className="space-y-4">
              <Input
                label="Entidad Revisora"
                value={formData.entidad_revisora}
                onChange={(e) => onInputChange('entidad_revisora', e.target.value)}
                placeholder="Ej: Municipalidad de Miraflores"
                error={errors.entidad_revisora}
                required
              />
              <Input
                label="Nombre del Funcionario de Contacto"
                value={formData.funcionario_contacto}
                onChange={(e) => onInputChange('funcionario_contacto', e.target.value)}
                placeholder="Nombre del funcionario (opcional)"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información Importante para la Cita
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Llevar todos los documentos originales y copias</li>
              <li>• El plano debe estar firmado y sellado por el profesional responsable</li>
              <li>• Confirmar la cita 24 horas antes</li>
              <li>• Verificar los requisitos específicos de la entidad</li>
              <li>• Considerar tiempo adicional para posibles observaciones</li>
            </ul>
          </div>

          {/* Resumen de la cita */}
          {formData.fecha_cita && formData.hora_cita && formData.entidad_revisora && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resumen de la Cita Programada
              </h4>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Fecha:</strong> {formData.fecha_cita}</p>
                <p><strong>Hora:</strong> {formData.hora_cita}</p>
                <p><strong>Entidad:</strong> {formData.entidad_revisora}</p>
                {formData.funcionario_contacto && (
                  <p><strong>Contacto:</strong> {formData.funcionario_contacto}</p>
                )}
                <p><strong>Estado:</strong> Cita programada correctamente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
