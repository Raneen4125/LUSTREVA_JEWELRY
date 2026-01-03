import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, requireLogin }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  const getToken = () => localStorage.getItem('token');

  // 🔥 Backend helper functions
  const addToCartBackend = async (item) => {
    const token = getToken();
    if (!token) return;
    
    try {
      await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: item.id,
          quantity: item.quantity || 1
        })
      });
    } catch (err) {
      console.error('Backend cart add failed:', err);
    }
  };

  const removeFromCartBackend = async (item_id) => {
    const token = getToken();
    if (!token) return;
    
    try {
      await fetch(`${API_URL}/cart/${item_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Backend cart remove failed:', err);
    }
  };

  const fetchCart = useCallback(async () => {
    const token = getToken();
    setIsGuest(!token);
    setLoading(true);

    try {
      if (token) {
        // ✅ Use API_URL here
        const response = await fetch(`${API_URL}/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const { items } = await response.json();
          setCartItems(items || []);
        } else {
          setCartItems([]);
        }
      } else {
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        } else {
          setCartItems([]);
        }
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        fetchCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const checkTokenInterval = setInterval(() => {
      if (getToken() !== localStorage.getItem('token')) {
        fetchCart();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkTokenInterval);
    };
  }, [fetchCart]);

  useEffect(() => {
    if (!getToken() && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } else if (!getToken()) {
      localStorage.removeItem('guestCart');
    }
  }, [cartItems]);

  // ✅ Fixed addToCart with backend sync
  const addToCart = async (item) => {
    const token = getToken();

    setCartItems(prev => {
      const existingItem = prev.find(i => (i.id === item.id || i.item_id === item.id));
      let updatedCart;
      
      if (existingItem) {
        updatedCart = prev.map(i =>
          (i.id === item.id || i.item_id === item.id)
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      } else {
        const newItem = {
          id: item.id,
          item_id: item.id,
          name: item.name,
          price: item.price,
          image_ item.image_data,
          quantity: 1
        };
        updatedCart = [...prev, newItem];
      }

      if (!token && updatedCart.length > 0) {
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });

    // 🔥 Sync with backend for authenticated users
    if (token) {
      addToCartBackend({ ...item, quantity: 1 });
    }
  };

  const updateQuantity = (index, newQuantity) => {
    const token = getToken();
    
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }

    setCartItems(prev => {
      const updatedCart = [...prev];
      updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
      
      if (!token && updatedCart.length > 0) {
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      } else if (!token) {
        localStorage.removeItem('guestCart');
      }
      return updatedCart;
    });

    // Optional: Add backend sync for quantity updates
  };

  const removeFromCart = (index) => {
    const token = getToken();
    const itemToRemove = cartItems[index];
    
    setCartItems(prev => prev.filter((_, i) => i !== index));

    if (token) {
      removeFromCartBackend(itemToRemove.item_id || itemToRemove.id);
    } else {
      const newCart = cartItems.filter((_, i) => i !== index);
      if (newCart.length > 0) {
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      } else {
        localStorage.removeItem('guestCart');
      }
    }
  };

  const clearCart = () => {
    const token = getToken();
    if (!token) {
      localStorage.removeItem('guestCart');
    }
    setCartItems([]);
  };

  const checkout = () => {
    if (!getToken()) {
      requireLogin('/cart');
      return;
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart: cartItems, 
        addToCart, 
        removeFromCart,
        updateQuantity, 
        clearCart,
        checkout,
        loading,
        isGuest
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;