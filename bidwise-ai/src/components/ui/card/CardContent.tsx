import React, { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 py-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardContent;
