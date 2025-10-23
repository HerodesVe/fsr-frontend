import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';

import { useClients } from '@/hooks/useClients';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter, Table, Pagination } from '@/components/ui';
import type { FilterOption, TableColumn, TableAction } from '@/components/ui';

export default function Administrados() {
  const navigate = useNavigate();
  const { clients, isLoading, error } = useClients();
  // refetch se mantiene para futuras funcionalidades de actualización
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { setHeader } = useHeaderStore();

  // Configurar el header cuando el componente se monta
  useEffect(() => {
    setHeader(
      'Gestión de Administrados',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );

    // Limpiar el header cuando el componente se desmonta
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  // Configuración de filtros
  const filterOptions: FilterOption[] = [
    { key: 'todos', label: 'Nombres', isActive: activeFilter === 'todos' },
    { key: 'ruc', label: 'RUC', isActive: activeFilter === 'ruc' },
    { key: 'email', label: 'Email', isActive: activeFilter === 'email' },
    { key: 'status', label: 'Status', isActive: activeFilter === 'status' },
  ];

  // Lógica de filtrado
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    
    return clients.filter((client) => {
      const searchLower = searchTerm.toLowerCase();
      
      let matchesSearch = searchTerm === '';
      
      if (!matchesSearch) {
        if (client.clientType === 'natural') {
          // Para persona natural: buscar en nombres y apellidos
          const fullName = [client.names, client.paternalSurname, client.maternalSurname]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          matchesSearch = fullName.includes(searchLower) ||
                        (client.docNumber ? client.docNumber.toLowerCase().includes(searchLower) : false);
        } else {
          // Para persona jurídica: buscar en razón social y RUC
          matchesSearch = (client.businessName ? client.businessName.toLowerCase().includes(searchLower) : false) ||
                        (client.ruc ? client.ruc.toLowerCase().includes(searchLower) : false);
        }
      }
      
      return matchesSearch;
    });
  }, [clients, searchTerm]);

  // Paginación
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredClients.slice(startIndex, startIndex + pageSize);
  }, [filteredClients, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredClients.length / pageSize);

  // Configuración de columnas de la tabla
  const columns: TableColumn[] = [
    {
      key: 'displayName',
      title: 'Nombre / Razón Social',
      render: (_, record) => {
        if (record.clientType === 'natural') {
          // Para persona natural: concatenar nombres y apellidos
          const fullName = [record.names, record.paternalSurname, record.maternalSurname]
            .filter(Boolean) // Filtrar valores vacíos o undefined
            .join(' ');
          return fullName || 'Sin nombre';
        } else {
          // Para persona jurídica: mostrar razón social
          return record.businessName || 'Sin razón social';
        }
      },
      width: '30%',
    },
    {
      key: 'document',
      title: 'Documento',
      render: (_, record) => {
        if (record.clientType === 'natural') {
          // Para persona natural: mostrar tipo y número de documento
          return record.docNumber ? `${record.docType || 'DNI'}: ${record.docNumber}` : 'Sin documento';
        } else {
          // Para persona jurídica: mostrar RUC
          return record.ruc ? `RUC: ${record.ruc}` : 'Sin RUC';
        }
      },
      width: '20%',
    },
    {
      key: 'date',
      title: 'Fecha',
      render: () => '10/06/2025', // Placeholder ya que no hay fecha en los datos
      width: '15%',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: status === 'ACTIVE' ? '#dcfce7' : '#f3f4f6',
            color: status === 'ACTIVE' ? '#166534' : '#6b7280',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'clientType',
      title: 'Tipo',
      dataIndex: 'clientType',
      render: (type) => (
        <span style={{ fontFamily: 'Inter, sans-serif' }}>
          {type === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
        </span>
      ),
      width: '20%',
    },
  ];

  // Configuración de acciones
  const actions: TableAction[] = [
    {
      key: 'edit',
      label: 'Editar',
      onClick: (record) => {
        navigate(`/dashboard/administrados/edit/${record.id}`);
      },
      variant: 'secondary',
    },
  ];

  // Handlers
  const handleFilterChange = (filterKey: string) => {
    if (filterKey === '') {
      setActiveFilter('todos');
    } else {
      setActiveFilter(filterKey);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleCreateClient = () => {
    navigate('/dashboard/administrados/create');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar los administrados: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con filtros y botón crear en una sola línea */}
      <div className="flex items-center justify-between gap-4">
        <Filter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar administrado..."
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          className="flex-1"
        />
        
        <Button
          onClick={handleCreateClient}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="text-white hover:opacity-90 whitespace-nowrap flex items-center justify-center px-4 py-3 rounded-xl"
        >
          <LuPlus className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Crear administrado
          </span>
        </Button>
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        data={paginatedClients}
        loading={isLoading}
        actions={actions}
        emptyMessage="No se encontraron administrados"
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            total={filteredClients.length}
            pageSize={pageSize}
            showSizeChanger
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
