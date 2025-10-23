import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { RegularizacionStatus } from '@/types/regularizacion.types';
import { useRegularizaciones } from '@/hooks/useRegularizaciones';

export default function Regularizaciones() {
  const navigate = useNavigate();
  const { regularizaciones, isLoading, error } = useRegularizaciones();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RegularizacionStatus>(RegularizacionStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Regularización de Licencia de Edificación',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: RegularizacionStatus.TODOS, label: 'Todos' },
    { key: RegularizacionStatus.PENDIENTE, label: 'Pendientes' },
    { key: RegularizacionStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredRegularizaciones = useMemo(() => {
    if (!regularizaciones) return [];

    return regularizaciones.filter((regularizacion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (regularizacion.data?.titulo_proceso?.toLowerCase().includes(searchLower)) ||
        (regularizacion.instance_code?.toLowerCase().includes(searchLower)) ||
        (regularizacion.administrado?.toLowerCase().includes(searchLower)) ||
        (regularizacion.responsable?.toLowerCase().includes(searchLower));

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case RegularizacionStatus.TODOS:
          matchesStatus = true;
          break;
        case RegularizacionStatus.PENDIENTE:
          matchesStatus = regularizacion.progress_percentage < 100;
          break;
        case RegularizacionStatus.COMPLETADO:
          matchesStatus = regularizacion.progress_percentage === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [regularizaciones, searchTerm, selectedStatus]);

  const handleRegularizacionClick = (item: any) => {
    navigate(`/dashboard/regularizaciones/edit/${item.id}`);
  };

  const handleNewRegularizacion = () => {
    navigate('/dashboard/regularizaciones/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error al cargar las regularizaciones</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header con filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <Filter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar regularizaciones..."
            filters={filterOptions.map(option => ({
              key: option.key,
              label: option.label,
              isActive: selectedStatus === option.key
            }))}
            onFilterChange={(filterKey) => setSelectedStatus(filterKey as RegularizacionStatus)}
          />
        </div>
        <Button
          onClick={handleNewRegularizacion}
          startContent={<LuPlus className="w-4 h-4" />}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="text-white hover:opacity-90"
        >
          Nueva Regularización
        </Button>
      </div>

      {/* Lista de regularizaciones */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      ) : filteredRegularizaciones.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {searchTerm || selectedStatus !== RegularizacionStatus.TODOS 
                ? 'No se encontraron regularizaciones' 
                : 'No hay regularizaciones aún'
              }
            </h3>
            <p className="text-gray-500 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              {searchTerm || selectedStatus !== RegularizacionStatus.TODOS
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primera regularización de licencia'
              }
            </p>
            {(!searchTerm && selectedStatus === RegularizacionStatus.TODOS) && (
              <Button
                onClick={handleNewRegularizacion}
                startContent={<LuPlus className="w-4 h-4" />}
                style={{ backgroundColor: 'var(--primary-color)' }}
                className="text-white hover:opacity-90"
              >
                Nueva Regularización
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegularizaciones.map((regularizacion) => (
            <ProyectoCard
              key={regularizacion.id}
              item={regularizacion}
              type="regularizacion"
              onClick={() => handleRegularizacionClick(regularizacion)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
