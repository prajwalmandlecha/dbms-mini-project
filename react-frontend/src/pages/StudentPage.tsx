import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Table,
  Form,
} from "react-bootstrap";
import { ArrowRepeat, CheckCircle, XCircle } from "react-bootstrap-icons";
import DataList from "../components/DataList";
import { Student, Department } from "../types";
import { studentService, departmentService } from "../services/api";

const StudentPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quickAddData, setQuickAddData] = useState<
    Omit<Student, "id" | "department">
  >({
    rollno: "",
    name: "",
    year: "FE",
    div: "",
    mobileNo: "",
    email: "",
    departmentId: 0,
  });
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchStudentsAndDepartments();
  }, []);

  const fetchStudentsAndDepartments = async () => {
    try {
      setLoading(true);
      const [studentsResponse, departmentsResponse] = await Promise.all([
        studentService.getAll(),
        departmentService.getAll(),
      ]);
      setStudents(studentsResponse.data);
      setDepartments(departmentsResponse.data);
      setError(null);
    } catch (err) {
      setError("Failed to load students or departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuickAddData((prev) => ({
      ...prev,
      [name]: name === "departmentId" ? Number(value) : value,
    }));
    setQuickAddError(null);
  };

  const handleDelete = async (student: Student) => {
    if (
      window.confirm(
        `Are you sure you want to delete student "${student.name}" (Roll No: ${student.rollno})?`
      )
    ) {
      try {
        await studentService.delete(student.id);
        setStudents(students.filter((s) => s.id !== student.id));
      } catch (err) {
        setError("Failed to delete student");
        console.error(err);
      }
    }
  };

  const handleEdit = (student: Student) => {
    setQuickAddData({
      rollno: student.rollno,
      name: student.name,
      year: student.year,
      div: student.div,
      mobileNo: student.mobileNo,
      email: student.email,
      departmentId: student.departmentId,
    });
    setEditingId(student.id);
    setQuickAddError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetQuickAdd();
  };

  const handleQuickAdd = async () => {
    if (
      !quickAddData.rollno ||
      !quickAddData.name ||
      !quickAddData.div ||
      !quickAddData.mobileNo ||
      !quickAddData.email ||
      !quickAddData.departmentId
    ) {
      setQuickAddError("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        // Update existing student
        await studentService.update(editingId, quickAddData);
        await fetchStudentsAndDepartments();
        handleCancelEdit();
      } else {
        // Create new student
        const response = await studentService.create(quickAddData);
        setStudents([...students, response.data]);

        // Reset only the form fields, keep year and department for faster entry
        setQuickAddData((prev) => ({
          rollno: "",
          name: "",
          year: prev.year,
          div: "",
          mobileNo: "",
          email: "",
          departmentId: prev.departmentId,
        }));

        // Focus back on first field for rapid entry
        const firstInput = document.querySelector<HTMLInputElement>(
          'input[name="rollno"]'
        );
        if (firstInput) firstInput.focus();
      }
      setQuickAddError(null);
    } catch (err) {
      setQuickAddError(
        editingId
          ? "Failed to update student"
          : "Failed to add student. Check if roll number already exists."
      );
      console.error(err);
    }
  };

  const resetQuickAdd = () => {
    setQuickAddData({
      rollno: "",
      name: "",
      year: "FE",
      div: "",
      mobileNo: "",
      email: "",
      departmentId: 0,
    });
    setQuickAddError(null);
  };

  const columns: {
    key: keyof Student;
    label: string;
    render?: (item: Student) => React.ReactNode;
  }[] = [
    { key: "id", label: "ID" },
    { key: "rollno", label: "Roll No" },
    { key: "name", label: "Name" },
    { key: "year", label: "Year" },
    { key: "div", label: "Division" },
    {
      key: "departmentId",
      label: "Department",
      render: (student: Student) => {
        const dept = departments.find((d) => d.id === student.departmentId);
        return dept ? dept.name : "N/A";
      },
    },
    { key: "mobileNo", label: "Mobile" },
    { key: "email", label: "Email" },
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Student Management</h1>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="mb-4 border-primary">
            <Card.Header
              className={
                editingId ? "bg-info text-white" : "bg-primary text-white"
              }
            >
              <strong>
                {editingId ? "✏️ Edit Student" : "⚡ Add Student"}
              </strong>{" "}
              - Fill all fields and press Enter or click{" "}
              {editingId ? "Update" : "Add"} to quickly{" "}
              {editingId ? "update" : "add"} students
            </Card.Header>
            <Card.Body>
              {quickAddError && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setQuickAddError(null)}
                >
                  {quickAddError}
                </Alert>
              )}
              <Table bordered size="sm" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "12%" }}>Roll No *</th>
                    <th style={{ width: "18%" }}>Name *</th>
                    <th style={{ width: "10%" }}>Year *</th>
                    <th style={{ width: "8%" }}>Div *</th>
                    <th style={{ width: "15%" }}>Mobile *</th>
                    <th style={{ width: "17%" }}>Email *</th>
                    <th style={{ width: "15%" }}>Department *</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="rollno"
                        value={quickAddData.rollno}
                        onChange={handleQuickAddChange}
                        placeholder="2024001"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="name"
                        value={quickAddData.name}
                        onChange={handleQuickAddChange}
                        placeholder="John Doe"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        name="year"
                        value={quickAddData.year}
                        onChange={handleQuickAddChange}
                      >
                        <option value="FE">FE</option>
                        <option value="SE">SE</option>
                        <option value="TE">TE</option>
                        <option value="BE">BE</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="div"
                        value={quickAddData.div}
                        onChange={handleQuickAddChange}
                        placeholder="A"
                        maxLength={2}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="tel"
                        name="mobileNo"
                        value={quickAddData.mobileNo}
                        onChange={handleQuickAddChange}
                        placeholder="9876543210"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="email"
                        name="email"
                        value={quickAddData.email}
                        onChange={handleQuickAddChange}
                        placeholder="john@example.com"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        name="departmentId"
                        value={quickAddData.departmentId}
                        onChange={handleQuickAddChange}
                      >
                        <option value={0}>Select...</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant={editingId ? "primary" : "success"}
                          onClick={handleQuickAdd}
                          title={
                            editingId
                              ? "Update student"
                              : "Add (or press Enter)"
                          }
                        >
                          <CheckCircle size={16} />
                        </Button>
                        {editingId ? (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={handleCancelEdit}
                            title="Cancel editing"
                          >
                            <XCircle size={16} />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={resetQuickAdd}
                            title="Clear"
                          >
                            <XCircle size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="mt-2 text-muted small">
                <strong>Tip:</strong> Department and Year stay selected after
                adding, so you can quickly add multiple students from the same
                class. Press <kbd>Enter</kbd> in any field to add the student.
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">All Students ({students.length})</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={fetchStudentsAndDepartments}
                  className="d-flex align-items-center"
                >
                  <ArrowRepeat size={16} className="me-1" /> Refresh
                </Button>
              </div>

              <DataList
                data={students}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentPage;
