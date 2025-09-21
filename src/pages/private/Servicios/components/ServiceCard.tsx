import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuClock, LuCheck, LuPencil } from 'react-icons/lu';
import type { ServiceDefinition } from '@/types/service.types';

interface ServiceCardProps {
  service: ServiceDefinition;
  onEdit: (service: ServiceDefinition) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit }) => {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se ejecute el click del card
    onEdit(service);
  };

  const handleCardClick = () => {
    // Navegar a la pantalla de anteproyectos cuando el servicio sea "anteproyecto"
    if (service.id === 'anteproyecto') {
      navigate('/dashboard/anteproyectos');
    }
    // Para otros servicios, se puede agregar lógica similar
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Botón de editar sutil en la esquina */}
      <button
        onClick={handleEditClick}
        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        title="Editar servicio"
      >
        <LuPencil className="w-4 h-4" />
      </button>

      {/* Header con título y badge de activos */}
      <div className="mb-4 pr-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            {service.name}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-600 text-white ml-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            3 activos
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          {service.description}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <LuClock className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            2 pendientes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LuCheck className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            5 completadas
          </span>
        </div>
      </div>

      {/* Prefijo */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          PREFIJO
        </p>
        <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-orange-50 text-sm font-medium text-orange-800 border border-orange-200">
          {service.prefix}
        </span>
      </div>
    </div>
  );
};
