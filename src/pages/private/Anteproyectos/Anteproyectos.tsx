import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { useAnteproyectos } from '@/hooks/useAnteproyectos';
import { AnteproyectoCard } from './components/AnteproyectoCard';
import { Anteproyecto, AnteproyectoStatus } from '@/types/anteproyecto.types';

export default function Anteproyectos() {
  const navigate = useNavigate();
  const { anteproyectos, isLoading, error, refetch } = useAnteproyectos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AnteproyectoStatus>(AnteproyectoStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Elaboración de expediente técnico de Arquitectura para Anteproyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    // Refetch data when component mounts
    refetch();
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, refetch]);

  const filterOptions = [
    { key: AnteproyectoStatus.TODOS, label: 'Todos' },
    { key: AnteproyectoStatus.PENDIENTE, label: 'Pendientes' },
    { key: AnteproyectoStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredAnteproyectos = useMemo(() => {
    if (!anteproyectos) return [];

    return anteproyectos.filter((anteproyecto) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (anteproyecto.data?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
        (anteproyecto.instance_code?.toLowerCase().includes(searchLower)) ||
        (anteproyecto.administrado?.toLowerCase().includes(searchLower)) ||
        (anteproyecto.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(anteproyecto.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case AnteproyectoStatus.TODOS:
          matchesStatus = true;
          break;
        case AnteproyectoStatus.PENDIENTE:
          matchesStatus = progress < 100; // Borrador, en progreso, etc.
          break;
        case AnteproyectoStatus.COMPLETADO:
          matchesStatus = progress === 100; // Solo completados al 100%
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [anteproyectos, searchTerm, selectedStatus]);

  const handleAnteproyectoClick = (anteproyecto: Anteproyecto) => {
    navigate(`/dashboard/anteproyectos/edit/${anteproyecto.id}`);
  };

  const handleNewAnteproyecto = () => {
    navigate('/dashboard/anteproyectos/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar los anteproyectos: {error.message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as AnteproyectoStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewAnteproyecto}
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
      ) : filteredAnteproyectos.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== AnteproyectoStatus.TODOS 
            ? 'No se encontraron anteproyectos que coincidan con los filtros.' 
            : 'No hay anteproyectos registrados.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnteproyectos.map((anteproyecto) => (
            <AnteproyectoCard
              key={anteproyecto.id}
              anteproyecto={anteproyecto}
              onClick={handleAnteproyectoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
