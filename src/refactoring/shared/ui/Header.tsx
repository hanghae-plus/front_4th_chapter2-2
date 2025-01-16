import React, { ReactNode } from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className: string;
}

// @ts-ignore: TS6133 - 'props' is declared but its value is never read.
export function Header({ children, className, ...props }: HeaderProps) {
  return (
    <h1 className={className} {...props}>
      {children}
    </h1>
  );
}
