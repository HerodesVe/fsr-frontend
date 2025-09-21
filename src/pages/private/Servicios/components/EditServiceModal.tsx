import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Modal, Input } from '@/components/ui';
import { updateServiceDefinition } from '@/services/services.service';
import type { ServiceDefinition, UpdateServiceRequest } from '@/types/service.types';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service: ServiceDefinition | null;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  service
}) => {
  const [prefix, setPrefix] = useState('');
  const [correlativo, setCorrelativo] = useState<number>(1);
  const [error, setError] = useState('');

  // Mutation para actualizar el servicio
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      updateServiceDefinition(id, data),
    onSuccess: () => {
      toast.success('Servicio actualizado exitosamente', {
        duration: 4000,
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error updating service:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.prefix || 
                          error.message || 
                          'Error al actualizar el servicio';
      
      toast.error(errorMessage, {
        duration: 6000,
      });
    },
  });

  // Llenar el formulario cuando se selecciona un servicio
  useEffect(() => {
    if (service && isOpen) {
      setPrefix(service.prefix);
      setCorrelativo(1); // Valor por defecto
      setError('');
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    // Validación
    if (!prefix.trim()) {
      setError('El prefijo es obligatorio');
      return;
    }

    if (prefix.length > 10) {
      setError('El prefijo no puede tener más de 10 caracteres');
      return;
    }

    setError('');

    // Enviar actualización
    updateMutation.mutate({
      id: service.id,
      data: { prefix: prefix.trim().toUpperCase() }
    });
  };

  const handleClose = () => {
    setPrefix('');
    setCorrelativo(1);
    setError('');
    onClose();
  };

  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Servicio"
      size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-service-form"
            disabled={updateMutation.isPending}
            style={{ backgroundColor: 'var(--primary-color)', fontFamily: 'Inter, sans-serif' }}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      }
    >
      <form id="edit-service-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Información del servicio (solo lectura) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {service.name}
          </h4>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {service.description}
          </p>
        </div>

        {/* Campo editable: Prefijo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Prefijo <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: PRO, ANT, etc."
            value={prefix}
            onChange={(e) => {
              setPrefix(e.target.value.toUpperCase());
              if (error) setError('');
            }}
            error={error}
            maxLength={3}
          />
          <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            El prefijo se usará para identificar los proyectos de este tipo de servicio.
          </p>
        </div>

        {/* Campo adicional: Correlativo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Correlativo
          </label>
          <Input
            type="number"
            placeholder="1"
            value={correlativo.toString()}
            onChange={(e) => setCorrelativo(parseInt(e.target.value) || 1)}
            min={1}
          />
          <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Número correlativo para el seguimiento interno.
          </p>
        </div>
      </form>
    </Modal>
  );
};
