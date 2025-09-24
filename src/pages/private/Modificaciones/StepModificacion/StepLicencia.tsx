import { Input, Select } from '@/components/ui';
import type { ModificacionFormData } from '@/types/modificacion.types';

interface StepLicenciaProps {
  formData: ModificacionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof ModificacionFormData, value: any) => void;
}

export default function StepLicencia({
  formData,
  errors,
  onInputChange,
}: StepLicenciaProps) {
  const modalidadOptions = [
    { value: '', label: 'Seleccione una modalidad' },
    { value: 'A', label: 'Modalidad A' },
    { value: 'B', label: 'Modalidad B' },
    { value: 'C', label: 'Modalidad C' },
    { value: 'D', label: 'Modalidad D' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Datos Iniciales del Trámite
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Define la naturaleza y modalidad de la modificación antes de empezar
        </p>
        
        <div className="space-y-6">
          <Input
            label="Tipo de Licencia de Edificación"
            placeholder="Ej: Modificación con ampliación de 2 pisos"
            value={formData.tipo_licencia_edificacion}
            onChange={(e) => onInputChange('tipo_licencia_edificacion', e.target.value)}
            error={errors.tipo_licencia_edificacion}
            required
          />

          <Select
            label="Modalidad"
            placeholder="Seleccione una modalidad"
            options={modalidadOptions}
            selectedKeys={formData.tipo_modalidad ? [formData.tipo_modalidad] : []}
            onSelectionChange={(keys) => {
              const modalidad = Array.from(keys)[0] as string;
              onInputChange('tipo_modalidad', modalidad);
            }}
            error={errors.tipo_modalidad}
          />
        </div>
      </div>
    </div>
  );
}

