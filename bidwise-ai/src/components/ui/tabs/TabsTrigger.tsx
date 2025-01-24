import * as RadixTabs from '@radix-ui/react-tabs';
import React from 'react';
import { cn } from '../../../lib/utils';

export interface TabsTriggerProps extends RadixTabs.TabsTriggerProps {}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RadixTabs.Trigger
      className={cn(
        'px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none',
        'data-[state=active]:text-blue-600 border-b-2',
        'data-[state=active]:border-blue-600',
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  );
};

export default TabsTrigger;
