import { LuBuilding } from 'react-icons/lu';
import { Input } from '@/components/ui';
import type { RegularizacionFormData } from '@/types/regularizacion.types';

interface StepDatosPredioProps {
  formData: RegularizacionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof RegularizacionFormData, value: any) => void;
}

export default function StepDatosPredio({
  formData,
  errors,
  onInputChange,
}: StepDatosPredioProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Datos del Predio
        </h3>
        <div className="p-4 border-l-4 border-teal-500 bg-teal-50 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <LuBuilding className="h-5 w-5 text-teal-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-teal-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ingrese los detalles específicos del predio que será regularizado.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Ubicación del Predio"
            value={formData.fue_ubicacion}
            onChange={(e) => onInputChange('fue_ubicacion', e.target.value)}
            placeholder="Ubicación detallada del predio"
            required
            error={errors.fue_ubicacion}
          />

          <Input
            label="Partida Registral"
            value={formData.fue_partida}
            onChange={(e) => onInputChange('fue_partida', e.target.value)}
            placeholder="N° de Partida en SUNARP"
            required
            error={errors.fue_partida}
          />

          <Input
            label="Modalidad de Licencia"
            value={formData.fue_modalidad}
            onChange={(e) => onInputChange('fue_modalidad', e.target.value)}
            placeholder="Ej: Modalidad A"
            required
            error={errors.fue_modalidad}
          />

          <Input
            label="Presupuesto de Obra (S/.)"
            value={formData.fue_presupuesto}
            onChange={(e) => onInputChange('fue_presupuesto', e.target.value)}
            placeholder="Ej: 50000.00"
            required
            error={errors.fue_presupuesto}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información Importante
          </h4>
          <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Estos datos serán utilizados para generar el Formulario Único de Edificación (FUE) que deberá ser firmado en el siguiente paso.
          </p>
        </div>
      </div>
    </div>
  );
}
