import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Tabs,
  Tab,
  Table,
  Form,
} from "react-bootstrap";
import { ArrowRepeat, CheckCircle, XCircle } from "react-bootstrap-icons";
import DataList from "../components/DataList";
import { InternalMentor, ExternalMentor } from "../types";
import { mentorService } from "../services/api";

const MentorPage: React.FC = () => {
  const [internalMentors, setInternalMentors] = useState<InternalMentor[]>([]);
  const [externalMentors, setExternalMentors] = useState<ExternalMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorType, setMentorType] = useState<"internal" | "external">(
    "internal"
  );
  const [search, setSearch] = useState<string>("");

  const clearFilters = () => {
    setSearch("");
  };

  // Quick Add State - Always visible
  const [quickAddData, setQuickAddData] = useState<
    Omit<InternalMentor & ExternalMentor, "id">
  >({
    name: "",
    email: "",
    mobileNo: "",
  });
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [editingMentor, setEditingMentor] = useState<{
    id: number;
    type: "internal" | "external";
  } | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const [internalResponse, externalResponse] = await Promise.all([
        mentorService.getAllInternal(),
        mentorService.getAllExternal(),
      ]);
      setInternalMentors(internalResponse.data);
      setExternalMentors(externalResponse.data);
      setError(null);
    } catch (err) {
      setError("Failed to load mentors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    mentor: InternalMentor | ExternalMentor,
    type: "internal" | "external"
  ) => {
    const name = mentor.name;
    if (window.confirm(`Are you sure you want to delete mentor "${name}"?`)) {
      try {
        if (type === "internal") {
          await mentorService.deleteInternal(mentor.id as number);
          setInternalMentors(internalMentors.filter((m) => m.id !== mentor.id));
        } else {
          await mentorService.deleteExternal(mentor.id as number);
          setExternalMentors(externalMentors.filter((m) => m.id !== mentor.id));
        }
      } catch (err) {
        setError("Failed to delete mentor");
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

  const handleEdit = (
    mentor: InternalMentor | ExternalMentor,
    type: "internal" | "external"
  ) => {
    setQuickAddData({
      name: mentor.name,
      email: mentor.email,
      mobileNo: mentor.mobileNo,
    });
    setMentorType(type);
    setEditingMentor({ id: mentor.id as number, type });
    setQuickAddError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingMentor(null);
    resetQuickAdd();
  };

  const handleQuickAdd = async () => {
    if (!quickAddData.name || !quickAddData.email || !quickAddData.mobileNo) {
      setQuickAddError("Please fill all required fields");
      return;
    }

    try {
      if (editingMentor) {
        if (editingMentor.type === "internal") {
          await mentorService.updateInternal(editingMentor.id, quickAddData);
        } else {
          await mentorService.updateExternal(editingMentor.id, quickAddData);
        }
        await fetchMentors();
        handleCancelEdit();
      } else if (mentorType === "internal") {
        const response = await mentorService.createInternal(quickAddData);
        setInternalMentors([...internalMentors, response.data]);
        setQuickAddData({ name: "", email: "", mobileNo: "" });
      } else {
        const response = await mentorService.createExternal(quickAddData);
        setExternalMentors([...externalMentors, response.data]);
        setQuickAddData({ name: "", email: "", mobileNo: "" });
      }

      setQuickAddError(null);

      if (!editingMentor) {
        const firstInput =
          document.querySelector<HTMLInputElement>('input[name="name"]');
        if (firstInput) firstInput.focus();
      }
    } catch (err) {
      setQuickAddError(
        editingMentor ? "Failed to update mentor" : "Failed to add mentor"
      );
      console.error(err);
    }
  };

  const resetQuickAdd = () => {
    setQuickAddData({ name: "", email: "", mobileNo: "" });
    setQuickAddError(null);
  };

  const columns: {
    key: keyof (InternalMentor | ExternalMentor);
    label: string;
  }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "mobileNo", label: "Mobile No" },
  ];

  const filterMentors = <
    T extends { id: number; name: string; email: string; mobileNo: string }
  >(
    list: T[]
  ) => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        String(m.id).includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.mobileNo.toLowerCase().includes(q)
    );
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Mentor Management</h1>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="mb-4 border-primary">
            <Card.Header
              className={`${
                editingMentor ? "bg-info" : "bg-primary"
              } text-white d-flex justify-content-between align-items-center`}
            >
              <span>
                <strong>
                  {editingMentor ? "Edit" : "Add"}{" "}
                  {mentorType === "internal" ? "Internal" : "External"} Mentor
                </strong>{" "}
                - Fill all fields and press Enter or click{" "}
                {editingMentor ? "Update" : "Add"}
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={
                    mentorType === "internal" ? "light" : "outline-light"
                  }
                  onClick={() => setMentorType("internal")}
                  disabled={!!editingMentor}
                >
                  Internal
                </Button>
                <Button
                  size="sm"
                  variant={
                    mentorType === "external" ? "light" : "outline-light"
                  }
                  onClick={() => setMentorType("external")}
                  disabled={!!editingMentor}
                >
                  External
                </Button>
              </div>
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
                    <th style={{ width: "30%" }}>Name *</th>
                    <th style={{ width: "30%" }}>Email *</th>
                    <th style={{ width: "25%" }}>Mobile No *</th>
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
                        placeholder="Dr. John Doe"
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
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant={editingMentor ? "primary" : "success"}
                          onClick={handleQuickAdd}
                          title={
                            editingMentor
                              ? "Update mentor"
                              : "Add (or press Enter)"
                          }
                        >
                          <CheckCircle size={16} />
                        </Button>
                        {editingMentor ? (
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
                <strong>Tip:</strong> Toggle between Internal and External
                mentor types using the buttons above. Press <kbd>Enter</kbd> in
                any field to quickly add.
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search mentors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 260 }}
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
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={fetchMentors}
                  className="d-flex align-items-center"
                >
                  <ArrowRepeat size={16} className="me-1" /> Refresh
                </Button>
              </div>

              <Tabs
                defaultActiveKey="internal"
                id="mentor-tabs"
                className="mb-4"
                onSelect={(key) =>
                  setMentorType(key as "internal" | "external")
                }
              >
                <Tab
                  eventKey="internal"
                  title={`Internal Mentors (${
                    filterMentors(internalMentors).length
                  })`}
                >
                  <DataList
                    data={filterMentors(internalMentors)}
                    columns={columns}
                    onEdit={(mentor) => handleEdit(mentor, "internal")}
                    onDelete={(mentor) => handleDelete(mentor, "internal")}
                    loading={loading}
                    exportFileName={`internal-mentors`}
                  />
                </Tab>
                <Tab
                  eventKey="external"
                  title={`External Mentors (${
                    filterMentors(externalMentors).length
                  })`}
                >
                  <DataList
                    data={filterMentors(externalMentors)}
                    columns={columns}
                    onEdit={(mentor) => handleEdit(mentor, "external")}
                    onDelete={(mentor) => handleDelete(mentor, "external")}
                    loading={loading}
                    exportFileName={`external-mentors`}
                  />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MentorPage;
