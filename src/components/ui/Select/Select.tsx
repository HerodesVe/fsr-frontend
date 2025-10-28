import React from 'react';
import { createPortal } from 'react-dom';
import { Select as HeroSelect, SelectItem } from '@heroui/react';
import { SelectProps as HeroSelectProps } from '@heroui/react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps extends Omit<HeroSelectProps, 'size' | 'color' | 'variant' | 'children'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  search?: boolean;
}

export const Select: React.FC<CustomSelectProps> = ({
  size = 'lg',
  variant = 'bordered',
  error,
  options,
  placeholder = "Seleccionar...",
  label,
  search = false,
  className = '',
  ...props
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchContainer, setSearchContainer] = React.useState<HTMLDivElement | null>(null);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!search || !searchValue) return options;
    
    const lowerSearch = searchValue.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(lowerSearch)
    );
  }, [options, searchValue, search]);

  // Insertar el input de búsqueda al principio del popover
  React.useEffect(() => {
    if (search && isOpen) {
      const timer = setTimeout(() => {
        const listbox = document.querySelector('[role="listbox"]');
        if (listbox && listbox.parentElement) {
          const parent = listbox.parentElement;
          
          // Crear el contenedor del input si no existe
          let container = parent.querySelector('#search-input-container') as HTMLDivElement;
          if (!container) {
            container = document.createElement('div');
            container.id = 'search-input-container';
            container.style.cssText = 'position: sticky; top: 0; z-index: 50; background: white; border-bottom: 1px solid #e5e7eb; padding: 12px;';
            
            // Insertar al principio
            parent.insertBefore(container, parent.firstChild);
          }
          
          setSearchContainer(container);
        }
      }, 10);
      return () => {
        clearTimeout(timer);
        // Limpiar el contenedor cuando se cierre
        const container = document.querySelector('#search-input-container');
        if (container) {
          container.remove();
        }
      };
    } else {
      setSearchContainer(null);
    }
  }, [search, isOpen]);

  return (
    <div className="w-full relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <HeroSelect
        {...props}
        size={size}
        variant={variant}
        isInvalid={!!error || props.isInvalid}
        errorMessage={error || props.errorMessage}
        placeholder={placeholder}
        showScrollIndicators={true}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearchValue('');
        }}
        classNames={{
          base: "w-full",
          trigger: [
            "bg-gray-100",
            "hover:bg-gray-100",
            "group-data-[focused=true]:bg-gray-100",
            "group-data-[open=true]:bg-gray-100",
            error ? "border-2" : "border-0",
            error ? "border-red-500" : "",
            error ? "hover:border-red-500" : "hover:border-0",
            error ? "group-data-[focused=true]:border-red-500" : "group-data-[focused=true]:border-0",
            error ? "group-data-[open=true]:border-red-500" : "group-data-[open=true]:border-0",
            "rounded-lg",
            "min-h-[48px]",
            "h-12",
            "shadow-sm",
          ],
          value: [
            "text-gray-900",
            "placeholder:text-gray-500",
            "px-4",
            "py-3",
          ],
          mainWrapper: "bg-gray-100",
          innerWrapper: "bg-gray-100",
          selectorIcon: error ? "text-red-500" : "text-gray-500",
          listbox: [
            "bg-white",
            "border",
            "border-gray-200",
            "rounded-lg",
            "shadow-lg",
            "mt-1",
            "py-2",
          ],
          popoverContent: [
            "bg-white",
            "rounded-lg",
            "shadow-lg",
          ],
          listboxWrapper: [
            "max-h-[300px]",
            "overflow-y-auto",
          ],
          errorMessage: [
            "text-red-600",
            "text-sm",
            "mt-1",
            "font-medium",
          ],
        }}
        className={className}
      >
        {filteredOptions.length === 0 ? (
          <SelectItem key="no-results" isDisabled className="text-gray-500 px-4 py-3">
            No se encontraron resultados
          </SelectItem>
        ) : (
          filteredOptions.map((option) => (
            <SelectItem
              key={option.value}
              isDisabled={option.disabled}
              className="text-gray-900 hover:bg-gray-50 data-[selected=true]:bg-primary-50 data-[selected=true]:text-primary-600 px-4 py-3 min-h-[44px] text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {option.label}
            </SelectItem>
          ))
        )}
      </HeroSelect>
      
      {/* Input de búsqueda usando portal */}
      {search && isOpen && searchContainer && createPortal(
        <input
          type="text"
          placeholder="Buscar..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
          style={{ fontFamily: 'Inter, sans-serif' }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />,
        searchContainer
      )}
    </div>
  );
};

export default Select;
