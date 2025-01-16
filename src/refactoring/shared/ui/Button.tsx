import { ButtonHTMLAttributes, useState, useEffect, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger';
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const Button = ({ variant, className, onClick, children, ...props }: ButtonProps) => {
  const [tmpClassName, setTmpClassName] = useState<string>('');

  useEffect(() => {
    if (variant === 'primary') {
      setTmpClassName('bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400');
    }
    if (variant === 'danger') {
      setTmpClassName('bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600');
    }
  }, []);

  return (
    <button className={tmpClassName} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
