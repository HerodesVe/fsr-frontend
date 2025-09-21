import React from 'react';

interface CustomSwitchProps {
  isSelected?: boolean;
  onValueChange?: (value: boolean) => void;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  className?: string;
}

export const Switch: React.FC<CustomSwitchProps> = ({
  isSelected = false,
  onValueChange,
  isDisabled = false,
  size = 'md',
  label,
  error,
  className = '',
}) => {
  const handleClick = () => {
    if (!isDisabled && onValueChange) {
      onValueChange(!isSelected);
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-12 h-6',
    lg: 'w-14 h-7',
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const translateClasses = {
    sm: 'translate-x-5',
    md: 'translate-x-6',
    lg: 'translate-x-7',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${sizeClasses[size]}
          ${isSelected ? '' : 'bg-gray-300'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          backgroundColor: isSelected ? 'var(--primary-color)' : undefined,
          '--tw-ring-color': 'var(--primary-color)',
        } as React.CSSProperties}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-md transition-transform duration-200
            ${thumbSizeClasses[size]}
            ${isSelected ? translateClasses[size] : 'translate-x-0.5'}
          `}
        />
      </button>
      
      {label && (
        <span 
          className="text-gray-700 text-sm font-medium"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {label}
        </span>
      )}
      
      {error && (
        <p className="text-red-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Switch;
