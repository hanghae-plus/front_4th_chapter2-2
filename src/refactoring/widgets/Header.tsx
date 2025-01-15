import { TextButton } from '../shared/ui';

interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export function Header({ isAdmin, onToggleAdmin }: HeaderProps) {
  return (
    <header>
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <TextButton
            title={isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
            onClick={onToggleAdmin}
          />
        </div>
      </nav>
    </header>
  );
}
