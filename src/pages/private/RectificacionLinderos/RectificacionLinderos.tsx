import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { RectificacionLinderos, RectificacionLinderosStatus } from '@/types/rectificacionLinderos.types';

// Data dummy para desarrollo
const rectificacionLinderosDummy: RectificacionLinderos[] = [
  {
    id: '1',
    instance_code: 'RL-2024-001',
    administrado: 'Constructora Lima S.A.C.',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '25/01/2024',
    status: 'Completado',
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-01-25T00:00:00Z',
    data: {
      nombre_proyecto: 'Rectificación Linderos Residencial San Isidro',
      anteproyecto_asociado: 'ANT-2024-001'
    },
    steps_status: {
      administrado: 'Completada',
      seleccion_anteproyecto: 'Completada',
      documentos_legales: 'Completada',
      elaboracion_plano: 'Completada',
      programacion_cita: 'Completada',
      seguimiento_observaciones: 'Completada',
      aprobacion_final: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'RL-2024-002',
    administrado: 'Inversiones Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Rectificación Linderos Comercial Miraflores',
      anteproyecto_asociado: 'ANT-2024-002'
    },
    steps_status: {
      administrado: 'Completada',
      seleccion_anteproyecto: 'Completada',
      documentos_legales: 'En progreso',
      elaboracion_plano: 'Pendiente',
      programacion_cita: 'Pendiente',
      seguimiento_observaciones: 'Pendiente',
      aprobacion_final: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'RL-2024-003',
    administrado: 'Desarrollos Sur S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Rectificación Linderos Industrial Callao',
      anteproyecto_asociado: 'ANT-2024-003'
    },
    steps_status: {
      administrado: 'Completada',
      seleccion_anteproyecto: 'Pendiente',
      documentos_legales: 'Pendiente',
      elaboracion_plano: 'Pendiente',
      programacion_cita: 'Pendiente',
      seguimiento_observaciones: 'Pendiente',
      aprobacion_final: 'Pendiente'
    }
  }
];

export default function RectificacionLinderosPage() {
  const navigate = useNavigate();
  const [rectificaciones] = useState<RectificacionLinderos[]>(rectificacionLinderosDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RectificacionLinderosStatus>(RectificacionLinderosStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Elaboración y Gestión de Rectificación de Linderos',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: RectificacionLinderosStatus.TODOS, label: 'Todos' },
    { key: RectificacionLinderosStatus.PENDIENTE, label: 'Pendientes' },
    { key: RectificacionLinderosStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredRectificaciones = useMemo(() => {
    if (!rectificaciones) return [];

    return rectificaciones.filter((rectificacion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (rectificacion.data?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
        (rectificacion.instance_code?.toLowerCase().includes(searchLower)) ||
        (rectificacion.administrado?.toLowerCase().includes(searchLower)) ||
        (rectificacion.responsable?.toLowerCase().includes(searchLower)) ||
        (rectificacion.data?.anteproyecto_asociado?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(rectificacion.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case RectificacionLinderosStatus.TODOS:
          matchesStatus = true;
          break;
        case RectificacionLinderosStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case RectificacionLinderosStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [rectificaciones, searchTerm, selectedStatus]);

  const handleRectificacionClick = (item: any) => {
    navigate(`/dashboard/rectificacion-linderos/edit/${item.id}`);
  };

  const handleNewRectificacion = () => {
    navigate('/dashboard/rectificacion-linderos/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las rectificaciones de linderos: {error.message}
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
          searchPlaceholder="Buscar por nombre de proyecto, trámite, administrado, responsable o anteproyecto..."
          filters={filterOptions}
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as RectificacionLinderosStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewRectificacion}
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
      ) : filteredRectificaciones.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== RectificacionLinderosStatus.TODOS 
            ? 'No se encontraron rectificaciones de linderos que coincidan con los filtros.' 
            : 'No hay rectificaciones de linderos registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRectificaciones.map((rectificacion) => (
            <ProyectoCard
              key={rectificacion.id}
              item={rectificacion}
              onClick={handleRectificacionClick}
              type="rectificacion-linderos"
            />
          ))}
        </div>
      )}
    </div>
  );
}
