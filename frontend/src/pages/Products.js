import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../styles/PageLayout.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  
  const WishlistButton = ({ item_id }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already in wishlist (optional enhancement)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/wishlist/check/${item_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setInWishlist(data.in_wishlist))
    .catch(() => {});
  }, [item_id]);

  const handleWishlist = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Please log in to use wishlist');
    return;
  }
  
  try {
    const response = await fetch('${API_URL}/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ item_id })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('❤️ Added to wishlist!');
    } else {
      alert(data.error || 'Failed to add to wishlist');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

    return (
      <button 
      onClick={(e) => {
        e.stopPropagation();
        handleWishlist();
      }}
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: inWishlist ? '#ff3b30' : '#6b4e3d'
      }}
    >
      {inWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
    );
  };

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await fetch('${API_URL}/jewelry');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Error loading jewelry:', err);
        alert('Failed to load products. Check if backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchJewelry();
  }, []);

  if (loading) {
    return (
      <Container className="py-5">
        <h2 className="text-center mb-5" style={{ color:'#6b4e3d', fontFamily: "'Playfair Display', serif" }}>
          Our Jewelry Collection
        </h2>

        <Row>
          {[1, 2, 3].map((i) => (
            <Col md={6} lg={4} xl={4} key={i} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <div style={{ height: '250px', backgroundColor: '#f9f9f9' }} />
                <Card.Body>
                  <div className="placeholder-glow">
                    <div className="placeholder col-8" style={{ height: '20px' }}></div>
                    <div className="placeholder col-6 mt-2" style={{ height: '15px' }}></div>
                    <div className="placeholder col-4 mt-3" style={{ height: '20px' }}></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5" style={{ color:'#6b4e3d', fontFamily: "'Playfair Display', serif" }}>
        Our Jewelry Collection
      </h2>

      <Row>
        {items.map((item) => (
          <Col md={6} lg={4} xl={4} key={item.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0 hover-shadow">
              <div
                style={{
                  height: '250px',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.image_data ? (
                  <img
                    src={`data:image/jpg;base64,${item.image_data}`}
                    alt={item.name}
                    style={{
                      maxHeight: '90%',
                      maxWidth: '90%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div style={{ color: '#ccc', fontSize: '1.2rem' }}>No Image</div>
                )}
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.name}</Card.Title>
                <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.95rem' }}>
                  {item.description}
                </Card.Text>
                <h5 className="text-dark">${Number(item.price).toFixed(2)}</h5>
                
                {/* ✅ Clean wishlist + add to cart buttons */}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <WishlistButton item_id={item.id} />
                  <Button
                    className="btn-elegant rounded-pill"
                    style={{
                      backgroundColor: '#a77e66ff',
                      borderColor: '#a77e66ff',
                      color: '#000',
                      fontWeight: '600'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image_data: item.image_data,
                        description: item.description,
                        quantity: 1
                      });
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <Button
          variant="outline-dark"
          onClick={() => navigate('/cart')}
          className="btn-elegant rounded-pill"
        >
          🛍️ View Your Cart
        </Button>
      </div>
    </Container>
  );
};

export default Products;