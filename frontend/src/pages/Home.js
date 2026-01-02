// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaGem, FaCertificate, FaShieldAlt, FaShippingFast } from 'react-icons/fa';
import '../styles/PageLayout.css';

// Keep your local assets
import modelImage from '../assets/model.jpg';
import insta1 from '../assets/image.png';
import insta2 from '../assets/image2.png';
import insta3 from '../assets/image3.png';

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('http://localhost:5000/jewelry');
        if (!response.ok) throw new Error('Failed to fetch');
        const allItems = await response.json();
        setFeatured(allItems.slice(0, 3)); // First 3 items
      } catch (err) {
        console.error('Error loading featured jewelry:', err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <Container className="py-4">
      {/* Hero Banner */}
      <div className="py-4" style={{ backgroundColor: '#f8f3eb', borderRadius: '20px', overflow: 'hidden' }}>
        <Row className="align-items-center g-4">
          <Col md={6} className="text-center text-md-start px-4 px-md-5">
            <h1 style={{ color: '#6b4e3d', fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: '700' }}>
              Lustreva Jewelry
            </h1>
            <p className="mt-3" style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Your one-stop destination for unique and exquisite jewelry pieces.
            </p>
            <Button
              onClick={() => navigate('/products')}
              style={{
                backgroundColor: '#6b4e3d',
                color: '#f8f3eb',
                fontWeight: '600',
                padding: '0.8rem 2rem',
                borderRadius: '30px',
                border: 'none',
                marginTop: '1.2rem',
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(107, 78, 61, 0.2)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Explore Collection
            </Button>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <div
              style={{
                width: '100%',
                maxWidth: '450px',
                height: '350px',
                backgroundImage: `url(${modelImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
              }}
            />
          </Col>
        </Row>
      </div>

      {/* WHY CHOOSE US */}
      <div className="py-5" style={{ backgroundColor: '#f8f3eb' }}>
        <h2 className="text-center mb-5" style={{ color: '#6b4e3d', fontFamily: "'Playfair Display', serif" }}>
          WHY CHOOSE US
        </h2>
        <Row className="g-4">
          {[
            { icon: <FaGem size={40} />, title: "Custom Design", desc: "Create your perfect piece." },
            { icon: <FaCertificate size={40} />, title: "Certified Quality", desc: "GIA-certified diamonds." },
            { icon: <FaShieldAlt size={40} />, title: "Lifetime Warranty", desc: "On all jewelry pieces." },
            { icon: <FaShippingFast size={40} />, title: "Free Shipping", desc: "On orders over $500." }
          ].map((item, i) => (
            <Col md={3} key={i} className="d-flex">
              <div
                className="p-4 text-center rounded shadow-sm"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0d5c9',
                  flex: 1,
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ color: '#6b4e3d', marginBottom: '1rem' }}>{item.icon}</div>
                <h5 style={{ color: '#6b4e3d', fontWeight: '600', fontSize: '1.1rem' }}>{item.title}</h5>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Featured Products */}
      <h2 className="text-center mb-4 mt-5" style={{ color: '#6b4e3d' }}>✨ Featured Pieces</h2>
      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <Row>
            {featured.map((item) => (
              <Col md={4} key={item.id} className="mb-4">
                <Card
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="shadow-sm"
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #e0d5c9',
                    backgroundColor: '#fff',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ height: '250px', backgroundColor: '#f8f3eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_data ? (
                      <img
                        src={`data:image/jpg;base64,${item.image_data}`}
                        alt={item.name}
                        style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div>No Image</div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <h5>${Number(item.price).toFixed(2)}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center">
            <Button
              onClick={() => navigate('/products')}
              style={{
                backgroundColor: '#6b4e3d',
                color: '#f8f3eb',
                fontWeight: '600',
                padding: '0.8rem 2rem',
                borderRadius: '30px',
                border: 'none',
                marginTop: '1.2rem',
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(107, 78, 61, 0.2)',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Explore Full Collection
            </Button>
          </div>
        </>
      )}

      {/* FOLLOW US ON INSTAGRAM (Updated - non-clickable) */}
      <div className="py-5 mt-5" style={{ backgroundColor: '#f8f3eb' }}>
        <h2 className="text-center mb-4" style={{ color: '#6b4e3d', fontFamily: "'Playfair Display', serif", fontWeight: '600', fontSize: '2rem' }}>
          FOLLOW US ON INSTAGRAM
        </h2>
        <Row className="g-3 justify-content-center">
          <Col xs={6} md={4}>
            <div style={{ height: '220px', backgroundColor: '#e0d5c9', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <img src={insta1} alt="Instagram Post 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Col>
          <Col xs={6} md={4}>
            <div style={{ height: '220px', backgroundColor: '#e0d5c9', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <img src={insta2} alt="Instagram Post 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Col>
          <Col xs={6} md={4}>
            <div style={{ height: '220px', backgroundColor: '#e0d5c9', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <img src={insta3} alt="Instagram Post 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <span style={{ color: '#6b4e3d', fontWeight: '600', fontSize: '1.1rem' }}>
            @lustreva.shop (coming soon!)
          </span>
        </div>
      </div>
    </Container>
  );
};

export default Home;
