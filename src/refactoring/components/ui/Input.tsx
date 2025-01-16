import { ChangeEvent } from 'react';
import classNames from '../../utils/classNames.ts';

type PropsType = {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  label?: string;
  id?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};
export const Input = (props: PropsType) => {
  const {
    value,
    onChange,
    type = 'text',
    placeholder = '',
    label,
    id,
    wrapperClassName,
    labelClassName,
    inputClassName,
    ...rest
  } = props;

  return (
    <div className={classNames('mb-2', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={classNames(
            'block text-sm font-medium text-gray-700',
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        type={type}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        className={classNames('w-full p-2 border rounded', inputClassName)}
      />
    </div>
  );
};
