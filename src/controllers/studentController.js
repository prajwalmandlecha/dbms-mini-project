import { prisma } from "../utils/prisma.js";

export async function listStudents(req, res) {
  try {
    const students = await prisma.student.findMany({
      include: { department: true },
    });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
}

export async function createStudent(req, res) {
  try {
    const { rollno, name, year, div, mobileNo, email, departmentId } = req.body;
    const student = await prisma.student.create({
      data: { rollno, name, year, div, mobileNo, email, departmentId },
    });
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create student" });
  }
}

export async function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.id);

    const { rollno, name, year, div, mobileNo, email, departmentId } = req.body;
    if (
      !rollno ||
      !name ||
      !year ||
      !div ||
      !mobileNo ||
      !email ||
      !departmentId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const student = await prisma.student.update({
      where: { id },
      data: { rollno, name, year, div, mobileNo, email, departmentId },
    });
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update student" });
  }
}
