import React from 'react';
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
}

export const Select: React.FC<CustomSelectProps> = ({
  size = 'lg',
  variant = 'bordered',
  error,
  options,
  placeholder = "Seleccionar...",
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
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
        classNames={{
          base: "w-full",
          trigger: [
            "bg-gray-100",
            "hover:bg-gray-100",
            "group-data-[focused=true]:bg-gray-100",
            "group-data-[open=true]:bg-gray-100",
            "border-0",
            "hover:border-0",
            "group-data-[focused=true]:border-0",
            "group-data-[open=true]:border-0",
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
          selectorIcon: "text-gray-500",
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
            "bg-transparent",
            "p-0",
          ],
          listboxWrapper: "bg-white max-h-[200px] overflow-y-auto",
        }}
        className={className}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            isDisabled={option.disabled}
            className="text-gray-900 hover:bg-gray-50 data-[selected=true]:bg-primary-50 data-[selected=true]:text-primary-600 px-4 py-3 min-h-[44px] text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {option.label}
          </SelectItem>
        ))}
      </HeroSelect>
    </div>
  );
};

export default Select;
