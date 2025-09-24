import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { Conformidad, ConformidadStatus } from '@/types/conformidad.types';

// Data dummy para desarrollo
const conformidadesDummy: Conformidad[] = [
  {
    id: '1',
    instance_code: 'COB-2024-001',
    administrado: 'Constructora Lima S.A.C.',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '20/01/2024',
    status: 'Completado',
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-01-20T00:00:00Z',
    data: {
      nombre_proyecto: 'Conformidad Edificio Residencial',
      modalidad: 'sin_variaciones'
    },
    steps_status: {
      administrado: 'Completada',
      modalidad: 'Completada',
      documentos_iniciales: 'Completada',
      antecedentes: 'Completada',
      documentos_expediente: 'Completada',
      verificacion: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'COB-2024-002',
    administrado: 'Inversiones Norte S.A.C.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Conformidad Centro Comercial',
      modalidad: 'con_variaciones'
    },
    steps_status: {
      administrado: 'Completada',
      modalidad: 'Completada',
      documentos_iniciales: 'En progreso',
      antecedentes: 'Pendiente',
      documentos_expediente: 'Pendiente',
      verificacion: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'COB-2024-003',
    administrado: 'Desarrollos Sur S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      nombre_proyecto: 'Conformidad Edificio Oficinas',
      modalidad: 'casco_habitable'
    },
    steps_status: {
      administrado: 'Completada',
      modalidad: 'Pendiente',
      documentos_iniciales: 'Pendiente',
      antecedentes: 'Pendiente',
      documentos_expediente: 'Pendiente',
      verificacion: 'Pendiente'
    }
  }
];

export default function Conformidades() {
  const navigate = useNavigate();
  const [conformidades] = useState<Conformidad[]>(conformidadesDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ConformidadStatus>(ConformidadStatus.TODOS);
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Conformidad de Obra',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: ConformidadStatus.TODOS, label: 'Todos' },
    { key: ConformidadStatus.PENDIENTE, label: 'Pendientes' },
    { key: ConformidadStatus.COMPLETADO, label: 'Completados' },
  ];

  const filteredConformidades = useMemo(() => {
    if (!conformidades) return [];

    return conformidades.filter((conformidad) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (conformidad.data?.nombre_proyecto?.toLowerCase().includes(searchLower)) ||
        (conformidad.instance_code?.toLowerCase().includes(searchLower)) ||
        (conformidad.administrado?.toLowerCase().includes(searchLower)) ||
        (conformidad.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(conformidad.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case ConformidadStatus.TODOS:
          matchesStatus = true;
          break;
        case ConformidadStatus.PENDIENTE:
          matchesStatus = progress < 100;
          break;
        case ConformidadStatus.COMPLETADO:
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [conformidades, searchTerm, selectedStatus]);

  const handleConformidadClick = (item: any) => {
    navigate(`/dashboard/conformidades/edit/${item.id}`);
  };

  const handleNewConformidad = () => {
    navigate('/dashboard/conformidades/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las conformidades: {error.message}
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
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as ConformidadStatus)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewConformidad}
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
      ) : filteredConformidades.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== ConformidadStatus.TODOS 
            ? 'No se encontraron conformidades que coincidan con los filtros.' 
            : 'No hay conformidades registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConformidades.map((conformidad) => (
            <ProyectoCard
              key={conformidad.id}
              item={conformidad}
              onClick={handleConformidadClick}
              type="conformidad"
            />
          ))}
        </div>
      )}
    </div>
  );
}
