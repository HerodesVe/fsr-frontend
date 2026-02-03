import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { useGestionProyectos } from '@/hooks/useGestionProyectos';
import { GestionProyectoStatus } from '@/types/gestionProyecto.types';

export default function GestionProyectos() {
  const navigate = useNavigate();
  const { gestionProyectos, isLoading, error, refetch } = useGestionProyectos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<GestionProyectoStatus>(GestionProyectoStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Gestión de Proyectos',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    // Refetch al montar el componente
    refetch();
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, refetch]);

  const filterOptions = [
    { key: GestionProyectoStatus.TODOS, label: 'Todos' },
    { key: GestionProyectoStatus.PENDIENTE, label: 'Pendientes' },
    { key: GestionProyectoStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredGestionProyectos = useMemo(() => {
    if (!gestionProyectos) return [];

    return gestionProyectos.filter((gestion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (gestion.data?.selectedProyecto?.titulo_proyecto?.toLowerCase().includes(searchLower)) ||
        (gestion.instance_code?.toLowerCase().includes(searchLower)) ||
        (gestion.administrado?.toLowerCase().includes(searchLower)) ||
        (gestion.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(gestion.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case GestionProyectoStatus.TODOS:
          matchesStatus = true;
          break;
        case GestionProyectoStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case GestionProyectoStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [gestionProyectos, searchTerm, selectedStatus]);

  const handleGestionClick = (item: any) => {
    navigate(`/dashboard/gestion-proyectos/edit/${item.id}`);
  };

  const handleNewGestion = () => {
    navigate('/dashboard/gestion-proyectos/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las gestiones de proyecto: {(error as Error).message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as GestionProyectoStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewGestion}
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
      ) : filteredGestionProyectos.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== GestionProyectoStatus.TODOS 
            ? 'No se encontraron gestiones de proyecto que coincidan con los filtros.' 
            : 'No hay gestiones de proyecto registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGestionProyectos.map((gestion) => (
            <ProyectoCard
              key={gestion.id}
              item={gestion}
              onClick={handleGestionClick}
              type="gestion-proyecto"
            />
          ))}
        </div>
      )}
    </div>
  );
}
