import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const enableMocking = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.ts');
    return worker.start();
  }
};

await enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
