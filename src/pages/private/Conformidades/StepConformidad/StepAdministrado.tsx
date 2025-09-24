import { Select } from '@/components/ui';
import type { StepAdministradoProps } from '@/types/conformidad.types';

export default function StepAdministrado({
  formData,
  clients,
  errors,
  onInputChange
}: StepAdministradoProps) {
  
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.name} - ${client.document}`
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información del Administrado
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione el cliente o administrado para el trámite de conformidad de obra.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cliente / Administrado <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Buscar por nombre o DNI/RUC..."
          value={formData.selectedClient?.id || ''}
          onChange={(value) => {
            const client = clients?.find(c => c.id === value);
            onInputChange('selectedClient', client || null);
          }}
          options={clientOptions}
        />
        {errors?.selectedClient && (
          <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {errors.selectedClient}
          </p>
        )}
      </div>

      {formData.selectedClient && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información del Cliente Seleccionado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Nombre:</span>
              <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.selectedClient.name}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Documento:</span>
              <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.selectedClient.document}
              </p>
            </div>
            {formData.selectedClient.email && (
              <div>
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Email:</span>
                <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.selectedClient.email}
                </p>
              </div>
            )}
            {formData.selectedClient.phone && (
              <div>
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Teléfono:</span>
                <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.selectedClient.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
