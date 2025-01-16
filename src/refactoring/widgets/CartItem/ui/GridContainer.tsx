import { ReactNode } from 'react';
import { Header } from '@/shared/ui';

interface ContainerProps {
  title: string;
  children: ReactNode;
}

export const GridContainer = ({ title, children }: ContainerProps) => (
  <div className="container mx-auto p-4">
    <Header className="text-3xl font-bold mb-6">{title}</Header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);
