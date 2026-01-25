import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useServices } from '@/hooks/useServices';
import { useHeaderStore } from '@/store/headerStore';
// import { Filter } from '@/components/ui';
// import { ServiceCard } from './components/ServiceCard';
import { EditServiceModal } from './components/EditServiceModal';
import type { ServiceDefinition } from '@/types/service.types';

export default function Servicios() {
  const navigate = useNavigate();
  const { services, isLoading, error, refetch } = useServices();
  const [searchTerm ] = useState('');
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

  // const handleEditService = (service: ServiceDefinition) => {
  //   setSelectedService(service);
  //   setIsModalOpen(true);
  // };

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

  const handleDemolicionesClick = () => {
    navigate('/dashboard/demoliciones');
  };

  const handleConformidadesClick = () => {
    navigate('/dashboard/conformidades');
  };

  const handleModificacionesClick = () => {
    navigate('/dashboard/modificaciones');
  };

  const handleRegularizacionesClick = () => {
    navigate('/dashboard/regularizaciones');
  };

  const handleAmpliacionesClick = () => {
    navigate('/dashboard/ampliaciones');
  };

  const handleGestionAnexoClick = () => {
    navigate('/dashboard/gestion-anexo');
  };

  const handleHabilitacionesUrbanasClick = () => {
    navigate('/dashboard/habilitaciones-urbanas');
  };

  const handleLicenciasFuncionamientoClick = () => {
    navigate('/dashboard/licencias-funcionamiento');
  };

  const handleRectificacionLinderosClick = () => {
    navigate('/dashboard/rectificacion-linderos');
  };

  const handleGestionAnteproyectosClick = () => {
    navigate('/dashboard/gestion-anteproyectos');
  };

  const handleGestionProyectosClick = () => {
    navigate('/dashboard/gestion-proyectos');
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
    <div className="p-4 sm:p-6 space-y-8">
      {/* Servicios Principales */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Servicios Principales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
          {/* Card de Anteproyectos */}
          <div
            onClick={handleAnteproyectosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Elaboracion de Anteproyectos
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Elaboración de expediente técnico
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona los anteproyectos de arquitectura, desde la documentación inicial hasta la aprobación final.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Anteproyectos</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Proyectos */}
          <div
            onClick={handleProyectosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏗️</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Proyectos
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Expediente técnico completo
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona los proyectos completos con todas las especialidades: arquitectura, estructuras, sanitarias y eléctricas.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Proyectos</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Demoliciones */}
          <div
            onClick={handleDemolicionesClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏚️</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Demolición Total
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Gestión de demoliciones
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona los procesos de demolición total con todas las especialidades y documentación requerida.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Demoliciones</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Conformidad de Obra */}
          <div
            onClick={handleConformidadesClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Conformidad de Obra
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Certificación de conformidad
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona los trámites de conformidad de obra en sus diferentes modalidades: sin variaciones, con variaciones y casco habitable.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Conformidades</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Modificación de Obra */}
          <div
            onClick={handleModificacionesClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Modificación de Obra
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Modificaciones y ampliaciones
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona las modificaciones de obras existentes, incluyendo ampliaciones, cambios de uso y remodelaciones en todas las modalidades.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Modificaciones</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Regularización de Licencia */}
          <div
            onClick={handleRegularizacionesClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📜</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Regularización de Licencia
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Legalización de construcciones
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Regulariza construcciones existentes que no cuentan con licencia de edificación mediante el proceso de legalización retroactiva.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Regularizaciones</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Ampliación, Remodelación, Demolición */}
          <div
            onClick={handleAmpliacionesClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔨</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Ampliación/Remodelación
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Modificaciones de obra
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona proyectos de ampliación, remodelación y demolición con todas las especialidades y documentación técnica requerida.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Ampliaciones</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Gestión del Anexo H */}
          <div
            onClick={handleGestionAnexoClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Gestión del Anexo H
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Supervisión de obra
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona el proceso de supervisión de obra mediante el Anexo H, desde la documentación hasta la entrega al administrado.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Gestión del Anexo</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Proyecto de Licencia de Habilitación Urbana */}
          <div
            onClick={handleHabilitacionesUrbanasClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏘️</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Habilitación Urbana
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Proyectos de habilitación urbana
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona proyectos de licencia de habilitación urbana con elaboración y gestión de documentación técnica completa.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Habilitaciones Urbanas</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Licencia de Funcionamiento */}
          <div
            onClick={handleLicenciasFuncionamientoClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏪</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Licencia de Funcionamiento
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Licencias comerciales y ITSE
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona el proceso completo de licencias de funcionamiento, desde la consulta inicial hasta la entrega de certificados ITSE.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Licencias de Funcionamiento</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Rectificación de Linderos */}
          <div
            onClick={handleRectificacionLinderosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📐</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Rectificación de Linderos
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Elaboración y gestión
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona el proceso completo de rectificación de linderos y áreas perimétricas, desde la elaboración hasta la aprobación final.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Rectificación de Linderos</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Gestión de Anteproyecto */}
          <div
            onClick={handleGestionAnteproyectosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Gestión de Anteproyecto
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Trámite municipal de anteproyecto
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona el trámite de un anteproyecto ante la municipalidad, desde la presentación hasta obtener la conformidad final.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Gestión de Anteproyecto</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card de Gestión de Proyecto */}
          <div
            onClick={handleGestionProyectosClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏗️</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Gestión de Proyecto
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Trámite municipal de proyecto completo
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gestiona el proyecto completo ante la municipalidad, aprobando cada especialidad secuencialmente para obtener la licencia final.
            </p>
            <div className="flex items-center text-teal-600 font-medium text-sm">
              <span>Acceder a Gestión de Proyecto</span>
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {/* <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Configuración de Servicios
        </h2> */}

        {/* Filtro de búsqueda */}
        {/* <div className="flex items-center justify-between gap-4 mb-6">
          <Filter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar servicio..."
            filters={[]} // Sin filtros adicionales como especificaste
            onFilterChange={() => {}} // No hay filtros
            className="flex-1"
          />
        </div> */}

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
              {/* {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                />
              ))} */}
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


