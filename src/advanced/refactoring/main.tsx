import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ProductContextProvider from './components/shared/product/context/ProductContextProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProductContextProvider>
      <App />
    </ProductContextProvider>
  </React.StrictMode>,
);
