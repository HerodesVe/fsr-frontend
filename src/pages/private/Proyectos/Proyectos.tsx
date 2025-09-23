import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
// import { useProyectos } from '@/hooks/useProyectos';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { Proyecto, ProyectoStatus } from '@/types/proyecto.types';

// Data dummy para desarrollo
const proyectosDummy: Proyecto[] = [
  {
    id: '1',
    instance_code: 'PRO-2024-001',
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
      service_type: 'proyecto',
      titulo_proyecto: 'Edificio Residencial San Isidro',
      tipo_proyecto: 'Residencial',
      descripcion: 'Proyecto de edificio residencial de 8 pisos',
      arquitectura_docs: {} as any,
      estructuras_docs: {} as any,
      electricas_docs: {} as any,
      sanitarias_docs: {} as any
    },
    steps_status: {
      anteproyecto: 'Completada',
      licencias_normativas: 'Completada',
      arquitectura: 'Completada',
      estructuras: 'Completada',
      electricas: 'Completada',
      sanitarias: 'Completada',
      sustento_tecnico: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'PRO-2024-002',
    service_id: 'serv-002',
    client_id: 'client-002',
    user_id: 'user-002',
    administrado: 'Inversiones Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    progress_percentage: 25,
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: undefined,
    next_step: 'estructuras',
    uploaded_documents: [],
    data: {
      service_type: 'proyecto',
      titulo_proyecto: 'Centro Comercial Miraflores',
      tipo_proyecto: 'Comercial',
      descripcion: 'Centro comercial de 3 niveles con estacionamiento',
      arquitectura_docs: {} as any,
      estructuras_docs: {} as any,
      electricas_docs: {} as any,
      sanitarias_docs: {} as any
    },
    steps_status: {
      anteproyecto: 'Completada',
      licencias_normativas: 'Completada',
      arquitectura: 'En progreso',
      estructuras: 'Pendiente',
      electricas: 'Pendiente',
      sanitarias: 'Pendiente',
      sustento_tecnico: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'PRO-2024-003',
    service_id: 'serv-003',
    client_id: 'client-003',
    user_id: 'user-003',
    administrado: 'Desarrollos Sur S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    progress_percentage: 10,
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: undefined,
    next_step: 'licencias_normativas',
    uploaded_documents: [],
    data: {
      service_type: 'proyecto',
      titulo_proyecto: 'Oficinas Corporativas La Molina',
      tipo_proyecto: 'Oficinas',
      descripcion: 'Edificio de oficinas de 6 pisos',
      arquitectura_docs: {} as any,
      estructuras_docs: {} as any,
      electricas_docs: {} as any,
      sanitarias_docs: {} as any
    },
    steps_status: {
      anteproyecto: 'Completada',
      licencias_normativas: 'Pendiente',
      arquitectura: 'Pendiente',
      estructuras: 'Pendiente',
      electricas: 'Pendiente',
      sanitarias: 'Pendiente',
      sustento_tecnico: 'Pendiente'
    }
  }
];

export default function Proyectos() {
  const navigate = useNavigate();
  // const { proyectos, isLoading, error, refetch } = useProyectos();
  const [proyectos] = useState<Proyecto[]>(proyectosDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProyectoStatus>(ProyectoStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Elaboración de expediente técnico de Arquitectura para Proyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    // Refetch data when component mounts
    // refetch();
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

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

  const handleProyectoClick = (item: any) => {
    navigate(`/dashboard/proyectos/edit/${item.id}`);
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