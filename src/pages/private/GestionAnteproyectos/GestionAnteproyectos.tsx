import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { GestionAnteproyecto, GestionAnteproyectoStatus } from '@/types/gestionAnteproyecto.types';

// Data dummy para desarrollo
const gestionAnteproyectosDummy: GestionAnteproyecto[] = [
  {
    id: '1',
    instance_code: 'GA-2024-001',
    service_id: 'serv-001',
    client_id: 'client-001',
    user_id: 'user-001',
    administrado: 'Constructora Lima S.A.C.',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '20/01/2024',
    status: 'Completado',
    progress_percentage: 100,
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-01-20T00:00:00Z',
    next_step: 'completado',
    uploaded_documents: [],
    data: {
      selectedAnteproyecto: { nombre_proyecto: 'Edificio Residencial San Isidro' },
    },
    steps_status: {
      seleccion_anteproyecto: 'Completada',
      presentacion_municipal: 'Completada',
      seguimiento_respuesta: 'Completada',
      entrega_final: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'GA-2024-002',
    service_id: 'serv-002',
    client_id: 'client-002',
    user_id: 'user-002',
    administrado: 'Inversiones Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    progress_percentage: 50,
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: undefined,
    next_step: 'seguimiento_respuesta',
    uploaded_documents: [],
    data: {
      selectedAnteproyecto: { nombre_proyecto: 'Centro Comercial Miraflores' },
    },
    steps_status: {
      seleccion_anteproyecto: 'Completada',
      presentacion_municipal: 'Completada',
      seguimiento_respuesta: 'En progreso',
      entrega_final: 'Pendiente'
    }
  }
];

export default function GestionAnteproyectos() {
  const navigate = useNavigate();
  const [gestionAnteproyectos] = useState<GestionAnteproyecto[]>(gestionAnteproyectosDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<GestionAnteproyectoStatus>(GestionAnteproyectoStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Gestión de Anteproyectos',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: GestionAnteproyectoStatus.TODOS, label: 'Todos' },
    { key: GestionAnteproyectoStatus.PENDIENTE, label: 'Pendientes' },
    { key: GestionAnteproyectoStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredGestionAnteproyectos = useMemo(() => {
    if (!gestionAnteproyectos) return [];

    return gestionAnteproyectos.filter((gestion) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (gestion.data?.selectedAnteproyecto?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
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
        case GestionAnteproyectoStatus.TODOS:
          matchesStatus = true;
          break;
        case GestionAnteproyectoStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case GestionAnteproyectoStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [gestionAnteproyectos, searchTerm, selectedStatus]);

  const handleGestionClick = (item: any) => {
    navigate(`/dashboard/gestion-anteproyectos/edit/${item.id}`);
  };

  const handleNewGestion = () => {
    navigate('/dashboard/gestion-anteproyectos/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las gestiones de anteproyecto: {error.message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as GestionAnteproyectoStatus)}
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
      ) : filteredGestionAnteproyectos.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== GestionAnteproyectoStatus.TODOS 
            ? 'No se encontraron gestiones de anteproyecto que coincidan con los filtros.' 
            : 'No hay gestiones de anteproyecto registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGestionAnteproyectos.map((gestion) => (
            <ProyectoCard
              key={gestion.id}
              item={gestion}
              onClick={handleGestionClick}
              type="gestion-anteproyecto"
            />
          ))}
        </div>
      )}
    </div>
  );
}
