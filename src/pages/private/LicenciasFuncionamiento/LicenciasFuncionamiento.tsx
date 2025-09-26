import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { LicenciaFuncionamiento } from '@/types/licenciaFuncionamiento.types';

// Data dummy para desarrollo
const licenciasFuncionamientoDummy: LicenciaFuncionamiento[] = [
  {
    id: '1',
    instance_code: 'LF-2024-001',
    administrado: 'Clínica Dental San Martín S.A.C.',
    responsable: 'Dr. Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '28/01/2024',
    status: 'Completado',
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-01-28T00:00:00Z',
    data: {
      giro_negocio: 'Consultorio Odontológico',
      direccion_local: 'Av. Principal 123, Miraflores'
    },
    steps_status: {
      administrado: 'Completada',
      consulta_inicial: 'Completada',
      documentacion_cliente: 'Completada',
      visitas_verificacion: 'Completada',
      clasificacion_riesgo: 'Completada',
      ingreso_expediente: 'Completada',
      inspeccion_municipal: 'Completada',
      emision_entrega: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'LF-2024-002',
    administrado: 'Restaurant El Buen Sabor E.I.R.L.',
    responsable: 'Ana García',
    fecha_creacion: '18/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-18T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      giro_negocio: 'Restaurante - Comida Criolla',
      direccion_local: 'Jr. Los Olivos 456, San Isidro'
    },
    steps_status: {
      administrado: 'Completada',
      consulta_inicial: 'Completada',
      documentacion_cliente: 'En progreso',
      visitas_verificacion: 'Pendiente',
      clasificacion_riesgo: 'Pendiente',
      ingreso_expediente: 'Pendiente',
      inspeccion_municipal: 'Pendiente',
      emision_entrega: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'LF-2024-003',
    administrado: 'Farmacia Salud Total S.A.C.',
    responsable: 'Miguel Torres',
    fecha_creacion: '22/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    created_at: '2024-01-22T00:00:00Z',
    scheduled_completion_date: null,
    data: {
      giro_negocio: 'Farmacia y Botica',
      direccion_local: 'Av. Arequipa 789, Lima'
    },
    steps_status: {
      administrado: 'Completada',
      consulta_inicial: 'Completada',
      documentacion_cliente: 'Completada',
      visitas_verificacion: 'En progreso',
      clasificacion_riesgo: 'Pendiente',
      ingreso_expediente: 'Pendiente',
      inspeccion_municipal: 'Pendiente',
      emision_entrega: 'Pendiente'
    }
  }
];

export default function LicenciasFuncionamiento() {
  const navigate = useNavigate();
  const [licencias] = useState<LicenciaFuncionamiento[]>(licenciasFuncionamientoDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Licencia de Funcionamiento',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const filterOptions = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Pendiente', label: 'Pendientes' },
    { key: 'Completado', label: 'Completados' },
  ];

  const filteredLicencias = useMemo(() => {
    if (!licencias) return [];

    return licencias.filter((licencia) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Filtro por texto de búsqueda
      const matchesSearch = searchTerm === '' || 
        (licencia.data?.giro_negocio?.toLowerCase().includes(searchLower)) ||
        (licencia.data?.direccion_local?.toLowerCase().includes(searchLower)) ||
        (licencia.instance_code?.toLowerCase().includes(searchLower)) ||
        (licencia.administrado?.toLowerCase().includes(searchLower)) ||
        (licencia.responsable?.toLowerCase().includes(searchLower));

      // Calcular progreso basado en steps_status
      const calculateProgress = (stepsStatus: any) => {
        if (!stepsStatus) return 0;
        const steps = Object.values(stepsStatus);
        const completedSteps = steps.filter(step => step === 'Completada').length;
        return Math.round((completedSteps / steps.length) * 100);
      };

      const progress = calculateProgress(licencia.steps_status);

      // Filtro por estado basado en progreso
      let matchesStatus = false;
      switch (selectedStatus) {
        case 'Todos':
          matchesStatus = true;
          break;
        case 'Pendiente':
          matchesStatus = progress < 100;
          break;
        case 'Completado':
          matchesStatus = progress === 100;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [licencias, searchTerm, selectedStatus]);

  const handleLicenciaClick = (item: any) => {
    navigate(`/dashboard/licencias-funcionamiento/edit/${item.id}`);
  };

  const handleNewLicencia = () => {
    navigate('/dashboard/licencias-funcionamiento/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar las licencias de funcionamiento: {error.message}
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
          searchPlaceholder="Buscar por giro de negocio, dirección, trámite, administrado o responsable..."
          filters={filterOptions}
          onFilterChange={(filterKey) => setSelectedStatus(filterKey as string)}
          className="flex-1"
        />
        
        <Button
          onClick={handleNewLicencia}
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
      ) : filteredLicencias.length === 0 ? (
        <div className="text-center text-gray-500 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          {searchTerm || selectedStatus !== 'Todos' 
            ? 'No se encontraron licencias de funcionamiento que coincidan con los filtros.' 
            : 'No hay licencias de funcionamiento registradas.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLicencias.map((licencia) => (
            <ProyectoCard
              key={licencia.id}
              item={licencia}
              onClick={handleLicenciaClick}
              type="licencia-funcionamiento"
            />
          ))}
        </div>
      )}
    </div>
  );
}
