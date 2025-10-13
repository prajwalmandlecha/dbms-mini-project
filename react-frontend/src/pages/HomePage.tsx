import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import { internshipService } from "../services/api";
import {
  Internship,
  Company,
  InternalMentor,
  ExternalMentor,
  Department,
} from "../types";
import DataList, { DataListColumn } from "../components/DataList";
import {
  companyService,
  mentorService,
  departmentService,
} from "../services/api";

const HomePage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [internalMentors, setInternalMentors] = useState<InternalMentor[]>([]);
  const [externalMentors, setExternalMentors] = useState<ExternalMentor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filterYear, setFilterYear] = useState<
    "YEAR_2023_24" | "YEAR_2024_25" | "YEAR_2025_26" | ""
  >("");
  const [filterCompany, setFilterCompany] = useState<number | "">("");
  const [filterMode, setFilterMode] = useState<
    "REMOTE" | "ONSITE" | "PART_TIME" | ""
  >("");
  const [filterPPO, setFilterPPO] = useState<"" | "YES" | "NO">("");
  const [filterMinStipend, setFilterMinStipend] = useState<string>("");

  const clearFilters = () => {
    setSearch("");
    setFilterYear("");
    setFilterCompany("");
    setFilterMode("");
    setFilterPPO("");
    setFilterMinStipend("");
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [internRes, compsRes, intMentRes, extMentRes, deptsRes] =
        await Promise.all([
          internshipService.getAll(),
          companyService.getAll(),
          mentorService.getAllInternal(),
          mentorService.getAllExternal(),
          departmentService.getAll(),
        ]);
      setInternships(internRes.data);
      setCompanies(compsRes.data);
      setInternalMentors(intMentRes.data);
      setExternalMentors(extMentRes.data);
      setDepartments(deptsRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load internships");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: DataListColumn<Internship>[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    {
      key: "description",
      label: "Description",
    },
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
      exportValue: (internship: Internship) =>
        internship.students && internship.students.length > 0
          ? internship.students
              .map((si: any) => `${si.student.name} (${si.student.rollno})`)
              .join(", ")
          : "",
    },
    {
      key: "students",
      label: "Student Year",
      render: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          return internship.students
            .map((si: any) => si.student.year)
            .join(", ");
        }
        return "-";
      },
      exportValue: (internship: Internship) =>
        internship.students && internship.students.length > 0
          ? internship.students.map((si: any) => si.student.year).join(", ")
          : "",
    },
    {
      key: "students",
      label: "Student Div",
      render: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          return internship.students
            .map((si: any) => si.student.div)
            .join(", ");
        }
        return "-";
      },
      exportValue: (internship: Internship) =>
        internship.students && internship.students.length > 0
          ? internship.students.map((si: any) => si.student.div).join(", ")
          : "",
    },
    {
      key: "students",
      label: "Student Department",
      render: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          return internship.students
            .map((si: any) => {
              const deptName =
                si.student.department?.name ||
                departments.find((d) => d.id === si.student.departmentId)?.name;
              return deptName || "";
            })
            .join(", ");
        }
        return "-";
      },
      exportValue: (internship: Internship) =>
        internship.students && internship.students.length > 0
          ? internship.students
              .map((si: any) => {
                const deptName =
                  si.student.department?.name ||
                  departments.find((d) => d.id === si.student.departmentId)
                    ?.name;
                return deptName || "";
              })
              .join(", ")
          : "",
      sortAccessor: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          const first = internship.students[0] as any;
          const deptName =
            first.student.department?.name ||
            departments.find((d) => d.id === first.student.departmentId)?.name;
          return deptName || "";
        }
        return "";
      },
    },
    {
      key: "students",
      label: "Student Email",
      render: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          return internship.students
            .map((si: any) => si.student.email)
            .join(", ");
        }
        return "-";
      },
      exportValue: (internship: Internship) =>
        internship.students && internship.students.length > 0
          ? internship.students.map((si: any) => si.student.email).join(", ")
          : "",
    },
    {
      key: "students",
      label: "Student Mobile",
      render: (internship: Internship) => {
        if (internship.students && internship.students.length > 0) {
          return internship.students
            .map((si: any) => si.student.mobileNo)
            .join(", ");
        }
        return "-";
      },
      exportValue: (internship: Internship) =>
        internship.students && internship.students.length > 0
          ? internship.students.map((si: any) => si.student.mobileNo).join(", ")
          : "",
    },
    {
      key: "CompanyId",
      label: "Company",
      render: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.name : "N/A";
      },
      exportValue: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.name : "";
      },
      sortAccessor: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.name : "";
      },
    },
    {
      key: "CompanyId",
      label: "Company Address",
      render: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.address : "-";
      },
      exportValue: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.address : "";
      },
    },
    {
      key: "CompanyId",
      label: "Company Website",
      render: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.website || "-" : "-";
      },
      exportValue: (internship: Internship) => {
        const company = companies.find((c) => c.id === internship.CompanyId);
        return company ? company.website || "" : "";
      },
    },
    { key: "academicYear", label: "Academic Year" },
    { key: "duration", label: "Duration (months)" },
    { key: "mode", label: "Mode" },
    { key: "stipend", label: "Stipend" },
    {
      key: "PPO",
      label: "PPO",
      render: (internship: Internship) => (internship.PPO ? "Yes" : "No"),
      exportValue: (internship: Internship) => (internship.PPO ? "Yes" : "No"),
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
      exportValue: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.name : "";
      },
      sortAccessor: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.name : "";
      },
    },
    {
      key: "internalMentorId",
      label: "Internal Mentor Email",
      render: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.email : "-";
      },
      exportValue: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.email : "";
      },
    },
    {
      key: "internalMentorId",
      label: "Internal Mentor Mobile",
      render: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.mobileNo : "-";
      },
      exportValue: (internship: Internship) => {
        const mentor = internalMentors.find(
          (m) => m.id === internship.internalMentorId
        );
        return mentor ? mentor.mobileNo : "";
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
      exportValue: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.name : "";
      },
      sortAccessor: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.name : "";
      },
    },
    {
      key: "externalMentorId",
      label: "External Mentor Email",
      render: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.email : "-";
      },
      exportValue: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.email : "";
      },
    },
    {
      key: "externalMentorId",
      label: "External Mentor Mobile",
      render: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.mobileNo : "-";
      },
      exportValue: (internship: Internship) => {
        const mentor = externalMentors.find(
          (m) => m.id === internship.externalMentorId
        );
        return mentor ? mentor.mobileNo : "";
      },
    },
    { key: "Remarks", label: "Remarks" },
  ];

  const filtered = internships.filter((i) => {
    const q = search.trim().toLowerCase();
    const comp =
      companies.find((c) => c.id === i.CompanyId)?.name?.toLowerCase() || "";
    const compAddr =
      companies.find((c) => c.id === i.CompanyId)?.address?.toLowerCase() || "";
    const intMent =
      internalMentors
        .find((m) => m.id === i.internalMentorId)
        ?.name?.toLowerCase() || "";
    const extMent =
      externalMentors
        .find((m) => m.id === i.externalMentorId)
        ?.name?.toLowerCase() || "";
    const studentsText = (i.students || [])
      .map((si: any) => {
        const deptName =
          si.student.department?.name ||
          departments.find((d) => d.id === si.student.departmentId)?.name ||
          "";
        return `${si.student.name} (${si.student.rollno}) ${si.student.year} ${si.student.div} ${deptName} ${si.student.email} ${si.student.mobileNo}`;
      })
      .join(", ")
      .toLowerCase();

    const studentEmails = (i.students || [])
      .map((si: any) => si.student.email)
      .join(", ")
      .toLowerCase();
    const studentMobiles = (i.students || [])
      .map((si: any) => si.student.mobileNo)
      .join(", ")
      .toLowerCase();

    const intMentEmail =
      internalMentors
        .find((m) => m.id === i.internalMentorId)
        ?.email?.toLowerCase() || "";
    const intMentMobile =
      internalMentors
        .find((m) => m.id === i.internalMentorId)
        ?.mobileNo?.toLowerCase() || "";
    const extMentEmail =
      externalMentors
        .find((m) => m.id === i.externalMentorId)
        ?.email?.toLowerCase() || "";
    const extMentMobile =
      externalMentors
        .find((m) => m.id === i.externalMentorId)
        ?.mobileNo?.toLowerCase() || "";

    if (q) {
      const hit =
        String(i.id).includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.academicYear.toLowerCase().includes(q) ||
        String(i.duration).includes(q) ||
        i.mode.toLowerCase().includes(q) ||
        String(i.stipend).includes(q) ||
        (i.PPO ? "yes" : "no").includes(q) ||
        (i.CompletionCertificate || "").toLowerCase().includes(q) ||
        (i.Remarks || "").toLowerCase().includes(q) ||
        comp.includes(q) ||
        compAddr.includes(q) ||
        intMent.includes(q) ||
        extMent.includes(q) ||
        studentsText.includes(q) ||
        studentEmails.includes(q) ||
        studentMobiles.includes(q) ||
        intMentEmail.includes(q) ||
        intMentMobile.includes(q) ||
        extMentEmail.includes(q) ||
        extMentMobile.includes(q);
      if (!hit) return false;
    }
    if (filterYear && i.academicYear !== filterYear) return false;
    if (filterCompany && i.CompanyId !== filterCompany) return false;
    if (filterMode && i.mode !== filterMode) return false;
    if (filterPPO && (filterPPO === "YES") !== !!i.PPO) return false;
    if (filterMinStipend) {
      const min = Number(filterMinStipend);
      if (!Number.isNaN(min) && i.stipend < min) return false;
    }
    return true;
  });

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
              onClick={fetchAll}
              className="d-flex align-items-center"
            >
              <ArrowRepeat size={16} className="me-1" /> Refresh
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">All Internships ({filtered.length})</h5>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 200 }}
                  />
                  <Form.Select
                    size="sm"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value as any)}
                    style={{ maxWidth: 140 }}
                  >
                    <option value="">All Years</option>
                    <option value="YEAR_2023_24">2023-24</option>
                    <option value="YEAR_2024_25">2024-25</option>
                    <option value="YEAR_2025_26">2025-26</option>
                  </Form.Select>
                  <Form.Select
                    size="sm"
                    value={filterCompany}
                    onChange={(e) =>
                      setFilterCompany(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    style={{ maxWidth: 200 }}
                  >
                    <option value="">All Companies</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    size="sm"
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value as any)}
                    style={{ maxWidth: 140 }}
                  >
                    <option value="">All Modes</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="PART_TIME">Part-time</option>
                  </Form.Select>
                  <Form.Select
                    size="sm"
                    value={filterPPO}
                    onChange={(e) => setFilterPPO(e.target.value as any)}
                    style={{ maxWidth: 120 }}
                  >
                    <option value="">PPO: Any</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </Form.Select>
                  <Form.Control
                    size="sm"
                    type="number"
                    placeholder="Min stipend"
                    value={filterMinStipend}
                    onChange={(e) => setFilterMinStipend(e.target.value)}
                    style={{ maxWidth: 140 }}
                  />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={clearFilters}
                    className="d-flex align-items-center"
                    title="Clear all filters"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              <DataList
                data={filtered}
                columns={columns}
                loading={loading}
                exportFileName={`home-internships`}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
