import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/About.css';

// Import your images
import about1 from '../assets/about1.jpg'; 
import about2 from '../assets/about2.jpg'; 
import about3 from '../assets/about3.jpg'; 

const About = () => {
  return (
    <Container className="about-container py-5">
      <div className="about-content text-center">
        <h1 className="about-title">ABOUT US</h1>

        {/* Hero Image */}
        <div className="about-hero-image mt-4">
          <img src={about1} alt="About Us Hero" style={{ width: '70%', maxHeight: '400px', objectFit: 'cover' }} />
        </div>
      
        <div className="mt-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p>
            <strong>Lustreva</strong> is over 30 years old. The beginning of its work dates back to 1967, a workshop was opened on via dei Piatti in Milan, in which only 15 people worked. Over time, thanks to the excellent quality of products and the commercial intuition of the management, Lustreva has grown into a large international organization. Today, the company employs more than 200 people.
          </p>

          <div className="mt-4">
            <Row>
              <Col md={6}>
                <div className="about-image-wrapper mb-4">
                  <img src={about2} alt="Model in White Dress" style={{ width: '100%', borderRadius: '8px' }} />
                </div>
                 <div className="about-image-wrapper mt-4">
                  <img src={about3} alt="Pearl Earrings" style={{ width: '80%', borderRadius: '8px' }} />
                </div>
              </Col>
              <Col md={6}>
                <div className="about-text-block">
                  <p>
                    The company owes its name to an elegant breed of horses. Lustreva's style is easily recognizable — it is a rounded, original and at the same time simple design, massive gold and large multicolored stones.
                  </p>
                  <p>
                    All Lustreva products are mass-produced and designed for everyday wear, but traditional manual production and the highest quality of products make each piece of jewelry uniquely elegant.
                  </p>
                  <p>
                    Lustreva is called a kind of pret-a-porter in the jewelry art — the brand has filled a niche that existed between the exclusive jewelry of famous jewelry houses and products designed for the mass consumer.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default About;