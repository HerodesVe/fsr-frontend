import { Input, Select } from '@/components/ui';
import type { AnteproyectoFormData } from '@/types/anteproyecto.types';

interface Department {
  id: string;
  name: string;
}

interface Province {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
}

interface StepPredioProps {
  formData: AnteproyectoFormData;
  errors: Record<string, string>;
  departments: Department[] | undefined;
  provinces: Province[] | undefined;
  districts: District[] | undefined;
  onInputChange: (field: keyof AnteproyectoFormData, value: any) => void;
}

export default function StepPredio({
  formData,
  errors,
  departments,
  provinces,
  districts,
  onInputChange,
}: StepPredioProps) {
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
      {/* Sección 1: Datos del Predio */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>📍</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
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
            placeholder="Lima"
            options={departmentOptions}
            selectedKeys={formData.departmentId ? [formData.departmentId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('departmentId', value || '');
              onInputChange('provinceId', '');
              onInputChange('districtId', '');
            }}
            error={errors.departmentId}
          />

          <Select
            label="Provincia"
            placeholder="Lima"
            options={provinceOptions}
            selectedKeys={formData.provinceId ? [formData.provinceId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('provinceId', value || '');
              onInputChange('districtId', '');
            }}
            error={errors.provinceId}
            disabled={!formData.departmentId}
          />

          <Select
            label="Distrito"
            placeholder="Miraflores"
            options={districtOptions}
            selectedKeys={formData.districtId ? [formData.districtId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('districtId', value || '');
            }}
            error={errors.districtId}
            disabled={!formData.provinceId}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Ingrese urbanización"
            value={formData.urbanization}
            onChange={(e) => onInputChange('urbanization', e.target.value)}
            label='Urbanización / A.H. / Otro'
          />
      
          <Input
            label="Mz"
            placeholder="Mz"
            value={formData.mz}
            onChange={(e) => onInputChange('mz', e.target.value)}
          />
        
          <Input
            label="Lote"
            placeholder="Lote"
            value={formData.lote}
            onChange={(e) => onInputChange('lote', e.target.value)}
          />

          <Input
            label="Sub Lote"
            placeholder="Sub Lote"
            value={formData.subLote}
            onChange={(e) => onInputChange('subLote', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Av. / Jr. / Calle / Pasaje"
            placeholder="Ingrese vía"
            value={formData.street}
            onChange={(e) => onInputChange('street', e.target.value)}
            error={errors.street}
          />

          <Input
            label="Número"
            placeholder="Número"
            value={formData.number}
            onChange={(e) => onInputChange('number', e.target.value)}
          />

          <Input
            label="Interior"
            placeholder="Interior"
            value={formData.interior}
            onChange={(e) => onInputChange('interior', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Latitud"
            placeholder="Número"
            value={formData.latitud.toString()}
            onChange={(e) => onInputChange('latitud', parseFloat(e.target.value) || 0)}
            numbersOnly
          />

          <Input
            label="Longitud"
            placeholder="Interior"
            value={formData.longitud.toString()}
            onChange={(e) => onInputChange('longitud', parseFloat(e.target.value) || 0)}
            numbersOnly
          />
        </div>
      </div>

      {/* Sección 2: Área y Medidas Perimétricas */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>📐</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
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
            value={formData.area_total_m2.toString()}
            onChange={(e) => onInputChange('area_total_m2', parseFloat(e.target.value) || 0)}
            error={errors.area_total_m2}
            numbersOnly
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Por el frente (m)"
            placeholder="Ingrese área local"
            value={formData.frente.toString()}
            onChange={(e) => onInputChange('frente', parseFloat(e.target.value) || 0)}
            numbersOnly
          />

          <Input
            label="Por la derecha (m)"
            placeholder="Ingrese área local"
            value={formData.derecha.toString()}
            onChange={(e) => onInputChange('derecha', parseFloat(e.target.value) || 0)}
            numbersOnly
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Por la izquierda (m)"
            placeholder="Ingrese área local"
            value={formData.izquierda.toString()}
            onChange={(e) => onInputChange('izquierda', parseFloat(e.target.value) || 0)}
            numbersOnly
          />

          <Input
            label="Por el fondo (m)"
            placeholder="Ingrese área local"
            value={formData.fondo.toString()}
            onChange={(e) => onInputChange('fondo', parseFloat(e.target.value) || 0)}
            numbersOnly
          />
        </div>

        {/* Edificación */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Edificación
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="Tipo de Edificación"
                placeholder="Ej: Vivienda multifamiliar, Oficinas, Local comercial"
                value={formData.tipo_edificacion}
                onChange={(e) => onInputChange('tipo_edificacion', e.target.value)}
                error={errors.tipo_edificacion}
              />
            </div>

            <div>
              <Input
                label="Número de Pisos"
                placeholder="Ingrese número de pisos"
                value={formData.numero_pisos.toString()}
                onChange={(e) => onInputChange('numero_pisos', parseInt(e.target.value) || 0)}
                numbersOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Descripción del Proyecto
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              rows={4}
              placeholder="Describe brevemente el proyecto"
              value={formData.descripcion_proyecto}
              onChange={(e) => onInputChange('descripcion_proyecto', e.target.value)}
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
