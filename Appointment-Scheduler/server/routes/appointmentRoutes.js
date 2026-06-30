import express from "express";

import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAppointment);

router.get("/", protect, getAppointments);

router.put("/:id", protect, updateAppointment);

router.delete("/:id", protect, deleteAppointment);

export default router;