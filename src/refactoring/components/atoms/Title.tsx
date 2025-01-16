interface TitleProps {
  text: string;
  level?: 1 | 2 | 3 | 4;
  topTitle?: boolean;
  mbNum?: 2 | 4;
  size?: 'lg';
}

const Title = ({ text, level = 1, topTitle = false, mbNum, size }: TitleProps) => {
  let className = '';
  if (level === 1) {
    className = `${topTitle ? 'text-2xl font-bold' : 'text-3xl font-bold mb-6'}`;
  } else if (level === 2) {
    className = `${mbNum === 2 ? 'text-2xl font-semibold mb-2' : 'text-2xl font-semibold mb-4'}`;
  } else if (level === 3) {
    className = size ? 'text-lg font-semibold mb-2' : 'text-xl font-semibold mb-2';
  } else {
    className = 'text-lg font-semibold mb-2';
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag className={className}>{text}</Tag>;
};

export default Title;
