import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/endpoints';
import { unwrap } from '../utils/format';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);

  async function refreshCart() {
    if (!isLoggedIn) {
      setCart({ items: [], subtotal: 0 });
      return;
    }
    setLoading(true);
    try {
      const res = await cartApi.get();
      setCart(unwrap(res));
    } catch {
      setCart({ items: [], subtotal: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(bookId, quantity = 1) {
    await cartApi.add({ bookId, quantity });
    await refreshCart();
  }

  async function updateQuantity(id, quantity) {
    await cartApi.update(id, quantity);
    await refreshCart();
  }

  async function removeItem(id) {
    await cartApi.remove(id);
    await refreshCart();
  }

  async function clearCart() {
    await cartApi.clear();
    await refreshCart();
  }

  useEffect(() => { refreshCart(); }, [isLoggedIn]);

  const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const value = useMemo(() => ({ cart, count, loading, refreshCart, addToCart, updateQuantity, removeItem, clearCart }), [cart, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
