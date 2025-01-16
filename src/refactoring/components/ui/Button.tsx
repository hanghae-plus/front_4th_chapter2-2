import { ReactNode } from 'react';
import classNames from '../../utils/classNames.ts';

type PropsType = {
  children: ReactNode;
  variant?: 'none' | 'primary' | 'secondary' | 'danger' | 'green';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Button = (props: PropsType) => {
  const {
    children,
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    className = '',
    onClick,
    ...rest
  } = props;

  const primaryColor = 'bg-blue-500 text-white hover:bg-blue-600';
  const secondaryColor = 'bg-gray-300 text-gray-800 hover:bg-gray-400';
  const dangerColor = 'bg-red-500 text-white hover:bg-red-600';
  const greenColor = 'bg-green-500 text-white hover:bg-green-600';

  const getButtonColor = () => {
    if (variant === 'none') return '';
    if (variant === 'primary') return primaryColor;
    if (variant === 'secondary') return secondaryColor;
    if (variant === 'danger') return dangerColor;
    if (variant === 'green') return greenColor;
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const cursorClass = disabled ? 'cursor-not-allowed' : '';

  return (
    <button
      {...rest}
      className={classNames(
        'rounded px-2 py-1',
        getButtonColor(),
        widthClass,
        cursorClass,
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
