import express from "express";
import {
  listDepartments,
  createDepartment,
  updateDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.get("/", listDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);

export default router;
