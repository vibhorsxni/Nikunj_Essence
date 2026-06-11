import { useState, useCallback } from 'react';
import type { Product, ProductVariant } from '../data/products';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, variant: ProductVariant) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.variant.size === variant.size
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.variant.size === variant.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.variant.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.variant.size === size
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeItem]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);

  return { items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, totalItems, totalPrice };
}
