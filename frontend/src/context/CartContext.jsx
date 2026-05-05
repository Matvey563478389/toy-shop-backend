import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

const CART_STORAGE_KEY = "toy_shop_cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const prevUserIdRef = useRef(undefined);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart([]);
  }, []);

  useEffect(() => {
    const id = user?.id ?? null;
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== null && id === null) {
      clearCart();
    }
    prevUserIdRef.current = id;
  }, [user, clearCart]);

  const addToCart = (toy) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === toy.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === toy.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...toy, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);