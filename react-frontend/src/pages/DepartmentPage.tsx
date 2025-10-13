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
import { Department } from "../types";
import { departmentService } from "../services/api";

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const clearFilters = () => {
    setSearch("");
  };

  // Quick Add State - Always visible
  const [quickAddData, setQuickAddData] = useState<Omit<Department, "id">>({
    name: "",
  });
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAll();
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dept: Department) => {
    if (
      window.confirm(
        `Are you sure you want to delete department "${dept.name}"?`
      )
    ) {
      try {
        await departmentService.delete(dept.id);
        setDepartments(departments.filter((d) => d.id !== dept.id));
      } catch (err) {
        setError("Failed to delete department");
        console.error(err);
      }
    }
  };

  // Quick Add Handlers
  const handleQuickAddChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuickAddData((prev) => ({ ...prev, [name]: value }));
    setQuickAddError(null);
  };

  const handleEdit = (dept: Department) => {
    setQuickAddData({ name: dept.name });
    setEditingId(dept.id);
    setQuickAddError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetQuickAdd();
  };

  const handleQuickAdd = async () => {
    if (!quickAddData.name.trim()) {
      setQuickAddError("Please enter department name");
      return;
    }

    try {
      if (editingId) {
        await departmentService.update(editingId, quickAddData);
        await fetchDepartments();
        handleCancelEdit();
      } else {
        await departmentService.create(quickAddData);
        await fetchDepartments(); // Refresh the list to ensure consistency
        setQuickAddData({ name: "" });

        // Auto-focus first field
        const firstInput =
          document.querySelector<HTMLInputElement>('input[name="name"]');
        if (firstInput) firstInput.focus();
      }
      setQuickAddError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        (editingId
          ? "Failed to update department"
          : "Failed to add department");
      setQuickAddError(errorMessage);
      console.error(err);
    }
  };

  const resetQuickAdd = () => {
    setQuickAddData({ name: "" });
    setQuickAddError(null);
  };

  const columns: { key: keyof Department; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
  ];

  const filtered = departments.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return String(d.id).includes(q) || d.name.toLowerCase().includes(q);
  });

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Department Management</h1>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="mb-4 border-primary">
            <Card.Header
              className={
                editingId ? "bg-info text-white" : "bg-primary text-white"
              }
            >
              <strong>
                {editingId ? "Edit Department" : "Add Department"}
              </strong>{" "}
              - Fill and press Enter or click {editingId ? "Update" : "Add"}
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
                    <th style={{ width: "85%" }}>Department Name *</th>
                    <th style={{ width: "15%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="name"
                        value={quickAddData.name}
                        onChange={handleQuickAddChange}
                        placeholder="Computer Science"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                        autoFocus
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant={editingId ? "primary" : "success"}
                          onClick={handleQuickAdd}
                          title={
                            editingId
                              ? "Update department"
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
                <strong>Tip:</strong> Press <kbd>Enter</kbd> to quickly add the
                department.
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">All Departments ({filtered.length})</h5>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 240 }}
                  />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={clearFilters}
                    className="d-flex align-items-center"
                    title="Clear search filter"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={fetchDepartments}
                    className="d-flex align-items-center"
                  >
                    <ArrowRepeat size={16} className="me-1" /> Refresh
                  </Button>
                </div>
              </div>

              <DataList
                data={filtered}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                exportFileName={`departments`}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DepartmentPage;
