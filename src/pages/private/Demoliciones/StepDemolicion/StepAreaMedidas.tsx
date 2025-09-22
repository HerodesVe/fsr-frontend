import { Input, Textarea } from '@/components/ui';
import type { DemolicionFormData } from '@/types/demolicion.types';

interface StepAreaMedidasProps {
  formData: DemolicionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
}

export default function StepAreaMedidas({
  formData,
  errors,
  onInputChange,
}: StepAreaMedidasProps) {
  return (
    <div className="space-y-8">
      {/* Header con icono */}
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">📏</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Área y Medidas Perimétricas
          </h3>
        </div>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información sobre las dimensiones del terreno
        </p>
      </div>

      {/* Área Total */}
      <div>
        <Input
          label="Área Total (m²)"
          placeholder="Ingrese área local"
          value={formData.area_total}
          onChange={(e) => onInputChange('area_total', e.target.value)}
          error={errors.area_total}
          required
        />
      </div>

      {/* Medidas por lados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Por el frente (m)"
          placeholder="Ingrese área local"
          value={formData.por_el_frente}
          onChange={(e) => onInputChange('por_el_frente', e.target.value)}
          error={errors.por_el_frente}
          required
        />
        <Input
          label="Por la derecha (m)"
          placeholder="Ingrese área local"
          value={formData.por_la_derecha}
          onChange={(e) => onInputChange('por_la_derecha', e.target.value)}
          error={errors.por_la_derecha}
          required
        />
        <Input
          label="Por la izquierda (m)"
          placeholder="Ingrese área local"
          value={formData.por_la_izquierda}
          onChange={(e) => onInputChange('por_la_izquierda', e.target.value)}
          error={errors.por_la_izquierda}
          required
        />
        <Input
          label="Por el fondo (m)"
          placeholder="Ingrese área local"
          value={formData.por_el_fondo}
          onChange={(e) => onInputChange('por_el_fondo', e.target.value)}
          error={errors.por_el_fondo}
          required
        />
      </div>

      {/* Medidas Perimétricas */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Medidas Perimétricas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Medidas perimétricas (Administrado)"
            placeholder="Ingrese área local"
            value={formData.medidas_perimetricas_administrado}
            onChange={(e) => onInputChange('medidas_perimetricas_administrado', e.target.value)}
            error={errors.medidas_perimetricas_administrado}
            required
          />
          <Input
            label="Medidas perimétricas reales (FSR)"
            placeholder="Ingrese área local"
            value={formData.medidas_perimetricas_reales_fsr}
            onChange={(e) => onInputChange('medidas_perimetricas_reales_fsr', e.target.value)}
            error={errors.medidas_perimetricas_reales_fsr}
            required
          />
        </div>
      </div>

      {/* Descripción del Proyecto */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Descripción del Proyecto
        </h4>
        <Textarea
          placeholder="Describe brevemente el proyecto"
          value={formData.descripcion_proyecto || ''}
          onChange={(e) => onInputChange('descripcion_proyecto', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
