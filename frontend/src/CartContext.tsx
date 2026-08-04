import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Product {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  precio_estimado: number | null;
  imagen_url: string;
  etiquetas: string[];
  optic_times_id?: string;
}

interface CartItem extends Product {
  cantidad: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, cantidad: number) => void;
  totalEstimado: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, cantidad: number) => {
    if (cantidad < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, cantidad } : item));
  };

  const totalEstimado = cart.reduce((acc, item) => {
    const price = parseFloat(item.precio_estimado || '0');
    return acc + (price * item.cantidad);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalEstimado, isCartOpen, setIsCartOpen }}>
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
