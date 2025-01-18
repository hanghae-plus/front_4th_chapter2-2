import { createBrowserRouter, RouterProvider } from 'react-router';
import { AdminPage } from '@advanced/pages/admin';
import { CartPage } from '@advanced/pages/cart';
import { RootLayout } from '@advanced/widgets/layout';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <CartPage /> },
        {
          path: '/admin',
          element: <AdminPage />,
        },
      ],
    },
  ],
  { basename: '/index.advanced.html' },
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
