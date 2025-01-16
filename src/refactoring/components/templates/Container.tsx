import { ReactNode } from 'react';

type PropsType = {
  children: ReactNode;
};
export const Container = (props: PropsType) => {
  const { children } = props;

  return <div className="container mx-auto p-4">{children}</div>;
};
