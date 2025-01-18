import { ComponentProps } from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends ComponentProps<'select'> {
  options: Option[];
}

export function Select({ options, ...props }: SelectProps) {
  return (
    <select {...props} className="w-full p-2 border rounded mb-2">
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
