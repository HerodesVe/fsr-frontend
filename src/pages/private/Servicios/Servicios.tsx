import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useServices } from '@/hooks/useServices';
import { useHeaderStore } from '@/store/headerStore';
import { EditServiceModal } from './components/EditServiceModal';
import type { ServiceDefinition } from '@/types/service.types';

// Configuración de las cards de servicios
interface ServiceCardConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bgColor: string;
  route: string;
  linkText: string;
}

const SERVICES_CONFIG: ServiceCardConfig[] = [
  {
    id: 'anteproyectos',
    title: 'Elaboración de Anteproyectos',
    subtitle: 'ELABORACIÓN DE EXPEDIENTES TÉCNICOS',
    description: 'Gestiona los anteproyectos de arquitectura, desde la documentación inicial hasta la aprobación final.',
    icon: '📋',
    bgColor: 'bg-teal-100',
    route: '/dashboard/anteproyectos',
    linkText: 'Acceder a Anteproyectos',
  },
  {
    id: 'proyectos',
    title: 'Elaboración de Proyectos',
    subtitle: 'Elaboración de Expedientes Técnicos',
    description: 'Gestiona los proyectos completos con todas las especialidades: arquitectura, estructuras, sanitarias y eléctricas.',
    icon: '🏗️',
    bgColor: 'bg-blue-100',
    route: '/dashboard/proyectos',
    linkText: 'Acceder a Proyectos',
  },
  {
    id: 'demoliciones',
    title: 'Demolición Total',
    subtitle: 'Gestión de demoliciones',
    description: 'Gestiona los procesos de demolición total con todas las especialidades y documentación requerida.',
    icon: '🏚️',
    bgColor: 'bg-red-100',
    route: '/dashboard/demoliciones',
    linkText: 'Acceder a Demoliciones',
  },
  {
    id: 'modificaciones',
    title: 'Modificación de Obra',
    subtitle: 'Modificaciones y ampliaciones',
    description: 'Gestiona las modificaciones de obras existentes, incluyendo ampliaciones, cambios de uso y remodelaciones en todas las modalidades.',
    icon: '🔧',
    bgColor: 'bg-purple-100',
    route: '/dashboard/modificaciones',
    linkText: 'Acceder a Modificaciones',
  },
  {
    id: 'regularizaciones',
    title: 'Regularización de Licencia',
    subtitle: 'Legalización de construcciones',
    description: 'Regulariza construcciones existentes que no cuentan con licencia de edificación mediante el proceso de legalización retroactiva.',
    icon: '📜',
    bgColor: 'bg-orange-100',
    route: '/dashboard/regularizaciones',
    linkText: 'Acceder a Regularizaciones',
  },
  {
    id: 'ampliaciones',
    title: 'Ampliación/Remodelación',
    subtitle: 'Modificaciones de obra',
    description: 'Gestiona proyectos de ampliación, remodelación y demolición con todas las especialidades y documentación técnica requerida.',
    icon: '🔨',
    bgColor: 'bg-indigo-100',
    route: '/dashboard/ampliaciones',
    linkText: 'Acceder a Ampliaciones',
  },
  {
    id: 'gestion-anexo',
    title: 'Gestión del Anexo H',
    subtitle: 'Supervisión de obra',
    description: 'Gestiona el proceso de supervisión de obra mediante el Anexo H, desde la documentación hasta la entrega al administrado.',
    icon: '📋',
    bgColor: 'bg-yellow-100',
    route: '/dashboard/gestion-anexo',
    linkText: 'Acceder a Gestión del Anexo',
  },
  {
    id: 'habilitaciones-urbanas',
    title: 'Habilitación Urbana',
    subtitle: 'Proyectos de habilitación urbana',
    description: 'Gestiona proyectos de licencia de habilitación urbana con elaboración y gestión de documentación técnica completa.',
    icon: '🏘️',
    bgColor: 'bg-cyan-100',
    route: '/dashboard/habilitaciones-urbanas',
    linkText: 'Acceder a Habilitaciones Urbanas',
  },
  {
    id: 'licencias-funcionamiento',
    title: 'Licencia de Funcionamiento',
    subtitle: 'Licencias comerciales y ITSE',
    description: 'Gestiona el proceso completo de licencias de funcionamiento, desde la consulta inicial hasta la entrega de certificados ITSE.',
    icon: '🏪',
    bgColor: 'bg-emerald-100',
    route: '/dashboard/licencias-funcionamiento',
    linkText: 'Acceder a Licencias de Funcionamiento',
  },
  {
    id: 'rectificacion-linderos',
    title: 'Rectificación de Linderos',
    subtitle: 'Elaboración y gestión',
    description: 'Gestiona el proceso completo de rectificación de linderos y áreas perimétricas, desde la elaboración hasta la aprobación final.',
    icon: '📐',
    bgColor: 'bg-amber-100',
    route: '/dashboard/rectificacion-linderos',
    linkText: 'Acceder a Rectificación de Linderos',
  },
  {
    id: 'gestion-anteproyectos',
    title: 'Gestión de Anteproyecto',
    subtitle: 'Trámite municipal de anteproyecto',
    description: 'Gestiona el trámite de un anteproyecto ante la municipalidad, desde la presentación hasta obtener la conformidad final.',
    icon: '📋',
    bgColor: 'bg-pink-100',
    route: '/dashboard/gestion-anteproyectos',
    linkText: 'Acceder a Gestión de Anteproyecto',
  },
  {
    id: 'gestion-proyectos',
    title: 'Gestión de Proyecto',
    subtitle: 'Trámite municipal de proyecto completo',
    description: 'Gestiona el proyecto completo ante la municipalidad, aprobando cada especialidad secuencialmente para obtener la licencia final.',
    icon: '🏗️',
    bgColor: 'bg-violet-100',
    route: '/dashboard/gestion-proyectos',
    linkText: 'Acceder a Gestión de Proyecto',
  },
  {
    id: 'gestion-conformidad-con-variacion',
    title: 'Gestión Conformidad Con Variación',
    subtitle: 'Conformidad de obra con variaciones',
    description: 'Gestiona el trámite de conformidad de obra cuando existen variaciones respecto a los planos aprobados originalmente.',
    icon: '✅',
    bgColor: 'bg-emerald-100',
    route: '/dashboard/gestion-conformidad-con-variacion',
    linkText: 'Acceder a Conformidad Con Variación',
  },
  {
    id: 'gestion-conformidad-sin-variacion',
    title: 'Gestión Conformidad Sin Variación',
    subtitle: 'Conformidad de obra sin variaciones',
    description: 'Gestiona el trámite de conformidad de obra cuando la construcción se ejecutó conforme a los planos aprobados.',
    icon: '☑️',
    bgColor: 'bg-lime-100',
    route: '/dashboard/gestion-conformidad-sin-variacion',
    linkText: 'Acceder a Conformidad Sin Variación',
  },
  {
    id: 'elaboracion-conformidad-con-variacion',
    title: 'Elaboración Conformidad Con Variación',
    subtitle: 'Elaboración de expediente con variaciones',
    description: 'Elabora el expediente técnico de conformidad de obra cuando existen variaciones respecto a los planos aprobados.',
    icon: '📝',
    bgColor: 'bg-rose-100',
    route: '/dashboard/elaboracion-conformidad-con-variacion',
    linkText: 'Acceder a Elaboración Con Variación',
  },
  {
    id: 'elaboracion-conformidad-sin-variacion',
    title: 'Elaboración Conformidad Sin Variación',
    subtitle: 'Elaboración de expediente sin variaciones',
    description: 'Elabora el expediente técnico de conformidad de obra cuando la construcción se ejecutó conforme a los planos aprobados.',
    icon: '📄',
    bgColor: 'bg-sky-100',
    route: '/dashboard/elaboracion-conformidad-sin-variacion',
    linkText: 'Acceder a Elaboración Sin Variación',
  },
];

// Componente de Card reutilizable
interface ServiceCardProps {
  config: ServiceCardConfig;
  onClick: (route: string) => void;
}

const ServiceCard = ({ config, onClick }: ServiceCardProps) => (
  <div
    onClick={() => onClick(config.route)}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <span className="text-2xl">{config.icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
          {config.title}
        </h3>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          {config.subtitle}
        </p>
      </div>
    </div>
    <p className="text-gray-700 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
      {config.description}
    </p>
    <div className="flex items-center text-teal-600 font-medium text-sm">
      <span>{config.linkText}</span>
      <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

export default function Servicios() {
  const navigate = useNavigate();
  const { services, isLoading, error, refetch } = useServices();
  const [searchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setHeader } = useHeaderStore();

  // Configurar el header cuando el componente se monta
  useEffect(() => {
    setHeader(
      'Servicios',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleModalSuccess = () => {
    refetch();
    handleModalClose();
  };

  const handleCardClick = (route: string) => {
    navigate(route);
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
          {SERVICES_CONFIG.map((service) => (
            <ServiceCard
              key={service.id}
              config={service}
              onClick={handleCardClick}
            />
          ))}
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


