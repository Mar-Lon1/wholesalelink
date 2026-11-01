import { useState } from 'react';

/**
 * Cart context hook — manages per-wholesaler cart state in memory.
 * Returns { cart, addToCart, removeFromCart, updateQty, clearCart, itemCount, total }
 */
export function useCart() {
  const [cart, setCart] = useState({
    wholesalerId: null,
    items: [], // { product, quantity }
  });

  function addToCart(product, quantity) {
    setCart((prev) => {
      if (prev.wholesalerId && prev.wholesalerId !== product.wholesalerId) {
        // Warn: can't mix wholesalers
        throw new Error(
          'Your cart already has items from another supplier. Clear the cart first to add from this supplier.'
        );
      }

      const existing = prev.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }

      return {
        wholesalerId: product.wholesalerId,
        items: [...prev.items, { product, quantity }],
      };
    });
  }

  function updateQty(productId, quantity) {
    if (quantity < 1) return removeFromCart(productId);
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    }));
  }

  function removeFromCart(productId) {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.product.id !== productId);
      return { wholesalerId: items.length === 0 ? null : prev.wholesalerId, items };
    });
  }

  function clearCart() {
    setCart({ wholesalerId: null, items: [] });
  }

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQty, clearCart, itemCount, total };
}
