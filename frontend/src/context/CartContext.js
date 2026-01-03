
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, requireLogin }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchCart = useCallback(async () => {
    const token = getToken();
    setIsGuest(!token);
    setLoading(true);

    try {
      if (token) {
        // Authenticated user - fetch from backend
        const response = await fetch('http://localhost:5000/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const { items } = await response.json();
          setCartItems(items || []);
        } else {
          setCartItems([]);
        }
      } else {
        // Guest user - fetch from localStorage
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

  // Initialize cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

    useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        fetchCart(); // Refresh cart when token changes
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for direct localStorage changes
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
  // Save guest cart to localStorage
  useEffect(() => {
    if (!getToken() && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } else if (!getToken()) {
      localStorage.removeItem('guestCart');
    }
  }, [cartItems]);

  // Add to cart function

const addToCart = async (item) => {
  const token = getToken();

  setCartItems(prev => {
    // 1. Check if the item already exists in the cart
    const existingItem = prev.find(i => (i.id === item.id || i.item_id === item.id));

    let updatedCart;
    if (existingItem) {
      // 2. If it exists, create a new array with the incremented quantity
      updatedCart = prev.map(i =>
        (i.id === item.id || i.item_id === item.id)
          ? { ...i, quantity: (i.quantity || 1) + 1 }
          : i
      );
    } else {
      // 3. If it's new, add it with quantity 1
      const newItem = {
        id: item.id,
        item_id: item.id,
        name: item.name,
        price: item.price,
        image_data: item.image_data,
        quantity: 1
      };
      updatedCart = [...prev, newItem];
    }

    // 4. Save the updated version to backup storage
    localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    return updatedCart;
  });

  
};

  // Remove from cart
  // Update item quantity
const updateQuantity = (index, newQuantity) => {
  const token = getToken();
  
  // Prevent invalid quantities
  if (newQuantity < 1) {
    removeFromCart(index); // Remove if quantity < 1
    return;
  }

  setCartItems(prev => {
    const updatedCart = [...prev];
    updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
    
    // Save to localStorage for guest users
    if (!token && updatedCart.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    } else if (!token) {
      localStorage.removeItem('guestCart');
    }
    
    return updatedCart;
  });

  // 🔜 Optional: Sync with backend if logged in (see note below)
};
  const removeFromCart = (index) => {
    const token = getToken();
    if (!token) {
      // Guest user
      const newCart = cartItems.filter((_, i) => i !== index);
      setCartItems(newCart);
      return;
    }

    // Authenticated user - you can implement backend removal here
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Clear cart
  const clearCart = () => {
    const token = getToken();
    if (!token) {
      localStorage.removeItem('guestCart');
    }
    setCartItems([]);
  };

  // Checkout function
  const checkout = () => {
    if (!getToken()) {
      requireLogin('/cart');
      return;
    }
    // Proceed with checkout
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