import { PageTitle } from '../../shared/ui/typography';

interface LayoutProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="container mx-auto p-4">
      <PageTitle title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}
