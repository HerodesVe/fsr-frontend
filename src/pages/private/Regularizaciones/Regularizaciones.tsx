import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter } from '@/components/ui';
import { ProyectoCard } from '@/components/utils/ProyectoCard';
import { Regularizacion, RegularizacionStatus } from '@/types/regularizacion.types';

// Data dummy para desarrollo
const regularizacionesDummy: Regularizacion[] = [
  {
    id: '1',
    instance_code: 'REG-2024-001',
    service_id: 'serv-reg-001',
    client_id: 'client-001',
    user_id: 'user-001',
    administrado: 'María González Pérez',
    responsable: 'Carlos Mendoza',
    fecha_creacion: '15/01/2024',
    fecha_culminacion: '20/02/2024',
    status: 'Completado',
    progress_percentage: 100,
    created_at: '2024-01-15T00:00:00Z',
    scheduled_completion_date: '2024-02-20T00:00:00Z',
    next_step: 'completado',
    uploaded_documents: [],
    data: {
      service_type: 'regularizacion',
      titulo_proceso: 'Regularización Vivienda Unifamiliar',
      tipo_regularizacion: 'Licencia de Edificación',
      descripcion: 'Regularización de vivienda unifamiliar construida sin licencia',
      datos_administrado: {
        nombre: 'María González Pérez',
        dni: '12345678',
        domicilio: 'Av. Los Pinos 123, San Isidro',
        telefono: '987654321'
      },
      documentacion_inicial: {
        fecha_culminacion: '2023-12-01',
        licencia_anterior: [],
        declaratoria_fabrica: [],
        planos_antecedentes: [],
        otros_documentos: []
      },
      datos_predio: {
        ubicacion: 'Av. Los Pinos 123, San Isidro, Lima',
        partida_registral: 'P01234567',
        modalidad_licencia: 'Modalidad A',
        presupuesto_obra: '75000.00'
      },
      fue_firmado: [],
      gestion_municipal: {
        cargo_municipal: [],
        acta_observacion: [],
        documentos_subsanacion: [],
        resolucion_final: []
      }
    },
    steps_status: {
      administrado: 'Completada',
      documentacion_inicial: 'Completada',
      datos_predio: 'Completada',
      fue_firmado: 'Completada',
      gestion_municipal: 'Completada'
    }
  },
  {
    id: '2',
    instance_code: 'REG-2024-002',
    service_id: 'serv-reg-002',
    client_id: 'client-002',
    user_id: 'user-001',
    administrado: 'Constructora Lima S.A.C.',
    responsable: 'Ana Torres',
    fecha_creacion: '20/01/2024',
    fecha_culminacion: '',
    status: 'En progreso',
    progress_percentage: 60,
    created_at: '2024-01-20T00:00:00Z',
    scheduled_completion_date: '2024-03-15T00:00:00Z',
    next_step: 'fue_firmado',
    uploaded_documents: [],
    data: {
      service_type: 'regularizacion',
      titulo_proceso: 'Regularización Edificio Comercial',
      tipo_regularizacion: 'Licencia de Edificación',
      descripcion: 'Regularización de edificio comercial de 3 pisos',
      datos_administrado: {
        nombre: 'Constructora Lima S.A.C.',
        dni: '20123456789',
        domicilio: 'Jr. Comercio 456, Cercado de Lima',
        telefono: '987654322'
      },
      documentacion_inicial: {
        fecha_culminacion: '2023-11-15',
        licencia_anterior: [],
        declaratoria_fabrica: [],
        planos_antecedentes: [],
        otros_documentos: []
      },
      datos_predio: {
        ubicacion: 'Jr. Comercio 456, Cercado de Lima',
        partida_registral: 'P01234568',
        modalidad_licencia: 'Modalidad B',
        presupuesto_obra: '150000.00'
      },
      fue_firmado: [],
      gestion_municipal: {
        cargo_municipal: [],
        acta_observacion: [],
        documentos_subsanacion: [],
        resolucion_final: []
      }
    },
    steps_status: {
      administrado: 'Completada',
      documentacion_inicial: 'Completada',
      datos_predio: 'Completada',
      fue_firmado: 'Pendiente',
      gestion_municipal: 'Pendiente'
    }
  },
  {
    id: '3',
    instance_code: 'REG-2024-003',
    service_id: 'serv-reg-003',
    client_id: 'client-003',
    user_id: 'user-002',
    administrado: 'José Ramírez Castro',
    responsable: 'Luis Vargas',
    fecha_creacion: '25/01/2024',
    fecha_culminacion: '',
    status: 'Pendiente',
    progress_percentage: 20,
    created_at: '2024-01-25T00:00:00Z',
    scheduled_completion_date: '2024-04-01T00:00:00Z',
    next_step: 'documentacion_inicial',
    uploaded_documents: [],
    data: {
      service_type: 'regularizacion',
      titulo_proceso: 'Regularización Ampliación Vivienda',
      tipo_regularizacion: 'Licencia de Edificación',
      descripcion: 'Regularización de ampliación de vivienda existente',
      datos_administrado: {
        nombre: 'José Ramírez Castro',
        dni: '87654321',
        domicilio: 'Calle Las Flores 789, Miraflores',
        telefono: '987654323'
      },
      documentacion_inicial: {
        fecha_culminacion: '',
        licencia_anterior: [],
        declaratoria_fabrica: [],
        planos_antecedentes: [],
        otros_documentos: []
      },
      datos_predio: {
        ubicacion: '',
        partida_registral: '',
        modalidad_licencia: '',
        presupuesto_obra: ''
      },
      fue_firmado: [],
      gestion_municipal: {
        cargo_municipal: [],
        acta_observacion: [],
        documentos_subsanacion: [],
        resolucion_final: []
      }
    },
    steps_status: {
      administrado: 'Completada',
      documentacion_inicial: 'Pendiente',
      datos_predio: 'Pendiente',
      fue_firmado: 'Pendiente',
      gestion_municipal: 'Pendiente'
    }
  }
];

export default function Regularizaciones() {
  const navigate = useNavigate();
  const [regularizaciones] = useState<Regularizacion[]>(regularizacionesDummy);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
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
