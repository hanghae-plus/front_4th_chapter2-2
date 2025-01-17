import { ComponentProps } from 'react';

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label {...props} className={`block ${className}`}>
      {props.children}
    </label>
  );
}
