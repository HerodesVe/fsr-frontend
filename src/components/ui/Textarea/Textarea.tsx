import React from 'react';
import { Textarea as HeroTextarea } from '@heroui/react';
import { TextAreaProps as HeroTextareaProps } from '@heroui/react';

export interface CustomTextareaProps extends Omit<HeroTextareaProps, 'size' | 'color' | 'variant'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
  error?: string;
  textOnly?: boolean;
  maxLength?: number;
  label?: string;
  rows?: number;
}

export const Textarea: React.FC<CustomTextareaProps> = ({
  size = 'lg',
  variant = 'bordered',
  error,
  className = '',
  textOnly = false,
  maxLength,
  label,
  rows = 4,
  onChange,
  ...props
}) => {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Validar textOnly (solo letras, espacios y caracteres especiales comunes)
    if (textOnly) {
      value = value.replace(/[0-9]/g, '');
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
      <HeroTextarea
        {...props}
        size={size}
        variant={variant}
        minRows={rows}
        maxRows={rows + 2}
        isInvalid={!!error || props.isInvalid}
        errorMessage={error || props.errorMessage}
        onChange={handleTextareaChange}
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
            "resize-none",
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
            "min-h-[120px]",
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

export default Textarea;
