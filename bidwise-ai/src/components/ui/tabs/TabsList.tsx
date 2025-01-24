import * as RadixTabs from '@radix-ui/react-tabs';
import React from 'react';
import { cn } from '../../../lib/utils';

export interface TabsListProps extends RadixTabs.TabsListProps {}

const TabsList: React.FC<TabsListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RadixTabs.List
      className={cn('flex space-x-2 border-b', className)}
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
};

export default TabsList;
