import { useState } from 'react';
import { LuCalendar } from 'react-icons/lu';

export interface DateInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value;
    
    // Formatear automáticamente como dd/mm/yyyy
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
      }
    }
    
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
          value={value}
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
