import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { HabilitacionUrbana, HabilitacionUrbanaStatus } from '@/types/habilitacionUrbana.types';

// Data dummy para desarrollo
const habilitacionesUrbanasDummy: HabilitacionUrbana[] = [
  {
    id: '1',
    instance_code: 'HU-2024-001',
    administrado: 'Inmobiliaria Del Sur S.A.C.',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '20/03/2024',
    status: 'Completado',
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-03-20T00:00:00Z',
    data: {
      nombre_proyecto: 'Habilitación Urbana Residencial Los Pinos',
      tipo_habilitacion: 'Habilitación Urbana Nueva',
      uso_habilitacion: 'Residencial'
    },
    steps_status: {
      administrado: 'Completada',
      informacion_inicial: 'Completada',
      documentacion_tecnica: 'Completada',
      base_legal: 'Completada',
      ingreso_expediente: 'Completada',
      revision_observaciones: 'Completada',
      aprobacion_final: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'HU-2024-002',
    administrado: 'Constructora Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Habilitación Comercial Centro Empresarial',
      tipo_habilitacion: 'Habilitación Urbana con Construcción Simultánea',
      uso_habilitacion: 'Comercial'
    },
    steps_status: {
      administrado: 'Completada',
      informacion_inicial: 'Completada',
      documentacion_tecnica: 'En progreso',
      base_legal: 'Pendiente',
      ingreso_expediente: 'Pendiente',
      revision_observaciones: 'Pendiente',
      aprobacion_final: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'HU-2024-003',
    administrado: 'Desarrollos Industriales S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Regularización Habilitación Industrial',
      tipo_habilitacion: 'Regularización de Habilitación Urbana',
      uso_habilitacion: 'Industrial'
    },
    steps_status: {
      administrado: 'Completada',
      informacion_inicial: 'Pendiente',
      documentacion_tecnica: 'Pendiente',
      base_legal: 'Pendiente',
      ingreso_expediente: 'Pendiente',
      revision_observaciones: 'Pendiente',
      aprobacion_final: 'Pendiente'
    }
  }
];

export default function HabilitacionesUrbanas() {
  const navigate = useNavigate();
  const [habilitaciones] = useState<HabilitacionUrbana[]>(habilitacionesUrbanasDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<HabilitacionUrbanaStatus>(HabilitacionUrbanaStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Proyecto de Licencia de Habilitación Urbana',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: HabilitacionUrbanaStatus.TODOS, label: 'Todos' },
    { key: HabilitacionUrbanaStatus.PENDIENTE, label: 'Pendientes' },
    { key: HabilitacionUrbanaStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredHabilitaciones = useMemo(() => {
    if (!habilitaciones) return [];

    return habilitaciones.filter((habilitacion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (habilitacion.data?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
        (habilitacion.instance_code?.toLowerCase().includes(searchLower)) ||
        (habilitacion.administrado?.toLowerCase().includes(searchLower)) ||
        (habilitacion.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(habilitacion.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case HabilitacionUrbanaStatus.TODOS:
          matchesStatus = true;
          break;
        case HabilitacionUrbanaStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case HabilitacionUrbanaStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [habilitaciones, searchTerm, selectedStatus]);

  const handleHabilitacionClick = (item: any) => {
    navigate(`/dashboard/habilitaciones-urbanas/edit/${item.id}`);
  };

  const handleNewHabilitacion = () => {
    navigate('/dashboard/habilitaciones-urbanas/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las habilitaciones urbanas: {error.message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as HabilitacionUrbanaStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewHabilitacion}
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
      ) : filteredHabilitaciones.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== HabilitacionUrbanaStatus.TODOS 
            ? 'No se encontraron habilitaciones urbanas que coincidan con los filtros.' 
            : 'No hay habilitaciones urbanas registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabilitaciones.map((habilitacion) => (
            <ProyectoCard
              key={habilitacion.id}
              item={habilitacion}
              onClick={handleHabilitacionClick}
              type="habilitacion-urbana"
            />
          ))}
        </div>
      )}
    </div>
  );
}
