import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // eslint-disable-next-line import/no-internal-modules
  const { worker } = await import('../../mocks/browser.ts');

  return worker.start();
}

await enableMocking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
