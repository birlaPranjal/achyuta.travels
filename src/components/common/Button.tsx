
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles = 'rounded-full font-medium transition-all duration-300 flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50',
    outline: 'bg-transparent text-gray-800 border border-gray-300 hover:border-orange-500 hover:text-orange-500',
    gradient: 'bg-orange-gradient text-white hover:shadow-lg transform hover:scale-[1.02]',
    text: 'bg-transparent text-orange-500 hover:text-orange-600 shadow-none p-0',
  };
  
  const sizeStyles = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8',
  };
  
  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        widthStyles,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;
