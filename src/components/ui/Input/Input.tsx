import React from 'react';
import { Input as HeroInput } from '@heroui/react';
import { InputProps as HeroInputProps } from '@heroui/react';

export interface CustomInputProps extends Omit<HeroInputProps, 'size' | 'color' | 'variant'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
  error?: string;
  textOnly?: boolean;
  numbersOnly?: boolean;
  maxLength?: number;
  label?: string;
}

export const Input: React.FC<CustomInputProps> = ({
  size = 'lg',
  variant = 'bordered',
  error,
  className = '',
  textOnly = false,
  numbersOnly = false,
  maxLength,
  label,
  onChange,
  ...props
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Validar textOnly (solo letras, espacios y caracteres especiales comunes)
    if (textOnly && !numbersOnly) {
      value = value.replace(/[0-9]/g, '');
    }

    // Validar numbersOnly (solo números)
    if (numbersOnly && !textOnly) {
      value = value.replace(/[^0-9]/g, '');
    }

    // Aplicar maxLength si está definido
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    // Modificar directamente el valor del target del evento original
    e.target.value = value;

    // Llamar al onChange original si existe
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <HeroInput
        {...props}
        size={size}
        variant={variant}
        isInvalid={!!error || props.isInvalid}
        errorMessage={error || props.errorMessage}
        onChange={handleInputChange}
        classNames={{
          base: "w-full",
          mainWrapper: "h-full",
          input: [
            "bg-gray-100",
            "text-gray-900",
            "placeholder:text-gray-500",
            "px-4",
            "py-3",
            "data-[filled=true]:text-gray-900",
            "data-[filled=true]:bg-gray-100",
          ],
          innerWrapper: "bg-gray-100",
          inputWrapper: [
            "shadow-sm",
            "bg-gray-100",
            "hover:bg-gray-100",
            "group-data-[focused=true]:bg-gray-100",
            "group-data-[filled=true]:bg-gray-100",
            "!cursor-text",
            "border-0",
            "hover:border-0",
            "group-data-[focused=true]:border-0",
            "group-data-[filled=true]:border-0",
            "rounded-lg",
            "min-h-[48px]",
            "h-12",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-blue-500",
            "focus:ring-inset",
          ],
        }}
        className={className}
      />
    </div>
  );
};

export default Input;
