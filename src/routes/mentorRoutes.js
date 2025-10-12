import express from "express";
import {
  listInternalMentors,
  createInternalMentor,
  listExternalMentors,
  createExternalMentor,
  updateInternalMentor,
  updateExternalMentor,
  deleteInternalMentor,
  deleteExternalMentor,
} from "../controllers/mentorController.js";

const router = express.Router();

router.get("/internal", listInternalMentors);
router.post("/internal", createInternalMentor);
router.put("/internal/:id", updateInternalMentor);
router.delete("/internal/:id", deleteInternalMentor);

router.get("/external", listExternalMentors);
router.post("/external", createExternalMentor);
router.put("/external/:id", updateExternalMentor);
router.delete("/external/:id", deleteExternalMentor);

export default router;
