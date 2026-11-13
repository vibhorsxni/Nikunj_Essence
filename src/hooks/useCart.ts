import { useState, useEffect, useCallback } from 'react';
import { products, type Product, type ProductVariant } from '../data/products';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

const CART_STORAGE_KEY = 'nikunj_essence_cart_v1';
export const FREE_SHIPPING_THRESHOLD = 2000;
export const STANDARD_SHIPPING_FEE = 99;
export const MAX_ITEM_QUANTITY = 10;

interface SerializedCartItem {
  productId: string;
  size: string;
  quantity: number;
}

function loadPersistedCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validated: CartItem[] = [];

    for (const entry of parsed as Partial<SerializedCartItem>[]) {
      if (!entry || typeof entry.productId !== 'string' || typeof entry.size !== 'string') {
        continue;
      }
      const canonicalProduct = products.find(p => p.id === entry.productId);
      if (!canonicalProduct) continue;

      const canonicalVariant = canonicalProduct.variants.find(v => v.size === entry.size);
      if (!canonicalVariant) continue;

      const qty = typeof entry.quantity === 'number' && entry.quantity > 0
        ? Math.min(Math.floor(entry.quantity), MAX_ITEM_QUANTITY)
        : 1;

      validated.push({
        product: canonicalProduct,
        variant: canonicalVariant,
        quantity: qty,
      });
    }

    return validated;
  } catch (err) {
    console.warn('Failed to parse saved cart data from localStorage:', err);
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const serialized: SerializedCartItem[] = items.map(item => ({
      productId: item.product.id,
      size: item.variant.size,
      quantity: item.quantity,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn('Failed to save cart to localStorage:', err);
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => loadPersistedCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((product: Product, variant: ProductVariant, quantity: number = 1) => {
    const addQty = Math.max(1, Math.min(quantity, MAX_ITEM_QUANTITY));
    setItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.variant.size === variant.size
      );
      if (existingIdx >= 0) {
        return prev.map((item, idx) => {
          if (idx !== existingIdx) return item;
          const nextQty = Math.min(item.quantity + addQty, MAX_ITEM_QUANTITY);
          return { ...item, quantity: nextQty };
        });
      }
      return [...prev, { product, variant, quantity: addQty }];
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
    const clampedQty = Math.min(Math.floor(quantity), MAX_ITEM_QUANTITY);
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.variant.size === size
          ? { ...i, quantity: clampedQty }
          : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const totalPrice = subtotal + shippingFee;
  const freeShippingProgress = subtotal === 0 ? 0 : Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shippingFee,
    isFreeShipping,
    totalPrice,
    freeShippingProgress,
    amountNeededForFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };
}
