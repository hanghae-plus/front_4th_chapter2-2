import { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'input'>, 'size'> & {
  size?: 'sm' | 'md' | 'lg';
};

const SizeMap = {
  sm: 'w-1/3',
  md: 'w-2/3',
  lg: 'w-full',
} as const;

export function Input({ className, size = 'lg', ...props }: Props) {
  return (
    <input
      {...props}
      className={`p-2 border rounded ${className} ${SizeMap[size]}`}
    />
  );
}
