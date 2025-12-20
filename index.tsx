import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {
      // Allow an optional base path (useful when the app is served from a subpath)
      // Set VITE_BASENAME in your environment (e.g. ".env" file) to provide a basename like "/home"
    }
    <BrowserRouter basename={((import.meta as any).env?.VITE_BASENAME || '/') === '/' ? undefined : (import.meta as any).env.VITE_BASENAME}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
