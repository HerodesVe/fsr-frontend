import { Select } from '@/components/ui';
import type { RectificacionLinderosFormData } from '@/types/rectificacionLinderos.types';

interface StepSeleccionAnteproyectoProps {
  formData: RectificacionLinderosFormData;
  rectificacionId: string;
  errors: Record<string, string>;
  onInputChange: (field: keyof RectificacionLinderosFormData, value: any) => void;
}

// Data dummy de anteproyectos
const anteproyectosDummy = [
  { id: 'ANT-2024-001', label: 'ANT-2024-001: Casa de Playa (Cliente: Juan Pérez)' },
  { id: 'ANT-2024-002', label: 'ANT-2024-002: Edificio Multifamiliar (Cliente: Inmobiliaria Sol)' },
  { id: 'ANT-2024-003', label: 'ANT-2024-003: Remodelación Oficina (Cliente: Corp. ABC)' },
  { id: 'ANT-2024-004', label: 'ANT-2024-004: Centro Comercial (Cliente: Retail Group)' },
  { id: 'ANT-2024-005', label: 'ANT-2024-005: Conjunto Residencial (Cliente: Constructora Lima)' },
];

export default function StepSeleccionAnteproyecto({
  formData,
  errors,
  onInputChange,
}: StepSeleccionAnteproyectoProps) {
  const anteproyectoOptions = anteproyectosDummy.map(anteproyecto => ({
    value: anteproyecto.id,
    label: anteproyecto.label,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Selección del Anteproyecto
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Busque y seleccione el anteproyecto existente para asociar esta solicitud de rectificación de linderos.
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border-l-4 border-teal-500 bg-teal-50">
            <Select
              label="Anteproyecto"
              placeholder="Seleccione un anteproyecto existente..."
              options={anteproyectoOptions}
              selectedKeys={formData.anteproyecto_id ? [formData.anteproyecto_id] : []}
              onSelectionChange={(keys) => {
                const anteproyectoId = Array.from(keys)[0] as string;
                onInputChange('anteproyecto_id', anteproyectoId || '');
              }}
              error={errors.anteproyecto_id}
            />
          </div>

          {/* Información del anteproyecto seleccionado */}
          {formData.anteproyecto_id && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Información del Anteproyecto Seleccionado
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Código:</strong> {formData.anteproyecto_id}</p>
                <p><strong>Estado:</strong> Aprobado</p>
                <p><strong>Fecha de Aprobación:</strong> 15/01/2024</p>
                <p><strong>Observaciones:</strong> Anteproyecto apto para proceso de rectificación de linderos</p>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información Importante
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El anteproyecto debe estar aprobado y vigente</li>
              <li>• Solo se pueden asociar anteproyectos del mismo administrado</li>
              <li>• La rectificación debe ser compatible con el proyecto original</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
