import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllAppointments,
  deleteUser,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.get("/appointments", protect, admin, getAllAppointments);

export default router;