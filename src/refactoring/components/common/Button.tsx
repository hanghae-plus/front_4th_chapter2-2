interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger";
  children: React.ReactNode;
}

const baseStyle = {
  px: "px-4",
  py: "py-2",
  rounded: "rounded",
  transition: "transition-colors",
};

const variantStyles = {
  primary: {
    bg: "bg-blue-500",
    text: "text-white",
    hover: "hover:bg-blue-600",
  },
  secondary: {
    bg: "bg-gray-500",
    text: "text-white",
    hover: "hover:bg-gray-600",
  },
  success: {
    bg: "bg-green-500",
    text: "text-white",
    hover: "hover:bg-green-600",
  },
  danger: {
    bg: "bg-red-500",
    text: "text-white",
    hover: "hover:bg-red-600",
  },
};

const Button = ({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) => {
  const variantStyle = variantStyles[variant];
  const combinedStyles = { ...baseStyle, ...variantStyle };

  if (className) {
    const customStyles = className.split(" ").reduce((acc, cls) => {
      const [property] = cls.split("-");
      return { ...acc, [property]: cls };
    }, {});

    Object.assign(combinedStyles, customStyles);
  }

  const classNames = Object.values(combinedStyles).join(" ");

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export default Button;
