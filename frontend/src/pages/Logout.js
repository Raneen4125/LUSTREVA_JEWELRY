// src/components/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;