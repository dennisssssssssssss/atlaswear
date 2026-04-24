import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    qty: number,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalUSD: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = 'atlas-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);

      if (!storedItems) {
        return [];
      }

      const parsedItems = JSON.parse(storedItems);
      return Array.isArray(parsedItems) ? parsedItems : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color,
      );

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { product, size, color, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (productId: string, size: string, color: string) => {
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.size === size &&
              item.color === color
            ),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, qty: number) => {
      if (qty <= 0) {
        removeItem(productId, size, color);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: qty }
            : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => {
    const price =
      item.product.onSale && item.product.salePrice
        ? item.product.salePrice
        : item.product.priceUSD;

    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalUSD,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
