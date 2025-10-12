import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DepartmentPage from './pages/DepartmentPage';
import CompanyPage from './pages/CompanyPage';
import MentorPage from './pages/MentorPage';
import StudentPage from './pages/StudentPage';
import InternshipPage from './pages/InternshipPage';

function App() {
  return (
    <Router>
      <Layout>
        <Container fluid>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/departments" element={<DepartmentPage />} />
            <Route path="/companies" element={<CompanyPage />} />
            <Route path="/mentors" element={<MentorPage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/internships" element={<InternshipPage />} />
          </Routes>
        </Container>
      </Layout>
    </Router>
  );
}

export default App;