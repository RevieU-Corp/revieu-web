import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '../assets/styles/globals.css';
import '../assets/styles/merchant.css';

if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);