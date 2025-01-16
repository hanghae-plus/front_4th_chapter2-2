import { ComponentProps } from 'react';

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label {...props} className={`block mb-1 ${className}`}>
      {props.children}
    </label>
  );
}
