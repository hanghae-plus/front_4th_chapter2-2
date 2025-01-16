import { ReactNode } from 'react';
import classNames from '../../utils/classNames.ts';

type PropsType = {
  children: ReactNode;
  level: 1 | 2 | 3 | 4;
  className?: string;
};
export const Title = (props: PropsType) => {
  const { children, level, className } = props;
  if (level === 1) {
    return (
      <h1 className={classNames('text-3xl font-bold mb-6', className)}>
        {children}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 className={classNames('text-2xl font-semibold mb-4', className)}>
        {children}
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3 className={classNames('text-xl font-semibold mb-2', className)}>
        {children}
      </h3>
    );
  }
  return (
    <h3 className={classNames('text-lg font-semibold mb-2', className)}>
      {children}
    </h3>
  );
};
