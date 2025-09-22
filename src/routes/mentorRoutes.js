import express from "express";
import {
  listInternalMentors,
  createInternalMentor,
  listExternalMentors,
  createExternalMentor,
  updateInternalMentor,
  updateExternalMentor,
} from "../controllers/mentorController.js";

const router = express.Router();

router.get("/internal", listInternalMentors);
router.post("/internal", createInternalMentor);
router.get("/external", listExternalMentors);
router.post("/external", createExternalMentor);
router.put("/internal/:id", updateInternalMentor);
router.put("/external/:id", updateExternalMentor);

export default router;
