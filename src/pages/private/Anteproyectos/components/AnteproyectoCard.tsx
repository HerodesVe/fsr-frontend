import React from 'react';
import { LuUser, LuCalendar, LuClock } from 'react-icons/lu';
import type { Anteproyecto } from '@/types/anteproyecto.types';

interface AnteproyectoCardProps {
  anteproyecto: Anteproyecto;
  onClick: (anteproyecto: Anteproyecto) => void;
}

export const AnteproyectoCard: React.FC<AnteproyectoCardProps> = ({ anteproyecto, onClick }) => {
  const handleClick = () => {
    onClick(anteproyecto);
  };

  // Función para calcular el progreso basado en steps_status
  const calculateProgress = () => {
    if (!anteproyecto.steps_status) return 0;
    
    const steps = Object.values(anteproyecto.steps_status);
    const completedSteps = steps.filter(step => step === 'Completada').length;
    const totalSteps = steps.length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  // Función para obtener el color del badge según el status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completado':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
            Completado
          </span>
        );
      case 'borrador':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
            Borrador
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
            Pendiente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white">
            {status}
          </span>
        );
    }
  };

  // Calcular el progreso basado en steps_status
  const progress = calculateProgress();

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Header con título y badge de estado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {anteproyecto.data?.nombre_proyecto || 'Proyecto Residencial Surquillo'}
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            N° de Trámite: {anteproyecto.instance_code}
          </p>
        </div>
        {getStatusBadge(anteproyecto.status)}
      </div>

      {/* Información del administrado y responsable */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <LuUser className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-medium">Administrado:</span> {anteproyecto.administrado || 'Inversiones Inmobiliarias San Borja S.A.C.'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LuUser className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-medium">Responsable:</span> {anteproyecto.responsable || 'Leonel Cisneros'}
          </span>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <LuCalendar className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Fecha de creación:</p>
            <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              {new Date(anteproyecto.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LuClock className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Fecha de culminación:</p>
            <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              {anteproyecto.scheduled_completion_date 
                ? new Date(anteproyecto.scheduled_completion_date).toLocaleDateString('es-ES')
                : 'Por definir'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Progreso</span>
          <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AnteproyectoCard;
