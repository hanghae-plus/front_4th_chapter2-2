interface ButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'custom';
  children: React.ReactNode;
}

export const Button = ({
  onClick,
  className,
  disabled,
  variant = 'custom',
  children,
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `bg-blue-500 text-white hover:bg-blue-600 ${className}`;
      case 'secondary':
        return `bg-gray-300 text-gray-800 hover:bg-gray-400 ${className}`;
      case 'danger':
        return `bg-red-500 text-white hover:bg-red-600 ${className}`;
      case 'custom':
        return `${className}`;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 rounded ${getVariantClasses()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};
