import { useCallback } from 'react';
import { LuMapPin, LuRuler } from 'react-icons/lu';
import { Input, Select, Switch } from '@/components/ui';
import { useDepartments, useProvinces, useDistricts } from '@/hooks/useUbigeo';
import type { ConformidadConVariacionFormData, PredioConformidadObra } from '@/types/conformidad.types';

interface StepPredioConformidadObraProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
}

export default function StepPredioConformidadObra({
  formData,
  errors,
  onInputChange
}: StepPredioConformidadObraProps) {
  
  const predio = formData.predio;
  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(predio.departmentId);
  const { data: districts } = useDistricts(predio.provinceId);

  // Actualizar campo del predio
  const handlePredioChange = useCallback((field: keyof PredioConformidadObra, value: any) => {
    onInputChange('predio', {
      ...predio,
      [field]: value,
    });
  }, [predio, onInputChange]);

  const departmentOptions = departments?.map(dept => ({
    value: dept.id,
    label: dept.name,
  })) || [];

  const provinceOptions = provinces?.map(prov => ({
    value: prov.id,
    label: prov.name,
  })) || [];

  const districtOptions = districts?.map(dist => ({
    value: dist.id,
    label: dist.name,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 6: Datos del Predio
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Ingrese la información del predio donde se ubica la edificación.
        </p>
      </div>

      {/* Sección 1: Ubicación */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <LuMapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos del Predio
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información sobre la ubicación del terreno
            </p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Departamento"
            placeholder="Seleccionar departamento"
            options={departmentOptions}
            selectedKeys={predio.departmentId ? [predio.departmentId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePredioChange('departmentId', value || '');
              handlePredioChange('provinceId', '');
              handlePredioChange('districtId', '');
            }}
            error={errors.departmentId}
            required
          />

          <Select
            label="Provincia"
            placeholder="Seleccionar provincia"
            options={provinceOptions}
            selectedKeys={predio.provinceId ? [predio.provinceId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePredioChange('provinceId', value || '');
              handlePredioChange('districtId', '');
            }}
            error={errors.provinceId}
            disabled={!predio.departmentId}
            required
          />

          <Select
            label="Distrito"
            placeholder="Seleccionar distrito"
            options={districtOptions}
            selectedKeys={predio.districtId ? [predio.districtId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePredioChange('districtId', value || '');
            }}
            error={errors.districtId}
            disabled={!predio.provinceId}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Ingrese urbanización"
            value={predio.urbanization}
            onChange={(e) => handlePredioChange('urbanization', e.target.value)}
            label='Urbanización / A.H. / Otro'
            error={errors.urbanization}
            required
          />
      
          <Input
            label="Mz"
            placeholder="Mz"
            value={predio.mz}
            onChange={(e) => handlePredioChange('mz', e.target.value)}
          />
        
          <Input
            label="Lote"
            placeholder="Lote"
            value={predio.lote}
            onChange={(e) => handlePredioChange('lote', e.target.value)}
          />

          <Input
            label="Sub Lote"
            placeholder="Sub Lote"
            value={predio.subLote}
            onChange={(e) => handlePredioChange('subLote', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Av. / Jr. / Calle / Pasaje"
            placeholder="Ingrese vía"
            value={predio.street}
            onChange={(e) => handlePredioChange('street', e.target.value)}
            error={errors.street}
            required
          />

          <Input
            label="Número"
            placeholder="Número"
            value={predio.number}
            onChange={(e) => handlePredioChange('number', e.target.value)}
          />

          <Input
            label="Interior"
            placeholder="Interior"
            value={predio.interior}
            onChange={(e) => handlePredioChange('interior', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Latitud"
            placeholder="Ej: -12.0464"
            value={predio.latitud.toString()}
            onChange={(e) => handlePredioChange('latitud', parseFloat(e.target.value) || 0)}
            numbersOnly
          />

          <Input
            label="Longitud"
            placeholder="Ej: -77.0428"
            value={predio.longitud.toString()}
            onChange={(e) => handlePredioChange('longitud', parseFloat(e.target.value) || 0)}
            numbersOnly
          />
        </div>
      </div>

      {/* Sección 2: Área y Medidas Perimétricas */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <LuRuler className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Área y Medidas Perimétricas
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información sobre las dimensiones del terreno
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Input
            label="Área Total (m²)"
            placeholder="Ingrese área total"
            value={predio.area_total_m2.toString()}
            onChange={(e) => handlePredioChange('area_total_m2', parseFloat(e.target.value) || 0)}
            error={errors.area_total_m2}
            numbersOnly
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Por el frente (m)"
            placeholder="Metros"
            value={predio.frente.toString()}
            onChange={(e) => handlePredioChange('frente', parseFloat(e.target.value) || 0)}
            numbersOnly
          />

          <Input
            label="Por la derecha (m)"
            placeholder="Metros"
            value={predio.derecha.toString()}
            onChange={(e) => handlePredioChange('derecha', parseFloat(e.target.value) || 0)}
            numbersOnly
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Por la izquierda (m)"
            placeholder="Metros"
            value={predio.izquierda.toString()}
            onChange={(e) => handlePredioChange('izquierda', parseFloat(e.target.value) || 0)}
            numbersOnly
          />

          <Input
            label="Por el fondo (m)"
            placeholder="Metros"
            value={predio.fondo.toString()}
            onChange={(e) => handlePredioChange('fondo', parseFloat(e.target.value) || 0)}
            numbersOnly
          />
        </div>

        {/* Características de la Edificación */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Características de la Edificación
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Tipo de Edificación"
              placeholder="Ej: Vivienda multifamiliar, Oficinas"
              value={predio.tipo_edificacion}
              onChange={(e) => handlePredioChange('tipo_edificacion', e.target.value)}
              error={errors.tipo_edificacion}
            />

            <Input
              label="Número de Pisos"
              placeholder="Ingrese número de pisos"
              value={predio.numero_pisos.toString()}
              onChange={(e) => handlePredioChange('numero_pisos', parseInt(e.target.value) || 0)}
              numbersOnly
            />
          </div>

          {/* Nuevos campos: Sótanos, Semisótanos, Azotea */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="N° de Sótanos"
              placeholder="0"
              value={predio.numero_sotanos.toString()}
              onChange={(e) => handlePredioChange('numero_sotanos', parseInt(e.target.value) || 0)}
              numbersOnly
            />

            <Input
              label="N° de Semisótanos"
              placeholder="0"
              value={predio.numero_semisotanos.toString()}
              onChange={(e) => handlePredioChange('numero_semisotanos', parseInt(e.target.value) || 0)}
              numbersOnly
            />

            <div className="flex items-center gap-4 pt-6">
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                ¿Tiene Azotea?
              </label>
              <Switch
                isSelected={predio.tiene_azotea}
                onValueChange={(checked) => handlePredioChange('tiene_azotea', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Área techada total (m²)"
              placeholder="xxx.xx"
              value={predio.area_techada_total_m2.toString()}
              onChange={(e) => handlePredioChange('area_techada_total_m2', parseFloat(e.target.value) || 0)}
              numbersOnly
            />

            <Input
              label="Área Libre (m²)"
              placeholder="xx.xx"
              value={predio.area_libre_m2.toString()}
              onChange={(e) => handlePredioChange('area_libre_m2', parseFloat(e.target.value) || 0)}
              numbersOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Descripción del Proyecto / Observaciones
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              rows={4}
              placeholder="Describe brevemente el proyecto"
              value={predio.descripcion_proyecto}
              onChange={(e) => handlePredioChange('descripcion_proyecto', e.target.value)}
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
