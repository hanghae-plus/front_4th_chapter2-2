type LabelStyle = 'default' | 'simple';
type InputStyle = 'full' | 'third';

interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  labelStyle?: LabelStyle;
  inputStyle?: InputStyle;
}

export function Input({
  label,
  labelStyle = 'default',
  inputStyle = 'full',
  ...props
}: InputProps) {
  const labelStyles = {
    default: 'block text-sm font-medium text-gray-700',
    simple: 'block mb-1',
  };

  const inputStyles = {
    full: 'w-full p-2 border rounded',
    third: 'w-1/3 p-2 border rounded',
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={props.id} className={labelStyles[labelStyle]}>
          {label}
        </label>
      )}
      <input className={inputStyles[inputStyle]} {...props} />
    </div>
  );
}
