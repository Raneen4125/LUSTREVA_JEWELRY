import { useState } from 'react';

export const useWishlist = () => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const addToWishlist = async (item_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new CustomEvent('loginRequired'));
      return false;
    }
    
    try {
      const res = await fetch('http://localhost:5000/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ item_id })
      });
      if (res.ok) {
        setWishlistCount(prev => prev + 1);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const fetchWishlistCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:5000/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistCount(data.length);
      }
    } catch (err) {}
  };

  return { addToWishlist, wishlistCount, fetchWishlistCount };
};