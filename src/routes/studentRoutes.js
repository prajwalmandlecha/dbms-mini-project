import express from "express";
import {
  listStudents,
  createStudent,
  updateStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", listStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);

export default router;
