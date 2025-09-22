import express from "express";
import departmentRoutes from "./routes/departmentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("DBMS Mini Project API");
});

app.use("/departments", departmentRoutes);
app.use("/companies", companyRoutes);
app.use("/mentors", mentorRoutes);
app.use("/students", studentRoutes);
app.use("/internships", internshipRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
