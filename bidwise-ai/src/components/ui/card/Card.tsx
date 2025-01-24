import React, { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white shadow-md rounded-lg border border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
