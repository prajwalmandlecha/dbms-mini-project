import { prisma } from "../utils/prisma.js";

export async function listInternships(req, res) {
  try {
    const internships = await prisma.internship.findMany({
      include: { company: true, externalMentor: true, internalMentor: true },
    });
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch internships" });
  }
}

export async function createInternship(req, res) {
  try {
    const {
      title,
      description,
      academicYear,
      duration,
      mode,
      stipend,
      PPO,
      CompletionCertificate,
      Remarks,
      CompanyId,
      externalMentorId,
      internalMentorId,
    } = req.body;
    const internship = await prisma.internship.create({
      data: {
        title,
        description,
        academicYear,
        duration,
        mode,
        stipend,
        PPO: Boolean(PPO),
        CompletionCertificate,
        Remarks,
        CompanyId,
        externalMentorId,
        internalMentorId,
      },
    });
    res.status(201).json(internship);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create internship" });
  }
}

export async function enrollStudent(req, res) {
  try {
    const { studentId, internshipId } = req.body;
    const record = await prisma.studentInternship.create({
      data: { studentId, internshipId },
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: "Failed to enroll student" });
  }
}

export async function updateInternship(req, res) {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      description,
      academicYear,
      duration,
      mode,
      stipend,
      PPO,
      CompletionCertificate,
      Remarks,
      CompanyId,
      externalMentorId,
      internalMentorId,
    } = req.body;
    if (
      !title ||
      !description ||
      !academicYear ||
      !duration ||
      !mode ||
      !stipend ||
      !PPO ||
      !CompletionCertificate ||
      !Remarks ||
      !CompanyId ||
      !externalMentorId ||
      !internalMentorId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const internship = await prisma.internship.update({
      where: { id },
      data: {
        title,
        description,
        academicYear,
        duration,
        mode,
        stipend,
        PPO,
        CompletionCertificate,
        Remarks,
        CompanyId,
        externalMentorId,
        internalMentorId,
      },
    });
    res.status(200).json(internship);
  } catch (error) {
    res.status(400).json({ error: "Failed to update internship" });
  }
}
