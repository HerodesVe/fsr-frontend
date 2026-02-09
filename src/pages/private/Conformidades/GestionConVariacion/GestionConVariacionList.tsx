import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus, LuSearch, LuFilter } from 'react-icons/lu';
import { Button, Input } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';

export default function GestionConVariacionList() {
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Datos de ejemplo (en producción vendrían de un hook)
  const conformidades: any[] = [];

  useEffect(() => {
    setHeader(
      'Gestión Conformidad Con Variación',
      'Gestiona los trámites de conformidad de obra con variaciones'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  const handleCreateNew = () => {
    navigate('/dashboard/gestion-conformidad-con-variacion/create');
  };

  const filteredConformidades = useMemo(() => {
    if (!searchTerm) return conformidades;
    
    return conformidades.filter((item: any) => 
      item.nombre_proyecto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.administrado?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conformidades, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Conformidad de Obra Con Variación
          </h1>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Gestiona los trámites de conformidad de obra con variaciones
          </p>
        </div>
        
        <Button
          onClick={handleCreateNew}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="text-white hover:opacity-90"
          startContent={<LuPlus className="w-4 h-4" />}
        >
          Nueva Conformidad
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por proyecto o administrado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<LuSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <Button
            variant="bordered"
            startContent={<LuFilter className="w-4 h-4" />}
          >
            Filtros
          </Button>
        </div>
      </div>

      {/* Lista de conformidades */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredConformidades.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            No hay conformidades registradas
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Comienza creando una nueva conformidad de obra con variación
          </p>
          <Button
            onClick={handleCreateNew}
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="text-white hover:opacity-90"
            startContent={<LuPlus className="w-4 h-4" />}
          >
            Nueva Conformidad
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConformidades.map((item: any) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/dashboard/gestion-conformidad-con-variacion/${item.id}`)}
            >
              <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {item.nombre_proyecto}
              </h3>
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {item.administrado}
              </p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Completado' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </span>
                <span className="text-xs text-gray-500">
                  {item.progress_percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
