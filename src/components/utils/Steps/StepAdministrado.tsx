import { Button, Select } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import type { ClientOut } from '@/types/client.types';

interface StepAdministradoProps {
  formData: {
    selectedClient: any | null;
    [key: string]: any;
  };
  clients: ClientOut[] | undefined;
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

export default function StepAdministrado({
  formData,
  clients,
  errors,
  onInputChange,
  title = "Seleccionar Administrado",
  description = "Seleccione el administrado para este servicio",
  showCreateButton = false,
}: StepAdministradoProps) {
  const navigate = useNavigate();
  
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: client.clientType === 'natural' 
      ? `${client.names} ${client.paternalSurname} ${client.maternalSurname}`.trim()
      : client.businessName || '',
  })) || [];

  const handleCreateAdministrado = () => {
    navigate('/dashboard/administrados/create');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          {description}
        </p>
        
        <div className="space-y-6">
          {/* Selector de administrado con botón opcional */}
          <div className={showCreateButton ? "p-4 border-l-4 border-teal-500 bg-teal-50" : ""}>
            <div className={showCreateButton ? "flex items-center justify-between" : ""}>
              <div className={showCreateButton ? "flex-1" : ""}>
                <Select
                  label={showCreateButton ? "Buscar Administrado Existente" : "Administrado"}
                  placeholder={showCreateButton ? "Buscar por nombre o DNI..." : "Buscar y seleccionar administrado..."}
                  options={clientOptions}
                  selectedKeys={formData.selectedClient ? [formData.selectedClient.id] : []}
                  onSelectionChange={(keys) => {
                    const clientId = Array.from(keys)[0] as string;
                    const client = clients?.find(c => c.id === clientId);
                    onInputChange('selectedClient', client || null);
                  }}
                  error={errors.selectedClient}
                />
              </div>
              {showCreateButton && (
                <div className="ml-4">
                  <Button
                    variant="bordered"
                    onClick={handleCreateAdministrado}
                    size="sm"
                  >
                    Crear Administrado
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Información del administrado seleccionado */}
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
    </div>
  );
}
