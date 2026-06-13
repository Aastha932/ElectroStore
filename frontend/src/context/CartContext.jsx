import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': user ? `Bearer ${user.token}` : '',
    };
  };

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/cart', {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, requireLogin: true };
    try {
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity })
      });
      if (response.ok) {
        await fetchCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:8080/api/cart/update', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity })
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:8080/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearCartState = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCartState,
      cartCount,
      cartTotal,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
