import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Building, PersonBoundingBox, PersonVcard, JournalText, Briefcase } from 'react-bootstrap-icons';

const Navigation: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            <Briefcase className="me-2" />
            <span>Internship Management System</span>
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/departments">
              <Nav.Link className="d-flex align-items-center">
                <Building className="me-2" /> Departments
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/companies">
              <Nav.Link className="d-flex align-items-center">
                <Building className="me-2" /> Companies
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/mentors">
              <Nav.Link className="d-flex align-items-center">
                <PersonVcard className="me-2" /> Mentors
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/students">
              <Nav.Link className="d-flex align-items-center">
                <PersonBoundingBox className="me-2" /> Students
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/internships">
              <Nav.Link className="d-flex align-items-center">
                <JournalText className="me-2" /> Internships
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;