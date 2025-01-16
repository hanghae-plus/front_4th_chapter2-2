interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  wdSize?: string;
  disabled?: boolean;
  variant?: string; // 문자열로 자유롭게 입력 가능
}

const Button = ({
  onClick,
  children,
  className = "",
  wdSize,
  disabled,
  variant = "fullBlueBtn",
}: ButtonProps) => {
  const buttonStyle =
    {
      fullBlueBtn:
        "w-full bg-blue-500 text-white hover:bg-blue-600  px-3 py-1 rounded",

      fullGrayBtn:
        "w-full bg-gray-300 text-gray-500 cursor-not-allowed px-3 py-1 rounded",
      smallGrayBtn:
        "bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400",

      smallRedBtn: "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600",

      smallGreenBtn:
        "bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600",
      fullGreenBtn:
        "w-full bg-green-500 text-white p-2 rounded hover:bg-green-600",
    }[disabled ? "disabled" : variant] || "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
