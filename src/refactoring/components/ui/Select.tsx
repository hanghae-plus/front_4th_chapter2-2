import { ChangeEvent, ReactNode } from 'react';

type PropsType = {
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  children: ReactNode;
};
export const Select = (props: PropsType) => {
  const { onChange, className, children, value = '' } = props;

  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${className}`}
    >
      {children}
    </select>
  );
};
