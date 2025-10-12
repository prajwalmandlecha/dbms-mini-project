import { prisma } from "../utils/prisma.js";

export async function listDepartments(req, res) {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
}

export async function createDepartment(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Department name is required" });
    }
    const department = await prisma.department.create({
      data: { name: name.trim() },
    });
    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "A department with this name already exists" });
    }
    res.status(400).json({ error: "Failed to create department" });
  }
}

export async function updateDepartment(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const department = await prisma.department.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update department" });
  }
}

export async function deleteDepartment(req, res) {
  try {
    const id = parseInt(req.params?.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await prisma.department.delete({
      where: { id },
    });
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete department" });
  }
}
