import React, { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
