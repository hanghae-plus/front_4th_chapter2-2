import { Outlet } from 'react-router';
import { Header } from './Header';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-6">
        <Outlet />
      </main>
    </div>
  );
}
