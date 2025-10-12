import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  Button,
} from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import { internshipService } from "../services/api";
import { Internship } from "../types";

const HomePage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await internshipService.getAll();
      setInternships(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load internships");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Internship Management System</h1>
              <p className="text-muted">
                Complete overview of all internship records
              </p>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={fetchInternships}
              className="d-flex align-items-center"
            >
              <ArrowRepeat size={16} className="me-1" /> Refresh
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card>
            <Card.Body>
              <h5 className="mb-3">All Internships ({internships.length})</h5>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Student(s)</th>
                        <th>Company</th>
                        <th>Academic Year</th>
                        <th>Duration</th>
                        <th>Mode</th>
                        <th>Stipend</th>
                        <th>PPO</th>
                        <th>Certificate</th>
                        <th>Internal Mentor</th>
                        <th>External Mentor</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="text-center text-muted">
                            No internships found. Add some from the Internships
                            page.
                          </td>
                        </tr>
                      ) : (
                        internships.map((internship) => (
                          <tr key={internship.id}>
                            <td>{internship.id}</td>
                            <td>{internship.title}</td>
                            <td>{internship.description}</td>
                            <td>
                              {internship.students &&
                              internship.students.length > 0
                                ? internship.students
                                    .map(
                                      (si: any) =>
                                        `${si.student.name} (${si.student.rollno})`
                                    )
                                    .join(", ")
                                : "None"}
                            </td>
                            <td>{internship.company?.name || "N/A"}</td>
                            <td>{internship.academicYear}</td>
                            <td>{internship.duration} months</td>
                            <td>{internship.mode}</td>
                            <td>₹{internship.stipend}</td>
                            <td>{internship.PPO ? "Yes" : "No"}</td>
                            <td>{internship.CompletionCertificate}</td>
                            <td>{internship.internalMentor?.name || "N/A"}</td>
                            <td>{internship.externalMentor?.name || "N/A"}</td>
                            <td>{internship.Remarks || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
