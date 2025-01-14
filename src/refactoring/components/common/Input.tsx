interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "className"
  > {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const INIT_STYLE = "w-full p-2 border rounded";

const Input = ({ onChange, className = INIT_STYLE, ...rest }: InputProps) => {
  return <input onChange={onChange} className={className} {...rest} />;
};

export default Input;
