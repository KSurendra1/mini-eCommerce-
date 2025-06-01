import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Variant, CartItem } from '../types';

interface CartContextType {
  cartItem: CartItem | null;
  addToCart: (product: Product, variant: Variant, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  const addToCart = (product: Product, variant: Variant, quantity: number) => {
    setCartItem({
      product,
      variant,
      quantity,
      subtotal: variant.price * quantity,
    });
  };

  const clearCart = () => {
    setCartItem(null);
  };

  return (
    <CartContext.Provider value={{ cartItem, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}