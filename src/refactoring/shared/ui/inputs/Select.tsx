import { ComponentProps } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  options: {
    value: string | number;
    text: string;
  }[];
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select {...props} className={`w-full p-2 border rounded ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
}
