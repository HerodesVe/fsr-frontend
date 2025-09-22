import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useServices } from '@/hooks/useServices';
import { useHeaderStore } from '@/store/headerStore';
import { Filter } from '@/components/ui';
import { ServiceCard } from './components/ServiceCard';
import { EditServiceModal } from './components/EditServiceModal';
import type { ServiceDefinition } from '@/types/service.types';

export default function Servicios() {
  const navigate = useNavigate();
  const { services, isLoading, error, refetch } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setHeader } = useHeaderStore();

  // Configurar el header cuando el componente se monta
  useEffect(() => {
    setHeader(
      'Servicios',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );

    // Limpiar el header cuando el componente se desmonta
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  // Lógica de filtrado
  const filteredServices = useMemo(() => {
    if (!services) return [];
    
    return services.filter((service) => {
      const matchesSearch = searchTerm === '' || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.prefix.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [services, searchTerm]);

  const handleEditService = (service: ServiceDefinition) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Recargar la lista de servicios
    handleModalClose();
  };

  const handleAnteproyectosClick = () => {
    navigate('/dashboard/anteproyectos');
  };

  const handleProyectosClick = () => {
    navigate('/dashboard/proyectos');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar los servicios: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Servicios Principales */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Servicios Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Card de Anteproyectos */}
          <div
            onClick={handleAnteproyectosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Anteproyectos
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Elaboración de expediente técnico
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona los anteproyectos de arquitectura, desde la documentación inicial hasta la aprobación final.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Anteproyectos</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Proyectos */}
          <div
            onClick={handleProyectosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏗️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Proyectos
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Expediente técnico completo
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona los proyectos completos con todas las especialidades: arquitectura, estructuras, sanitarias y eléctricas.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Proyectos</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-200"></div>

      {/* Configuración de Servicios */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Configuración de Servicios
        </h2>

        {/* Filtro de búsqueda */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Filter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar servicio..."
            filters={[]} // Sin filtros adicionales como especificaste
            onFilterChange={() => {}} // No hay filtros
            className="flex-1"
          />
        </div>

        {/* Grid de servicios */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton cards */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-4 mb-4">
                  <div className="h-3 bg-gray-200 rounded flex-1"></div>
                  <div className="h-3 bg-gray-200 rounded flex-1"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              No se encontraron servicios
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <EditServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        service={selectedService}
      />
    </div>
  );
}


