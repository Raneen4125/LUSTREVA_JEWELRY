// src/pages/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import '../styles/PageLayout.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('http://localhost:5000/jewelry');
        if (!response.ok) throw new Error('Failed to fetch products');
        const items = await response.json();
        const productId = parseInt(id, 10);
        const found = items.find(item => item.id === productId);
        setProduct(found || null);
      } catch (err) {
        console.error('Error loading product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(parseInt(id, 10))) {
      fetchProduct();
    } else {
      setLoading(false);
      setProduct(null);
    }
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!product) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const res = await fetch(`http://localhost:5000/wishlist/check/${product.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setInWishlist(data.in_wishlist);
        }
      } catch (err) {
        console.error('Wishlist check error:', err);
      }
    };
    
    checkWishlist();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_data: product.image_data,
      description: product.description,
      quantity: 1
    });
  };

const handleWishlist = async () => {
  if (!product) return;
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to use wishlist');
    return;
  }
  
  setLoadingWishlist(true);
  try {
    const url = inWishlist 
      ? `http://localhost:5000/wishlist/${product.id}`
      : 'http://localhost:5000/wishlist';
    
    const method = inWishlist ? 'DELETE' : 'POST';
    const body = inWishlist ? null : JSON.stringify({ item_id: product.id });
    
    const res = await fetch(url, {
      method,
      headers: {
        'Content-ty ': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setInWishlist(!inWishlist);
    } else {
      alert(data.error || 'Failed to update wishlist');
    }
  } catch (err) {
    alert('Failed to connect to server');
  } finally {
    setLoadingWishlist(false);
  }
};

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h2>Loading product details...</h2>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Product not found</h2>
        <Button 
          variant="outline-secondary" 
          className="mt-3 btn-elegant rounded-pill"
          onClick={() => navigate('/products')}
        >
          ← Back to Collection
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Product Image */}
        <Col md={6} className="text-center mb-4 mb-md-0">
          <img
            src={`data:image/jpg;base64,${product.image_data}`}
            alt={product.name}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </Col>

        {/* Product Info */}
        <Col md={6} className="text-start">
          <h2>{product.name}</h2>
          <p style={{ fontWeight: '500', fontSize: '1.1rem', color: '#555' }}>
            {product.description}
          </p>
          <h3 className="text-dark my-4">
            ${Number(product.price).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>

          {/* Action Buttons */}
          <div className="d-flex gap-3 align-items-center">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              disabled={loadingWishlist}
              className="wishlist-button"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '5px'
              }}
            >
              {inWishlist ? (
                <FaHeart color="#ff3b30" />
              ) : (
                <FaRegHeart color="#6b4e3d" />
              )}
            </button>

            {/* Add to Cart Button */}
            <Button
              className="btn-elegant rounded-pill"
              style={{
                background: 'transparent',
                color: '#6b4e3d',
                border: '1.5px solid #6b4e3d',
                fontWeight: '600',
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            {/* Back Button */}
            <Button
              className="btn-elegant rounded-pill"
              style={{
                background: 'transparent',
                color: '#6b4e3d',
                border: '1.5px solid #6b4e3d',
                fontWeight: '600',
              }}
              onClick={() => navigate('/products')}
            >
              ← Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;