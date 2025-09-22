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
    if (!name || !address || !website) {
      return res
        .status(400)
        .json({ error: "Name, address, and website are required" });
    }
    const company = await prisma.company.create({
      data: { name, address, website },
    });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
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
    if (!name || !address || !website) {
      return res
        .status(400)
        .json({ error: "Name, address, and website are required" });
    }
    const company = await prisma.company.update({
      where: { id },
      data: { name, address, website },
    });
    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update company" });
  }
}
