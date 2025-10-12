import express from "express";
import {
  listInternships,
  createInternship,
  enrollStudent,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipController.js";

const router = express.Router();

router.get("/", listInternships);
router.post("/", createInternship);
router.post("/enroll", enrollStudent);
router.put("/:id", updateInternship);
router.delete("/:id", deleteInternship);

export default router;
