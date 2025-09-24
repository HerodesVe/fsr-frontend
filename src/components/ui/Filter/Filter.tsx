import React from 'react';
import { LuSearch } from 'react-icons/lu';
import { Input } from '../Input';

export interface FilterOption {
  key: string;
  label: string;
  isActive?: boolean;
}

interface FilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterOption[];
  onFilterChange: (filterKey: string) => void;
  className?: string;
}

export const Filter: React.FC<FilterProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar email...",
  filters,
  onFilterChange,
  className = ""
}) => {
  const handleFilterClick = (filterKey: string) => {
    // Si el filtro ya está activo, lo deseleccionamos
    const currentFilter = filters.find(f => f.key === filterKey);
    if (currentFilter?.isActive) {
      onFilterChange(''); // Enviamos string vacío para deseleccionar
    } else {
      // Si no está activo, lo seleccionamos (esto deseleccionará automáticamente los demás)
      onFilterChange(filterKey);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Buscador */}
      <div className="relative w-80">
        <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          className="w-full pl-10 pr-10"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        )}
      </div>

      {/* Filtros tipo burbuja */}
      <div className="flex items-center gap-2">
        {filters?.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilterClick(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              filter.isActive
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: filter.isActive ? 'var(--primary-color)' : undefined,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
