import { prisma } from "../utils/prisma.js";

export async function listInternships(req, res) {
  try {
    const internships = await prisma.internship.findMany({
      include: {
        company: true,
        externalMentor: true,
        internalMentor: true,
        students: {
          include: {
            student: true,
          },
        },
      },
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
    const parsedDuration = parseInt(duration);
    const parsedStipend = parseFloat(stipend);
    const parsedCompanyId = parseInt(CompanyId);
    const parsedExternalMentorId = parseInt(externalMentorId);
    const parsedInternalMentorId = parseInt(internalMentorId);
    const normalizedPPO =
      typeof PPO === "string" ? PPO.toLowerCase() === "true" : Boolean(PPO);

    if (
      !title ||
      !description ||
      !academicYear ||
      Number.isNaN(parsedDuration) ||
      !mode ||
      Number.isNaN(parsedStipend) ||
      !CompletionCertificate ||
      Number.isNaN(parsedCompanyId) ||
      Number.isNaN(parsedExternalMentorId) ||
      Number.isNaN(parsedInternalMentorId)
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields" });
    }
    const internship = await prisma.internship.create({
      data: {
        title,
        description,
        academicYear,
        duration: parsedDuration,
        mode,
        stipend: parsedStipend,
        PPO: normalizedPPO,
        CompletionCertificate,
        Remarks,
        CompanyId: parsedCompanyId,
        externalMentorId: parsedExternalMentorId,
        internalMentorId: parsedInternalMentorId,
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
    const studentId = parseInt(req.body.studentId);
    const internshipId = parseInt(req.body.internshipId);
    if (Number.isNaN(studentId) || Number.isNaN(internshipId)) {
      return res
        .status(400)
        .json({ error: "Invalid studentId or internshipId" });
    }
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
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
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
    const parsedDuration = parseInt(duration);
    const parsedStipend = parseFloat(stipend);
    const parsedCompanyId = parseInt(CompanyId);
    const parsedExternalMentorId = parseInt(externalMentorId);
    const parsedInternalMentorId = parseInt(internalMentorId);

    if (
      !title ||
      !description ||
      !academicYear ||
      Number.isNaN(parsedDuration) ||
      !mode ||
      Number.isNaN(parsedStipend) ||
      !CompletionCertificate ||
      Number.isNaN(parsedCompanyId) ||
      Number.isNaN(parsedExternalMentorId) ||
      Number.isNaN(parsedInternalMentorId)
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields" });
    }

    const updateData = {
      title,
      description,
      academicYear,
      duration: parsedDuration,
      mode,
      stipend: parsedStipend,
      CompletionCertificate,
      CompanyId: parsedCompanyId,
      externalMentorId: parsedExternalMentorId,
      internalMentorId: parsedInternalMentorId,
    };

    if (typeof PPO !== "undefined") {
      updateData.PPO =
        typeof PPO === "string" ? PPO.toLowerCase() === "true" : Boolean(PPO);
    }
    if (typeof Remarks !== "undefined") {
      updateData.Remarks = Remarks;
    }
    const internship = await prisma.internship.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(internship);
  } catch (error) {
    res.status(400).json({ error: "Failed to update internship" });
  }
}

export async function deleteInternship(req, res) {
  try {
    const id = parseInt(req.params?.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    // remove student-internship links first to satisfy FK constraints
    await prisma.studentInternship.deleteMany({ where: { internshipId: id } });

    await prisma.internship.delete({
      where: { id },
    });
    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete internship" });
  }
}
