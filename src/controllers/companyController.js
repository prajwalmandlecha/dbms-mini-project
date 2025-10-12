import { prisma } from "../utils/prisma.js";

export async function listCompanies(req, res) {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
}

export async function createCompany(req, res) {
  try {
    const { name, address, website } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: "Name and address are required" });
    }
    const company = await prisma.company.create({
      data: { name, address, website: website || null },
    });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "A company with this name already exists" });
    }
    res.status(400).json({ error: "Failed to create company" });
  }
}

export async function updateCompany(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const { name, address, website } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: "Name and address are required" });
    }
    const company = await prisma.company.update({
      where: { id },
      data: { name, address, website: website || null },
    });
    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "A company with this name already exists" });
    }
    res.status(400).json({ error: "Failed to update company" });
  }
}

export async function deleteCompany(req, res) {
  try {
    const id = parseInt(req.params?.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await prisma.company.delete({
      where: { id },
    });
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete company" });
  }
}
