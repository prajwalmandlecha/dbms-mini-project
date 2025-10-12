import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form,
  Table,
} from "react-bootstrap";
import { ArrowRepeat, CheckCircle, XCircle } from "react-bootstrap-icons";
import Select from "react-select";
import DataList from "../components/DataList";
import {
  Internship,
  Company,
  InternalMentor,
  ExternalMentor,
  Student,
} from "../types";
import {
  internshipService,
  companyService,
  mentorService,
  studentService,
} from "../services/api";

const InternshipPage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [internalMentors, setInternalMentors] = useState<InternalMentor[]>([]);
  const [externalMentors, setExternalMentors] = useState<ExternalMentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Add State - Always visible with ALL fields INCLUDING student
  const [quickAddData, setQuickAddData] = useState<
    Omit<
      Internship,
      "id" | "company" | "externalMentor" | "internalMentor" | "students"
    > & { studentId: number }
  >({
    title: "",
    description: "",
    academicYear: "YEAR_2024_25",
    duration: 2,
    mode: "REMOTE",
    stipend: 0,
    PPO: false,
    CompletionCertificate: "",
    Remarks: "",
    CompanyId: 0,
    externalMentorId: 0,
    internalMentorId: 0,
    studentId: 0, // Student is required for every internship record
  });
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        internshipsResponse,
        companiesResponse,
        internalMentorsResponse,
        externalMentorsResponse,
        studentsResponse,
      ] = await Promise.all([
        internshipService.getAll(),
        companyService.getAll(),
        mentorService.getAllInternal(),
        mentorService.getAllExternal(),
        studentService.getAll(),
      ]);
      setInternships(internshipsResponse.data);
      setCompanies(companiesResponse.data);
      setInternalMentors(internalMentorsResponse.data);
      setExternalMentors(externalMentorsResponse.data);
      setStudents(studentsResponse.data);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (internship: Internship) => {
    if (
      window.confirm(
        `Are you sure you want to delete internship "${internship.title}"?`
      )
    ) {
      try {
        await internshipService.delete(internship.id);
        setInternships(internships.filter((i) => i.id !== internship.id));
      } catch (err) {
        setError("Failed to delete internship");
        console.error(err);
      }
    }
  };

  const handleEdit = (internship: Internship) => {
    // Find the student from the internship's students array
    const studentId =
      internship.students && internship.students.length > 0
        ? (internship.students[0] as any).student.id
        : 0;

    setQuickAddData({
      title: internship.title,
      description: internship.description,
      academicYear: internship.academicYear,
      duration: internship.duration,
      mode: internship.mode,
      stipend: internship.stipend,
      PPO: internship.PPO,
      CompletionCertificate: internship.CompletionCertificate,
      Remarks: internship.Remarks || "",
      CompanyId: internship.CompanyId,
      externalMentorId: internship.externalMentorId || 0,
      internalMentorId: internship.internalMentorId || 0,
      studentId: studentId,
    });
    setEditingId(internship.id);
    setQuickAddError(null);

    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setQuickAddData({
      title: "",
      description: "",
      academicYear: "YEAR_2024_25",
      duration: 2,
      mode: "REMOTE",
      stipend: 0,
      PPO: false,
      CompletionCertificate: "",
      Remarks: "",
      CompanyId: 0,
      externalMentorId: 0,
      internalMentorId: 0,
      studentId: 0,
    });
    setQuickAddError(null);
  };

  // Quick Add Handlers
  const handleQuickAddChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setQuickAddData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "duration" || name === "stipend"
          ? parseFloat(value)
          : name === "CompanyId" ||
            name === "externalMentorId" ||
            name === "internalMentorId" ||
            name === "studentId"
          ? parseInt(value, 10)
          : value,
    }));
    setQuickAddError(null);
  };

  const handleQuickAdd = async () => {
    if (
      !quickAddData.title ||
      !quickAddData.CompanyId ||
      !quickAddData.studentId
    ) {
      setQuickAddError("Please fill Title, Company, and Student");
      return;
    }

    try {
      if (editingId) {
        // Update existing internship
        const { studentId, ...internshipData } = quickAddData;
        await internshipService.update(editingId, internshipData);

        // Note: Student enrollment update would require additional backend support
        // For now, we only update the internship data

        await fetchAllData();
        handleCancelEdit();
      } else {
        // Create new internship
        const { studentId, ...internshipData } = quickAddData;
        const response = await internshipService.create(internshipData);

        // Automatically enroll the student
        await internshipService.enrollStudent({
          studentId: studentId,
          internshipId: response.data.id,
        });

        // Refresh to show updated data with enrolled student
        await fetchAllData();

        // Reset but keep company, academic year, and mode for faster bulk entry
        setQuickAddData((prev) => ({
          title: "",
          description: "",
          academicYear: prev.academicYear,
          duration: prev.duration,
          mode: prev.mode,
          stipend: 0,
          PPO: false,
          CompletionCertificate: "",
          Remarks: "",
          CompanyId: prev.CompanyId,
          externalMentorId: prev.externalMentorId,
          internalMentorId: prev.internalMentorId,
          studentId: 0, // Reset student for next entry
        }));

        // Auto-focus first field
        const firstInput = document.querySelector<HTMLInputElement>(
          'input[name="title"]'
        );
        if (firstInput) firstInput.focus();
      }
      setQuickAddError(null);
    } catch (err) {
      setQuickAddError(
        editingId ? "Failed to update internship" : "Failed to add internship"
      );
      console.error(err);
    }
  };

  const resetQuickAdd = () => {
    setQuickAddData({
      title: "",
      description: "",
      academicYear: "YEAR_2024_25",
      duration: 2,
      mode: "REMOTE",
      stipend: 0,
      PPO: false,
      CompletionCertificate: "",
      Remarks: "",
      CompanyId: 0,
      externalMentorId: 0,
      internalMentorId: 0,
      studentId: 0,
    });
    setQuickAddError(null);
  };

  const columns: {
    key: keyof Internship;
    label: string;
    render?: (item: Internship) => React.ReactNode;
  }[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    {
      key: "students",
      label: "Student(s)",
      render: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          return internship.students
            .map((si: any) => `${si.student.name} (${si.student.rollno})`)
            .join(", ");
        }
        return "None";
      },
    },
    {
      key: "CompanyId",
      label: "Company",
      render: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.name : "N/A";
      },
    },
    { key: "description", label: "Description" },
    { key: "academicYear", label: "Academic Year" },
    { key: "duration", label: "Duration (months)" },
    { key: "mode", label: "Mode" },
    { key: "stipend", label: "Stipend" },
    {
      key: "PPO",
      label: "PPO",
      render: (internship: Internship) => (internship.PPO ? "Yes" : "No"),
    },
    { key: "CompletionCertificate", label: "Certificate" },
    {
      key: "internalMentorId",
      label: "Internal Mentor",
      render: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.name : "N/A";
      },
    },
    {
      key: "externalMentorId",
      label: "External Mentor",
      render: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.name : "N/A";
      },
    },
    { key: "Remarks", label: "Remarks" },
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Internship Management</h1>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="mb-4 border-warning">
            <Card.Header
              className={
                editingId ? "bg-info text-white" : "bg-warning text-dark"
              }
            >
              <strong>
                {editingId ? "✏️ Edit Internship" : "⚡ Add Internship"}
              </strong>{" "}
              - Fill all fields and submit
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
                    <th style={{ width: "20%" }}>Title *</th>
                    <th style={{ width: "25%" }}>Description *</th>
                    <th style={{ width: "12%" }}>Academic Year *</th>
                    <th style={{ width: "10%" }}>Duration *</th>
                    <th style={{ width: "10%" }}>Mode *</th>
                    <th style={{ width: "10%" }}>Stipend *</th>
                    <th style={{ width: "8%" }}>PPO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="title"
                        value={quickAddData.title}
                        onChange={handleQuickAddChange}
                        placeholder="Web Development"
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        as="textarea"
                        rows={2}
                        name="description"
                        value={quickAddData.description}
                        onChange={handleQuickAddChange}
                        placeholder="Description"
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        name="academicYear"
                        value={quickAddData.academicYear}
                        onChange={handleQuickAddChange}
                      >
                        <option value="YEAR_2023_24">2023-24</option>
                        <option value="YEAR_2024_25">2024-25</option>
                        <option value="YEAR_2025_26">2025-26</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        name="duration"
                        value={quickAddData.duration}
                        onChange={handleQuickAddChange}
                        placeholder="2"
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        name="mode"
                        value={quickAddData.mode}
                        onChange={handleQuickAddChange}
                      >
                        <option value="REMOTE">Remote</option>
                        <option value="ONSITE">Onsite</option>
                        <option value="PART_TIME">Part-time</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        name="stipend"
                        value={quickAddData.stipend}
                        onChange={handleQuickAddChange}
                        placeholder="0"
                      />
                    </td>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        name="PPO"
                        checked={quickAddData.PPO}
                        onChange={handleQuickAddChange}
                      />
                    </td>
                  </tr>
                </tbody>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "20%" }}>Student *</th>
                    <th style={{ width: "25%" }}>Company *</th>
                    <th style={{ width: "12%" }}>Certificate *</th>
                    <th colSpan={2} style={{ width: "20%" }}>
                      Internal Mentor *
                    </th>
                    <th colSpan={2} style={{ width: "20%" }}>
                      External Mentor *
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Select
                        options={students.map((student) => ({
                          value: student.id,
                          label: `${student.name} - ${student.rollno}`,
                        }))}
                        value={
                          quickAddData.studentId
                            ? {
                                value: quickAddData.studentId,
                                label: students.find(
                                  (s) => s.id === quickAddData.studentId
                                )
                                  ? `${
                                      students.find(
                                        (s) => s.id === quickAddData.studentId
                                      )!.name
                                    } - ${
                                      students.find(
                                        (s) => s.id === quickAddData.studentId
                                      )!.rollno
                                    }`
                                  : "Select student...",
                              }
                            : null
                        }
                        onChange={(option) => {
                          setQuickAddData({
                            ...quickAddData,
                            studentId: option?.value || 0,
                          });
                        }}
                        placeholder="Select student..."
                        isClearable
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "31px",
                            height: "31px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: "31px",
                            padding: "0 6px",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0px",
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "31px",
                          }),
                        }}
                      />
                    </td>
                    <td>
                      <Select
                        options={companies.map((company) => ({
                          value: company.id,
                          label: company.name,
                        }))}
                        value={
                          quickAddData.CompanyId
                            ? {
                                value: quickAddData.CompanyId,
                                label:
                                  companies.find(
                                    (c) => c.id === quickAddData.CompanyId
                                  )?.name || "Select company...",
                              }
                            : null
                        }
                        onChange={(option) => {
                          setQuickAddData({
                            ...quickAddData,
                            CompanyId: option?.value || 0,
                          });
                        }}
                        placeholder="Select company..."
                        isClearable
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "31px",
                            height: "31px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: "31px",
                            padding: "0 6px",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0px",
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "31px",
                          }),
                        }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="CompletionCertificate"
                        value={quickAddData.CompletionCertificate}
                        onChange={handleQuickAddChange}
                        placeholder="Certificate info"
                      />
                    </td>
                    <td colSpan={2}>
                      <Select
                        options={internalMentors.map((mentor) => ({
                          value: mentor.id,
                          label: mentor.name,
                        }))}
                        value={
                          quickAddData.internalMentorId
                            ? {
                                value: quickAddData.internalMentorId,
                                label:
                                  internalMentors.find(
                                    (m) =>
                                      m.id === quickAddData.internalMentorId
                                  )?.name || "None",
                              }
                            : null
                        }
                        onChange={(option) => {
                          setQuickAddData({
                            ...quickAddData,
                            internalMentorId: option?.value || 0,
                          });
                        }}
                        placeholder="None"
                        isClearable
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "31px",
                            height: "31px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: "31px",
                            padding: "0 6px",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0px",
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "31px",
                          }),
                        }}
                      />
                    </td>
                    <td colSpan={2}>
                      <Select
                        options={externalMentors.map((mentor) => ({
                          value: mentor.id,
                          label: mentor.name,
                        }))}
                        value={
                          quickAddData.externalMentorId
                            ? {
                                value: quickAddData.externalMentorId,
                                label:
                                  externalMentors.find(
                                    (m) =>
                                      m.id === quickAddData.externalMentorId
                                  )?.name || "None",
                              }
                            : null
                        }
                        onChange={(option) => {
                          setQuickAddData({
                            ...quickAddData,
                            externalMentorId: option?.value || 0,
                          });
                        }}
                        placeholder="None"
                        isClearable
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "31px",
                            height: "31px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: "31px",
                            padding: "0 6px",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0px",
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "31px",
                          }),
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
                <thead className="table-light">
                  <tr>
                    <th colSpan={7}>Remarks (Optional)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7}>
                      <Form.Control
                        size="sm"
                        as="textarea"
                        rows={2}
                        name="Remarks"
                        value={quickAddData.Remarks || ""}
                        onChange={handleQuickAddChange}
                        placeholder="Optional remarks (leave blank if not needed)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="text-center bg-light">
                      <div className="d-flex gap-2 justify-content-center py-2">
                        <Button
                          size="sm"
                          variant={editingId ? "primary" : "success"}
                          onClick={handleQuickAdd}
                          title={
                            editingId ? "Update internship" : "Add internship"
                          }
                        >
                          <CheckCircle size={16} className="me-1" />
                          {editingId ? "Update Internship" : "Add Internship"}
                        </Button>
                        {editingId ? (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={handleCancelEdit}
                            title="Cancel editing"
                          >
                            <XCircle size={16} className="me-1" />
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={resetQuickAdd}
                            title="Clear form"
                          >
                            <XCircle size={16} className="me-1" />
                            Clear
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="mt-2 text-muted small">
                <strong>Tip:</strong> Required fields marked with *. Remarks is
                optional and appears in the last row. Company, Mode, Duration,
                and Mentors stay selected after adding for faster bulk entry.
                Use your browser's find feature (Ctrl+F) within dropdowns to
                search for students/companies.
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">All Internships ({internships.length})</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={fetchAllData}
                  className="d-flex align-items-center"
                >
                  <ArrowRepeat size={16} className="me-1" /> Refresh
                </Button>
              </div>

              <DataList
                data={internships}
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

export default InternshipPage;
