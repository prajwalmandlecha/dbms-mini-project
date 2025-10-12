import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <Container fluid className="flex-grow-1 py-4">
        <Row>
          <Col>
            {children}
          </Col>
        </Row>
      </Container>
      <footer className="bg-light py-3 mt-auto">
        <Container fluid>
          <Row>
            <Col className="text-center">
              <p className="mb-0">© {new Date().getFullYear()} Internship Management System</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;