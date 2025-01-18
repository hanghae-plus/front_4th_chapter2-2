import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { Heading } from '@advanced/shared/ui';

export function Header() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Heading as="h1" className="text-2xl font-bold">
          쇼핑몰 관리 시스템
        </Heading>
        <Link
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          to={isAdmin ? '/' : '/admin'}
        >
          {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
        </Link>
      </div>
    </nav>
  );
}
