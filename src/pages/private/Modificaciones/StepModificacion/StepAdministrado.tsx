import { Select } from '@/components/ui';
import type { ModificacionFormData } from '@/types/modificacion.types';
import type { ClientOut } from '@/types/client.types';

interface StepAdministradoProps {
  formData: ModificacionFormData;
  clients: ClientOut[] | undefined;
  errors: Record<string, string>;
  onInputChange: (field: keyof ModificacionFormData, value: any) => void;
}

export default function StepAdministrado({
  formData,
  clients,
  errors,
  onInputChange,
}: StepAdministradoProps) {
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: client.clientType === 'natural' 
      ? `${client.names} ${client.paternalSurname} ${client.maternalSurname}`.trim()
      : client.businessName || '',
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccionar Administrado
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione el administrado para esta modificación de obra
        </p>
        
          <Select
            label="Administrado"
            placeholder="Seleccione un administrado"
            options={clientOptions}
            selectedKeys={formData.selectedClient ? [formData.selectedClient.id] : []}
            onSelectionChange={(keys) => {
              const clientId = Array.from(keys)[0] as string;
              const client = clients?.find(c => c.id === clientId);
              onInputChange('selectedClient', client || null);
            }}
            error={errors.selectedClient}
          />
  
        {formData.selectedClient && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información del Administrado
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Tipo:</strong> {formData.selectedClient.clientType === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}</p>
              <p><strong>Documento:</strong> {
                formData.selectedClient.clientType === 'natural' 
                  ? `${formData.selectedClient.docType}: ${formData.selectedClient.docNumber}`
                  : `RUC: ${formData.selectedClient.ruc}`
              }</p>
              {formData.selectedClient.email && <p><strong>Email:</strong> {formData.selectedClient.email}</p>}
              {formData.selectedClient.phone && <p><strong>Teléfono:</strong> {formData.selectedClient.phone}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

