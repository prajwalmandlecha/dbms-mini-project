import express from "express";
import {
  listCompanies,
  createCompany,
  updateCompany,
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", listCompanies);
router.post("/", createCompany);
router.put("/:id", updateCompany);

export default router;
