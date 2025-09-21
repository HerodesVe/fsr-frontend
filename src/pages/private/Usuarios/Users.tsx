import { useState, useEffect, useMemo } from 'react';
import { LuPlus } from 'react-icons/lu';

import { useUsers } from '@/hooks/useUsers';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Filter, Table, Pagination } from '@/components/ui';
import { ModalUser } from './components/ModalUser';
import type { FilterOption, TableColumn, TableAction } from '@/components/ui';
import type { UserOut } from '@/types/user.types';

export default function Users() {
  const { users, isLoading, error, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserOut | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { setHeader } = useHeaderStore();


  // Configurar el header cuando el componente se monta
  useEffect(() => {
    setHeader(
      'Gestión de Usuarios',
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
    { key: 'rol', label: 'Rol', isActive: activeFilter === 'rol' },
    { key: 'email', label: 'Email', isActive: activeFilter === 'email' },
    { key: 'status', label: 'Status', isActive: activeFilter === 'status' },
  ];

  // Lógica de filtrado
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((user) => {
      const matchesSearch = searchTerm === '' || 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [users, searchTerm]);

  // Paginación
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Configuración de columnas de la tabla
  const columns: TableColumn[] = [
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      width: '25%',
    },
    {
      key: 'name',
      title: 'Nombre',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
      width: '25%',
    },
    {
      key: 'date',
      title: 'Fecha',
      render: () => '10/06/2025', // Placeholder ya que no tienes fecha en los datos
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
      key: 'role',
      title: 'Rol',
      dataIndex: 'role',
      render: (role) => (
        <span style={{ fontFamily: 'Inter, sans-serif' }}>
          {role === 'ADMIN' ? 'Admin' : role}
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
        setSelectedUser(record);
        setModalMode('edit');
        setIsModalOpen(true);
      },
      variant: 'secondary',
    },
  ];

  // Handlers
  const handleFilterChange = (filterKey: string) => {
    if (filterKey === '') {
      // Si se envía string vacío, deseleccionamos todo (volvemos al estado inicial)
      setActiveFilter('todos');
    } else {
      // Seleccionamos el nuevo filtro (esto deseleccionará automáticamente el anterior)
      setActiveFilter(filterKey);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Recargar la lista de usuarios
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Error al cargar los usuarios: {error.message}
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
          searchPlaceholder="Buscar email..."
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          className="flex-1"
        />
        
        <Button
          onClick={handleCreateUser}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="text-white hover:opacity-90 whitespace-nowrap flex items-center justify-center px-4 py-3 rounded-xl"
        >
          <LuPlus className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Crear usuario
          </span>
        </Button>
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        data={paginatedUsers}
        loading={isLoading}
        actions={actions}
        emptyMessage="No se encontraron usuarios"
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            total={filteredUsers.length}
            pageSize={pageSize}
            showSizeChanger
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      {/* Modal para crear/editar usuario */}
      <ModalUser
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
}