import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { useProyectos } from '@/hooks/useProyectos';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { Proyecto, ProyectoStatus } from '@/types/proyecto.types';

export default function Proyectos() {
  const navigate = useNavigate();
  const { proyectos, isLoading, error, refetch } = useProyectos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProyectoStatus>(ProyectoStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Elaboración de expediente técnico de Arquitectura para Proyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    // Refetch data when component mounts
    refetch();
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, refetch]);

  const filterOptions = [
    { key: ProyectoStatus.TODOS, label: 'Todos' },
    { key: ProyectoStatus.PENDIENTE, label: 'Pendientes' },
    { key: ProyectoStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredProyectos = useMemo(() => {
    if (!proyectos) return [];

    return proyectos.filter((proyecto) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (proyecto.data?.titulo_proyecto?.toLowerCase().includes(searchLower)) ||
        (proyecto.instance_code?.toLowerCase().includes(searchLower)) ||
        (proyecto.administrado?.toLowerCase().includes(searchLower)) ||
        (proyecto.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(proyecto.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case ProyectoStatus.TODOS:
          matchesStatus = true;
          break;
        case ProyectoStatus.PENDIENTE:
          matchesStatus = progress < 100; // Borrador, en progreso, etc.
          break;
        case ProyectoStatus.COMPLETADO:
          matchesStatus = progress === 100; // Solo completados al 100%
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [proyectos, searchTerm, selectedStatus]);

  const handleProyectoClick = (proyecto: Proyecto) => {
    navigate(`/dashboard/proyectos/edit/${proyecto.id}`);
  };

  const handleNewProyecto = () => {
    navigate('/dashboard/proyectos/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar los proyectos: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Filter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por nombre de proyecto, trámite, administrado o responsable..."
          filters={filterOptions}
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as ProyectoStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewProyecto}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="text-white hover:opacity-90"
          startContent={<LuPlus className="w-5 h-5" />}
        >
          Nuevo Trámite
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredProyectos.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== ProyectoStatus.TODOS 
            ? 'No se encontraron proyectos que coincidan con los filtros.' 
            : 'No hay proyectos registrados.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <ProyectoCard
              key={proyecto.id}
              item={proyecto}
              onClick={handleProyectoClick}
              type="proyecto"
            />
          ))}
        </div>
      )}
    </div>
  );
}