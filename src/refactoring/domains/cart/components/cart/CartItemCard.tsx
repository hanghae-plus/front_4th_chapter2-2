import type { PropsWithChildren } from 'react';

export const CartItemCard = ({ children }: PropsWithChildren) => {
  return <div className="flex justify-between items-center bg-white p-3 rounded shadow">{children}</div>;
};
