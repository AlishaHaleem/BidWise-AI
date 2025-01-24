import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
      ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-md',
      lg: 'px-5 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
