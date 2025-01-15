import { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'add' | 'danger' | 'complete';
  title: string;
  fullWidth?: boolean;
  isDisabled?: boolean;
  className?: string;
  testId?: string | null;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const buttonStyles = {
  primary: 'bg-white text-blue-600 hover:bg-blue-100',
  add: 'bg-blue-500 text-white hover:bg-blue-600',
  complete: 'bg-green-500 text-white hover:bg-green-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
} as const;

export function TextButton({
  variant = 'primary',
  className = '',
  fullWidth = false,
  isDisabled = false,
  title,
  onClick,
  testId = null,
}: ButtonProps) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded',
        buttonStyles[variant],
        fullWidth && 'w-full',
        isDisabled && 'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {title}
    </button>
  );
}
