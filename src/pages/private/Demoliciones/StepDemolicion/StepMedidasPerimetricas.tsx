import { Input, Textarea } from '@/components/ui';
import type { DemolicionFormData } from '@/types/demolicion.types';

interface StepMedidasPerimetricasProps {
  formData: DemolicionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
}

export default function StepMedidasPerimetricas({
  formData,
  errors,
  onInputChange,
}: StepMedidasPerimetricasProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Verificación de Linderos y Medidas Perimétricas
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Compare las medidas según la partida registral con las medidas reales de campo
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          {/* Según Partida Registral */}
          <div>
            <p className="font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Según Partida Registral
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Frente (m)"
                type="number"
                value={formData.frente_partida}
                onChange={(e) => onInputChange('frente_partida', e.target.value)}
                placeholder="0.00"
                error={errors.frente_partida}
              />
              <Input
                label="Fondo (m)"
                type="number"
                value={formData.fondo_partida}
                onChange={(e) => onInputChange('fondo_partida', e.target.value)}
                placeholder="0.00"
                error={errors.fondo_partida}
              />
              <Input
                label="Derecha (m)"
                type="number"
                value={formData.derecha_partida}
                onChange={(e) => onInputChange('derecha_partida', e.target.value)}
                placeholder="0.00"
                error={errors.derecha_partida}
              />
              <Input
                label="Izquierda (m)"
                type="number"
                value={formData.izquierda_partida}
                onChange={(e) => onInputChange('izquierda_partida', e.target.value)}
                placeholder="0.00"
                error={errors.izquierda_partida}
              />
              <div className="col-span-2">
                <Input
                  label="Área Total (m²)"
                  type="number"
                  value={formData.area_total_partida}
                  onChange={(e) => onInputChange('area_total_partida', e.target.value)}
                  placeholder="0.00"
                  error={errors.area_total_partida}
                />
              </div>
            </div>
          </div>

          {/* Medidas Reales (de Campo) */}
          <div>
            <p className="font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Medidas Reales (de Campo)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Frente (m)"
                type="number"
                value={formData.frente_real}
                onChange={(e) => onInputChange('frente_real', e.target.value)}
                placeholder="0.00"
                error={errors.frente_real}
              />
              <Input
                label="Fondo (m)"
                type="number"
                value={formData.fondo_real}
                onChange={(e) => onInputChange('fondo_real', e.target.value)}
                placeholder="0.00"
                error={errors.fondo_real}
              />
              <Input
                label="Derecha (m)"
                type="number"
                value={formData.derecha_real}
                onChange={(e) => onInputChange('derecha_real', e.target.value)}
                placeholder="0.00"
                error={errors.derecha_real}
              />
              <Input
                label="Izquierda (m)"
                type="number"
                value={formData.izquierda_real}
                onChange={(e) => onInputChange('izquierda_real', e.target.value)}
                placeholder="0.00"
                error={errors.izquierda_real}
              />
              <div className="col-span-2">
                <Input
                  label="Área Total (m²)"
                  type="number"
                  value={formData.area_total_real}
                  onChange={(e) => onInputChange('area_total_real', e.target.value)}
                  placeholder="0.00"
                  error={errors.area_total_real}
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones y Alerta al Cliente
            </label>
            <Textarea
              value={formData.observaciones_medidas}
              onChange={(e) => onInputChange('observaciones_medidas', e.target.value)}
              rows={4}
              placeholder="Ingrese observaciones sobre las medidas perimétricas y cualquier alerta importante para el cliente..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

