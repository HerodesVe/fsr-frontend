import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { Demolicion, DemolicionStatus } from '@/types/demolicion.types';

// Data dummy para desarrollo
const demolicionesDummy: Demolicion[] = [
  {
    id: '1',
    instance_code: 'DEM-2024-001',
    administrado: 'Constructora Lima S.A.C.',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '20/01/2024',
    status: 'Completado',
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-01-20T00:00:00Z',
    data: {
      nombre_proyecto: 'Demolición Edificio Central'
    },
    steps_status: {
      administrado: 'Completada',
      documentacion: 'Completada',
      medidas_perimetricas: 'Completada',
      gestion_municipal: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'DEM-2024-002',
    administrado: 'Inversiones Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Demolición Residencial San Isidro'
    },
    steps_status: {
      administrado: 'Completada',
      documentacion: 'En progreso',
      medidas_perimetricas: 'Pendiente',
      gestion_municipal: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'DEM-2024-003',
    administrado: 'Desarrollos Sur S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Demolición Comercial Miraflores'
    },
    steps_status: {
      administrado: 'Completada',
      documentacion: 'Pendiente',
      medidas_perimetricas: 'Pendiente',
      gestion_municipal: 'Pendiente'
    }
  }
];

export default function Demoliciones() {
  const navigate = useNavigate();
  const [demoliciones] = useState<Demolicion[]>(demolicionesDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DemolicionStatus>(DemolicionStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Demolición Total',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: DemolicionStatus.TODOS, label: 'Todos' },
    { key: DemolicionStatus.PENDIENTE, label: 'Pendientes' },
    { key: DemolicionStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredDemoliciones = useMemo(() => {
    if (!demoliciones) return [];

    return demoliciones.filter((demolicion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (demolicion.data?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
        (demolicion.instance_code?.toLowerCase().includes(searchLower)) ||
        (demolicion.administrado?.toLowerCase().includes(searchLower)) ||
        (demolicion.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(demolicion.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case DemolicionStatus.TODOS:
          matchesStatus = true;
          break;
        case DemolicionStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case DemolicionStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [demoliciones, searchTerm, selectedStatus]);

  const handleDemolicionClick = (item: any) => {
    navigate(`/dashboard/demoliciones/edit/${item.id}`);
  };

  const handleNewDemolicion = () => {
    navigate('/dashboard/demoliciones/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las demoliciones: {error.message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as DemolicionStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewDemolicion}
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
      ) : filteredDemoliciones.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== DemolicionStatus.TODOS 
            ? 'No se encontraron demoliciones que coincidan con los filtros.' 
            : 'No hay demoliciones registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemoliciones.map((demolicion) => (
            <ProyectoCard
              key={demolicion.id}
              item={demolicion}
              onClick={handleDemolicionClick}
              type="demolicion"
            />
          ))}
        </div>
      )}
    </div>
  );
}
