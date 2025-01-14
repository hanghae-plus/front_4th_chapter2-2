import { combineClassNames } from "../../utils/style-utile";

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "className"
  > {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const baseStyle = {
  width: "w-full",
  p: "p-2",
  border: "border",
  rounded: "rounded",
};

const Input = ({ onChange, className, ...rest }: InputProps) => {
  const classNames = combineClassNames(baseStyle, className);

  return <input onChange={onChange} className={classNames} {...rest} />;
};

export default Input;
