import React, { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 py-2 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardHeader;
