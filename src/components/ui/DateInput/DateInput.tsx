import { useState, useMemo } from 'react';
import { LuCalendar } from 'react-icons/lu';

// Funciones de utilidad para conversión de fechas
// El backend espera formato ISO (YYYY-MM-DD), pero el usuario ve formato latino (DD/MM/YYYY)

/**
 * Convierte fecha de formato latino (DD/MM/YYYY) a ISO (YYYY-MM-DD)
 */
const latinToISO = (latinDate: string): string => {
  if (!latinDate || latinDate.length !== 10) return latinDate;
  const parts = latinDate.split('/');
  if (parts.length !== 3) return latinDate;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

/**
 * Convierte fecha de formato ISO (YYYY-MM-DD) a latino (DD/MM/YYYY)
 */
const isoToLatin = (isoDate: string): string => {
  if (!isoDate) return '';
  // Si ya está en formato latino, devolverlo
  if (isoDate.includes('/')) return isoDate;
  // Validar formato ISO
  if (isoDate.length !== 10 || !isoDate.includes('-')) return isoDate;
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

/**
 * Detecta si una fecha está en formato ISO
 */
const isISOFormat = (date: string): boolean => {
  return date?.length === 10 && date.includes('-') && !date.includes('/');
};

export interface DateInputProps {
  label?: string;
  placeholder?: string;
  value: string; // Acepta tanto ISO (YYYY-MM-DD) como latino (DD/MM/YYYY)
  onChange: (value: string) => void; // Siempre devuelve formato ISO (YYYY-MM-DD)
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function DateInput({
  label,
  placeholder = "dd/mm/aaaa",
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
}: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Convertir el value de ISO a latino para mostrar
  const displayValue = useMemo(() => {
    if (!value) return '';
    return isISOFormat(value) ? isoToLatin(value) : value;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value;
    
    // Formatear automáticamente como dd/mm/yyyy para la visualización
    if (inputValue.length <= 10) {
      // Remover caracteres no numéricos excepto /
      inputValue = inputValue.replace(/[^\d/]/g, '');
      
      // Agregar / automáticamente
      if (inputValue.length >= 2 && inputValue[2] !== '/' && inputValue.length > 2) {
        inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
      }
      if (inputValue.length >= 5 && inputValue[5] !== '/' && inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5);
      }
      
      // Validar valores mientras se escribe (solo cuando la fecha está completa)
      if (inputValue.length === 10) {
        const [day, month, year] = inputValue.split('/');
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        
        // Validaciones básicas
        if (monthNum > 12 || monthNum < 1) {
          // No permitir meses inválidos
          return;
        }
        if (dayNum > 31 || dayNum < 1) {
          // No permitir días inválidos
          return;
        }
        if (yearNum < 1900 || yearNum > 2100) {
          // No permitir años fuera de rango razonable
          return;
        }
        
        // Si la fecha está completa y es válida, convertir a ISO antes de enviar
        onChange(latinToISO(inputValue));
        return;
      }
    }
    
    // Para fechas incompletas, mantener el formato latino temporalmente
    // pero al estar incompleto, pasamos el valor tal cual
    onChange(inputValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={10}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg text-sm
            transition-colors duration-200
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed opacity-60' 
              : error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : isFocused 
                  ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-500' 
                  : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            ${error && !disabled ? 'bg-red-50' : disabled ? 'bg-gray-100' : 'bg-white'}
          `}
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <LuCalendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
}
