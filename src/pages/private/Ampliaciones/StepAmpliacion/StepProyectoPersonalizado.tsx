import { Input } from '@/components/ui';
import { StepAdministrado } from '@/components/utils/Steps';
import type { AmpliacionFormData } from '@/types/ampliacion.types';
import type { ClientOut } from '@/types/client.types';

interface StepProyectoPersonalizadoProps {
  formData: AmpliacionFormData;
  clients: ClientOut[] | undefined;
  errors: Record<string, string>;
  onInputChange: (field: keyof AmpliacionFormData, value: any) => void;
}

export default function StepProyectoPersonalizado({
  formData,
  clients,
  errors,
  onInputChange,
}: StepProyectoPersonalizadoProps) {
  return (
    <div className="space-y-8">
      {/* Información del Proyecto */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información General del Proyecto
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Ingrese el nombre del proyecto de ampliación, remodelación o demolición
        </p>
        
        <Input
          label="Nombre del Proyecto"
          placeholder="Ej: Remodelación Vivienda Unifamiliar"
          value={formData.nombre_proyecto}
          onChange={(e) => onInputChange('nombre_proyecto', e.target.value)}
          error={errors.nombre_proyecto}
          required
        />
      </div>

      {/* Separador */}
      <div className="border-t border-gray-200 pt-6">
        {/* Administrado */}
        <StepAdministrado
          formData={formData}
          clients={clients}
          errors={errors}
          onInputChange={(field: string, value: any) => onInputChange(field as keyof AmpliacionFormData, value)}
          title="Seleccionar Administrado"
          description="Seleccione el administrado para este proyecto"
          showCreateButton={false}
        />
      </div>
    </div>
  );
}
