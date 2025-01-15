import { PageTitle } from '../shared/ui/typography';

interface ILayoutProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  children?: React.ReactNode;
}

export function Layout({ isAdmin, setIsAdmin, children }: ILayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-6">
        <div className="container mx-auto p-4">
          <PageTitle title={isAdmin ? '관리자 페이지' : '장바구니'} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
