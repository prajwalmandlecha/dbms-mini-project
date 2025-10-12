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
import { Company } from "../types";
import { companyService } from "../services/api";

const CompanyPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Add State - Always visible
  const [quickAddData, setQuickAddData] = useState<Omit<Company, "id">>({
    name: "",
    address: "",
    website: "",
  });
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load companies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (company: Company) => {
    if (
      window.confirm(
        `Are you sure you want to delete company "${company.name}"?`
      )
    ) {
      try {
        await companyService.delete(company.id);
        setCompanies(companies.filter((c) => c.id !== company.id));
      } catch (err) {
        setError("Failed to delete company");
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

  const handleEdit = (company: Company) => {
    setQuickAddData({
      name: company.name,
      address: company.address,
      website: company.website,
    });
    setEditingId(company.id);
    setQuickAddError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetQuickAdd();
  };

  const handleQuickAdd = async () => {
    if (!quickAddData.name || !quickAddData.address) {
      setQuickAddError("Please fill Name and Address");
      return;
    }

    try {
      if (editingId) {
        await companyService.update(editingId, quickAddData);
        await fetchCompanies();
        handleCancelEdit();
      } else {
        await companyService.create(quickAddData);
        await fetchCompanies(); // Refresh the list to ensure consistency
        setQuickAddData({ name: "", address: "", website: "" });

        // Auto-focus first field
        const firstInput =
          document.querySelector<HTMLInputElement>('input[name="name"]');
        if (firstInput) firstInput.focus();
      }
      setQuickAddError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        (editingId ? "Failed to update company" : "Failed to add company");
      setQuickAddError(errorMessage);
      console.error(err);
    }
  };

  const resetQuickAdd = () => {
    setQuickAddData({ name: "", address: "", website: "" });
    setQuickAddError(null);
  };

  const columns: { key: keyof Company; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "website", label: "Website" },
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Company Management</h1>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="mb-4 border-primary">
            <Card.Header
              className={
                editingId ? "bg-info text-white" : "bg-primary text-white"
              }
            >
              <strong>
                {editingId ? "✏️ Edit Company" : "⚡ Add Company"}
              </strong>{" "}
              - Fill all fields and press Enter or click{" "}
              {editingId ? "Update" : "Add"}
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
                    <th style={{ width: "25%" }}>Company Name *</th>
                    <th style={{ width: "35%" }}>Address *</th>
                    <th style={{ width: "30%" }}>Website</th>
                    <th style={{ width: "10%" }}>Action</th>
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
                        placeholder="ABC Corp"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="address"
                        value={quickAddData.address}
                        onChange={handleQuickAddChange}
                        placeholder="123 Business St, City"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="url"
                        name="website"
                        value={quickAddData.website}
                        onChange={handleQuickAddChange}
                        placeholder="https://example.com"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleQuickAdd()
                        }
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
                              ? "Update company"
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
                <strong>Tip:</strong> Press <kbd>Enter</kbd> in any field to
                quickly add the company.
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">All Companies ({companies.length})</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={fetchCompanies}
                  className="d-flex align-items-center"
                >
                  <ArrowRepeat size={16} className="me-1" /> Refresh
                </Button>
              </div>

              <DataList
                data={companies}
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

export default CompanyPage;
