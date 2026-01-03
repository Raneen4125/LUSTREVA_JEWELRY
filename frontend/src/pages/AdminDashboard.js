// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';



const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/jewelry', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          navigate('/products'); // Redirect if not admin
          return;
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Admin check error:', err);
        navigate('/products');
      }
    };
    
    if (token) {
      checkAdmin();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/admin/jewelry', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          category_id: formData.category_id || null
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add product');
      }
      
     setSuccess('Product added successfully!');

setTimeout(() => {
  setSuccess('');
}, 2000);

      setFormData({ name: '', description: '', price: '', stock: '', category_id: '' });
      setShowForm(false);
      
      // Refresh product list
      const refreshResponse = await fetch('http://localhost:5000/admin/jewelry', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const refreshedData = await refreshResponse.json();
      setProducts(refreshedData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/admin/jewelry/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Refresh list
      const refreshResponse = await fetch('http://localhost:5000/admin/jewelry', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const refreshedData = await refreshResponse.json();
      setProducts(refreshedData);
      
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm">
           <Card.Header
  style={{
    backgroundColor: '#6b4e3d',   // light brown
    color: 'white'
  }}
>

              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0"
                style={{color:'whitesmoke'}}
                >Admin Dashboard</h3>
                <Button 
               
                  variant="light"
                className="btn-elegant rounded-pill px-4 py-2"
                style={{ backgroundColor: '#6b4e3d', borderColor: 'white', color: 'white', fontWeight: '600' }}
                 
                  
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : 'Add Product'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {/* Add Product Form */}
              {showForm && (
                <Form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded">
                  <h5 className="mb-3">Add New Product</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className  ="mb-3">
                        <Form.Label>Price *</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Stock Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category ID</Form.Label>
                        <Form.Control
                          type="number"
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" disabled={loading}
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
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </Button>
                </Form>
              )}
              
              {/* Products Table */}
              <h5 className="mb-3">Manage Products</h5>
              {products.length === 0 ? (
                <p className="text-muted">No products found.</p>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                          {/* You can add Edit button here later */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;