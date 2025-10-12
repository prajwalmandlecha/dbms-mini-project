import { prisma } from "../utils/prisma.js";

export async function listInternalMentors(req, res) {
  try {
    const mentors = await prisma.internalMentor.findMany();
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch internal mentors" });
  }
}

export async function createInternalMentor(req, res) {
  try {
    const { name, email, mobileNo } = req.body;
    const mentor = await prisma.internalMentor.create({
      data: { name, email, mobileNo },
    });
    res.status(201).json(mentor);
  } catch (error) {
    res.status(400).json({ error: "Failed to create internal mentor" });
  }
}

export async function listExternalMentors(req, res) {
  try {
    const mentors = await prisma.externalMentor.findMany();
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch external mentors" });
  }
}

export async function createExternalMentor(req, res) {
  try {
    const { name, email, mobileNo } = req.body;
    const mentor = await prisma.externalMentor.create({
      data: { name, email, mobileNo },
    });
    res.status(201).json(mentor);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create external mentor" });
  }
}

export async function updateInternalMentor(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const { name, email, mobileNo } = req.body;
    if (!name || !email || !mobileNo) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const mentor = await prisma.internalMentor.update({
      where: { id },
      data: { name, email, mobileNo },
    });
    res.status(200).json(mentor);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update internal mentor" });
  }
}

export async function updateExternalMentor(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const { name, email, mobileNo } = req.body;
    if (!name || !email || !mobileNo) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const mentor = await prisma.externalMentor.update({
      where: { id },
      data: { name, email, mobileNo },
    });
    res.status(200).json(mentor);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update external mentor" });
  }
}

export async function deleteInternalMentor(req, res) {
  try {
    const id = parseInt(req.params?.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await prisma.internalMentor.delete({
      where: { id },
    });
    res.status(200).json({ message: "Internal mentor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete internal mentor" });
  }
}

export async function deleteExternalMentor(req, res) {
  try {
    const id = parseInt(req.params?.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await prisma.externalMentor.delete({
      where: { id },
    });
    res.status(200).json({ message: "External mentor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete external mentor" });
  }
}
