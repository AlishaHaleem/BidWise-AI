import * as RadixTabs from '@radix-ui/react-tabs';
import React from 'react';
import { cn } from '../../../lib/utils';

export interface TabsContentProps extends RadixTabs.TabsContentProps {}

const TabsContent: React.FC<TabsContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RadixTabs.Content
      className={cn('mt-4', className)}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  );
};

export default TabsContent;
