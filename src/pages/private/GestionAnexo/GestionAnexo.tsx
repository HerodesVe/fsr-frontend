import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { GestionAnexoItem, GestionAnexoStatus } from '@/types/gestionAnexo.types';

// Data dummy para desarrollo
const gestionAnexoDummy: GestionAnexoItem[] = [
  {
    id: '1',
    instance_code: 'GA-2024-001',
    administrado: 'Constructora Lima S.A.C.',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '25/01/2024',
    status: 'Completado',
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-01-25T00:00:00Z',
    data: {
      nombre_proyecto: 'Anexo H - Edificio Central'
    },
    steps_status: {
      administrado: 'Completada',
      documentacion: 'Completada',
      presentacion: 'Completada',
      cierre: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'GA-2024-002',
    administrado: 'Inversiones Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Anexo H - Residencial San Isidro'
    },
    steps_status: {
      administrado: 'Completada',
      documentacion: 'En progreso',
      presentacion: 'Pendiente',
      cierre: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'GA-2024-003',
    administrado: 'Desarrollos Sur S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Anexo H - Comercial Miraflores'
    },
    steps_status: {
      administrado: 'Completada',
      documentacion: 'Pendiente',
      presentacion: 'Pendiente',
      cierre: 'Pendiente'
    }
  }
];

export default function GestionAnexo() {
  const navigate = useNavigate();
  const [gestionesAnexo] = useState<GestionAnexoItem[]>(gestionAnexoDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<GestionAnexoStatus>(GestionAnexoStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Gestión del Anexo H',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: GestionAnexoStatus.TODOS, label: 'Todos' },
    { key: GestionAnexoStatus.PENDIENTE, label: 'Pendientes' },
    { key: GestionAnexoStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredGestiones = useMemo(() => {
    if (!gestionesAnexo) return [];

    return gestionesAnexo.filter((gestion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (gestion.data?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
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
        case GestionAnexoStatus.TODOS:
          matchesStatus = true;
          break;
        case GestionAnexoStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case GestionAnexoStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [gestionesAnexo, searchTerm, selectedStatus]);

  const handleGestionClick = (item: any) => {
    navigate(`/dashboard/gestion-anexo/edit/${item.id}`);
  };

  const handleNewGestion = () => {
    navigate('/dashboard/gestion-anexo/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las gestiones del anexo: {error.message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as GestionAnexoStatus)}
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
      ) : filteredGestiones.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== GestionAnexoStatus.TODOS 
            ? 'No se encontraron gestiones del anexo que coincidan con los filtros.' 
            : 'No hay gestiones del anexo registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGestiones.map((gestion) => (
            <ProyectoCard
              key={gestion.id}
              item={gestion}
              onClick={handleGestionClick}
              type="gestion-anexo"
            />
          ))}
        </div>
      )}
    </div>
  );
}
