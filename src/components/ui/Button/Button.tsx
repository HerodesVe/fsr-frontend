import React from 'react';
import { Button as HeroButton } from '@heroui/react';
import { ButtonProps as HeroButtonProps } from '@heroui/react';

export interface CustomButtonProps extends Omit<HeroButtonProps, 'size' | 'color' | 'variant'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const Button: React.FC<CustomButtonProps> = ({
  size = 'lg',
  variant = 'solid',
  color = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  return (
    <HeroButton
      {...props}
      size={size}
      variant={variant}
      color={color}
      className={`${className} font-medium`}
      onClick={onClick}
      classNames={{
        base: [
          "rounded-lg",
          "transition-all",
          "duration-200",
          "shadow-sm",
        ],
      }}
    />
  );
};

export default Button;
