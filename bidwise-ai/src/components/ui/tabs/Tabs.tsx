import * as RadixTabs from '@radix-ui/react-tabs';
import React from 'react';
import { cn } from '../../../lib/utils';

export interface TabsProps extends RadixTabs.TabsProps {}

const Tabs = RadixTabs.Root;

Tabs.List = RadixTabs.List;

export default Tabs;
