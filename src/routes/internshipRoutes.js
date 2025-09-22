import express from "express";
import {
  listInternships,
  createInternship,
  enrollStudent,
  updateInternship,
} from "../controllers/internshipController.js";

const router = express.Router();

router.get("/", listInternships);
router.post("/", createInternship);
router.post("/enroll", enrollStudent);
router.put("/:id", updateInternship);


export default router;
