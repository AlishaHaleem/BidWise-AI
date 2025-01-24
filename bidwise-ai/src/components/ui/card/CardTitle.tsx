import React, { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-800', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export default CardTitle;
