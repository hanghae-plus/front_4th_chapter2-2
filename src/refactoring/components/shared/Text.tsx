interface TextProps {
  title: string;
  value: string;
  type?: string;
}

const TextClassNames: Record<string, string> = {
  green: "text-green-600",
  xlBold: "text-xl font-bold",
};

export const Text = ({ type, title, value }: TextProps) => {
  return (
    <p className={TextClassNames[`${type}`] || ""}>
      {title}: {value}
    </p>
  );
};
