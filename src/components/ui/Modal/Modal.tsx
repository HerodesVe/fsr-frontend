import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  footer, 
  children, 
  size = 'md',
  hideCloseButton = false,
  isDismissable = true,
  className = ''
}) => {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isDismissable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isDismissable]);

  if (!isOpen) return null;

  // Tamaños del modal
  const sizeClasses: Record<string, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    '4xl': 'max-w-[90vw]',
    '5xl': 'max-w-[95vw]',
    full: 'max-w-[100vw] max-h-[100vh] m-0',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isDismissable) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden
            ${sizeClasses[size]}
            ${className}
          `}
        >
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {title && (
                  <div className="flex-1">
                    {typeof title === 'string' ? (
                      <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {title}
                      </h2>
                    ) : (
                      title
                    )}
                  </div>
                )}
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
                    aria-label="Cerrar modal"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)] px-6 py-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
