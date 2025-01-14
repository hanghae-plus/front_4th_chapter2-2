interface ContainerProps {
  children: React.ReactNode;
  title: string;
}

const Container = ({ children, title }: ContainerProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

export default Container;
