interface PageLayoutProps {
  children: React.ReactNode;
  actions: JSX.Element;
}

const PageLayout = ({ children, actions }: PageLayoutProps) => (
  <div className="min-h-screen bg-gray-100">
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
        {actions}
      </div>
    </nav>

    <main className="container mx-auto mt-6">{children}</main>
  </div>
);

export default PageLayout;
