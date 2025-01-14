import React from "react";

interface ButtonProps {
  data?: Record<string, string>;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  data,
  onClick,
  className = "w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600",
  children,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      data-testid={data?.testId}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
