import { ReactNode } from 'react';
import classNames from '../../utils/classNames.ts';

type PropsType = {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  testId?: string;
};
export const Card = (props: PropsType) => {
  const { children, padding = 'md', className, testId, ...rest } = props;

  const paddingClass = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      {...rest}
      data-testid={testId}
      className={classNames(
        'bg-white rounded shadow',
        paddingClass[padding],
        className,
      )}
    >
      {children}
    </div>
  );
};
