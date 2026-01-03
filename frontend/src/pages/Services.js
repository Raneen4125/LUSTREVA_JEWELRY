import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaGem, FaPalette, FaWrench, FaShieldAlt } from 'react-icons/fa';

const Services = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-5 " style={{ color: '#6b4e3d' }}>Our Services</h2>
      <Row className="g-4">
        <Col md={6}>
          <div className="p-4 rounded-pill" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <div style={{ color: '#a77e66ff', marginBottom: '1rem' }}><FaGem size={50} /></div>
            <h3 style={{ color: '#a77e66ff' }}>Custom Design</h3>
            <p>Create one-of-a-kind pieces with our designers.</p>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-4 rounded-pill" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <div style={{ color: '#a77e66ff', marginBottom: '1rem' }}><FaPalette size={50} /></div>
            <h3 style={{ color: '#a77e66ff' }}>Jewelry Redesign</h3>
            <p>Transform heirlooms into modern treasures.</p>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-4 rounded-pill" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <div style={{ color: '#a77e66ff', marginBottom: '1rem' }}><FaWrench size={50} /></div>
            <h3 style={{ color: '#a77e66ff' }}>Repair & Polishing</h3>
            <p>Restore your jewelry to its original brilliance.</p>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-4 rounded-pill" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <div style={{ color: '#a77e66ff', marginBottom: '1rem' }}><FaShieldAlt size={50} /></div>
            <h3 style={{ color: '#a77e66ff' }}>Lifetime Care</h3>
            <p>Free cleaning and minor repairs for life.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;