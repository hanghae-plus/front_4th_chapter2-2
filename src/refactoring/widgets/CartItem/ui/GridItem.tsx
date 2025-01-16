import { ReactNode } from 'react';

interface GridItemProps {
  title: string;
  children: ReactNode;
}

export const GridItem = ({ children, title }: GridItemProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
