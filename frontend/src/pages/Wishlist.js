// src/pages/Wishlist.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { useCart } from '../context/CartContext'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   const { addToCart } = useCart();
   

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const res = await fetch('http://localhost:5000/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [navigate]); 

  const removeFromWishlist = async (item_id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/wishlist/${item_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setWishlist(wishlist.filter(item => item.id !== item_id));
  };
  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_data: item.image_data,
      description: item.description,
      quantity: 1
    });
  };
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h3>Your wishlist is empty</h3>
        <p>Start adding your favorite items!</p>
        <Button 
          variant="light"
          onClick={() => navigate('/products')}
          className="btn-elegant rounded-pill px-4 py-2"
          style={{
            backgroundColor: '#6b4e3d',
            borderColor: '#6b4e3d',
            color: '#f8f3eb',
            fontWeight: '600'
          }}
        >
          Browse Collection
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4" style={{ 
        color: '#6b4e3d', 
        fontFamily: "'Playfair Display', serif" 
      }}>
        Your Wishlist
      </h2>
      <Row>
        {wishlist.map((item) => (
          <Col md={4} lg={3} className="mb-4" key={item.id}>
            <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px' }}>
              {item.image_data && (
                <Card.Img 
                  variant="top" 
                  src={`data:image/jpeg;base64,${item.image_data}`} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title style={{ color: '#6b4e3d' }}>{item.name}</Card.Title>
                <Card.Text className="text-muted">${item.price}</Card.Text>
                <div className="d-flex gap-2">
                  {/* Add to Cart Button - Your brand color */}
               <Button 
                    variant="light"
                    size="sm"
                    onClick={() => handleAddToCart(item)
                        
                    }
                    className="btn-elegant rounded-pill px-3 py-1"
                    style={{
                      backgroundColor: '#a77e66ff',
                      borderColor: '#a77e66ff',
                      color: '#000',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    Add to Cart
                  </Button>
                  
                  
                  {/* Remove Button - Elegant dark color */}
                  <Button 
                    variant="light"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="btn-elegant rounded-pill px-3 py-1"
                    style={{
                      backgroundColor: '#6b4e3d', // Your brand dark brown
                      borderColor: '#6b4e3d',
                      color: '#f8f3eb', // Light cream color like your navbar text
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;