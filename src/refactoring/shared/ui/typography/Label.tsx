import { ReactNode } from 'react';

export function Label({ children }: { children: ReactNode }) {
  return <label className="block mb-1">{children}</label>;
}
