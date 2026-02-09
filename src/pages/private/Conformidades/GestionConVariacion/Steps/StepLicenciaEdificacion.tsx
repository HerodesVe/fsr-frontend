import { useCallback } from 'react';
import { LuBuilding, LuInfo } from 'react-icons/lu';
import { Input, Select, Switch } from '@/components/ui';
import type { ConformidadConVariacionFormData, LicenciaEdificacionUso } from '@/types/conformidad.types';
import { USOS_EDIFICACION } from '@/types/conformidad.types';

interface StepLicenciaEdificacionProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
}

export default function StepLicenciaEdificacion({
  formData,
  errors,
  onInputChange
}: StepLicenciaEdificacionProps) {
  
  const licencia = formData.licencia_edificacion;

  // Actualizar campo de licencia
  const handleLicenciaChange = useCallback((field: keyof LicenciaEdificacionUso, value: any) => {
    onInputChange('licencia_edificacion', {
      ...licencia,
      [field]: value,
    });
  }, [licencia, onInputChange]);

  // Verificar si debe mostrar opción de casco habitable
  const showCascoHabitable = licencia.uso_edificacion === 'vivienda_multifamiliar';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Licencia de Edificación y Uso
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Ingrese los datos de la licencia de edificación aprobada.
        </p>
      </div>

      {/* Sección principal */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <LuBuilding className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos de la Licencia
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información de la licencia de edificación aprobada
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Fila 1: Resolución y Modalidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Resolución de Licencia"
              placeholder="Ej: RES-2024-001234"
              value={licencia.resolucion_licencia}
              onChange={(e) => handleLicenciaChange('resolucion_licencia', e.target.value)}
              error={errors.resolucion_licencia}
              required
            />
            <Input
              label="Modalidad de Aprobación"
              placeholder="Ej: Modalidad B, C, D"
              value={licencia.modalidad_aprobacion}
              onChange={(e) => handleLicenciaChange('modalidad_aprobacion', e.target.value)}
            />
          </div>

          {/* Fila 2: Tipo de Licencia y Uso Aprobado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tipo de Licencia"
              placeholder="Ej: Obra Nueva, Ampliación"
              value={licencia.tipo_licencia}
              onChange={(e) => handleLicenciaChange('tipo_licencia', e.target.value)}
            />
            <Input
              label="Uso Aprobado"
              placeholder="Ej: Residencial, Comercial"
              value={licencia.uso_aprobado}
              onChange={(e) => handleLicenciaChange('uso_aprobado', e.target.value)}
            />
          </div>

          {/* Fila 3: Zonificación y Altura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Zonificación"
              placeholder="Ej: RDM, RDA, CZ"
              value={licencia.zonificacion}
              onChange={(e) => handleLicenciaChange('zonificacion', e.target.value)}
            />
            <Input
              label="Altura Aprobada"
              placeholder="Ej: 5 pisos, 15 metros"
              value={licencia.altura}
              onChange={(e) => handleLicenciaChange('altura', e.target.value)}
            />
          </div>

          {/* Uso de Edificación (Select) */}
          <div>
            <Select
              label="Uso de Edificación"
              placeholder="Seleccione el uso de edificación"
              options={USOS_EDIFICACION.map(uso => ({ value: uso.value, label: uso.label }))}
              selectedKeys={licencia.uso_edificacion ? [licencia.uso_edificacion] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleLicenciaChange('uso_edificacion', value || '');
              }}
              error={errors.uso_edificacion}
              required
            />
          </div>
        </div>
      </div>

      {/* Sección Casco Habitable (Condicional) */}
      {showCascoHabitable && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-lg">
              <LuInfo size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Conformidad de Obra a Nivel de Casco Habitable
              </h3>
              <p className="text-sm text-amber-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Para edificaciones de vivienda multifamiliar, puede solicitar la conformidad de obra a nivel de casco habitable.
                Si selecciona esta opción, deberá completar un checklist de verificación en el siguiente paso.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
                <div>
                  <label className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ¿Solicita Conformidad de Obra a Nivel de Casco Habitable?
                  </label>
                  <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Solo disponible para edificaciones de vivienda multifamiliar
                  </p>
                </div>
                <Switch
                  isSelected={licencia.solicita_casco_habitable}
                  onValueChange={(checked) => handleLicenciaChange('solicita_casco_habitable', checked)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información Importante
            </h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li>• Los datos deben coincidir con la resolución de licencia aprobada</li>
              <li>• El uso de edificación determina los requisitos adicionales del trámite</li>
              <li>• La opción de casco habitable solo está disponible para vivienda multifamiliar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
