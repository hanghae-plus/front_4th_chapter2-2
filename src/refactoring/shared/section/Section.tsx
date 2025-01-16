import type { PropsWithChildren } from 'react';

interface SectionProps {
  title: string;
}

export const Section = ({ title, children }: PropsWithChildren<SectionProps>) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
