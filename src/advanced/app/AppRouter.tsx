import { createBrowserRouter, RouterProvider } from 'react-router';
import { CartPage } from '@advanced/pages/cart';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <CartPage />,
    },
  ],
  { basename: '/index.advanced.html' },
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
