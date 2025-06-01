import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';
import { DatabaseProvider } from './context/DatabaseContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DatabaseProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </DatabaseProvider>
    </BrowserRouter>
  </StrictMode>
);