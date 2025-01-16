import { combineClassNames } from "../../utils/style-utile";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  className?: string;
}

const baseStyle = {
  width: "w-full",
  p: "p-2",
  border: "border",
  rounded: "rounded",
};

const Input = ({ className, ...rest }: InputProps) => {
  const classNames = combineClassNames(baseStyle, className);

  return <input className={classNames} {...rest} />;
};

export default Input;
