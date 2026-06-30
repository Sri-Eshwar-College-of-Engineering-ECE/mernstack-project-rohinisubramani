import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: "Pending" });
    const approved = await Appointment.countDocuments({ status: "Approved" });
    const completed = await Appointment.countDocuments({ status: "Completed" });
    const cancelled = await Appointment.countDocuments({ status: "Cancelled" });

    res.json({
      totalUsers,
      totalAppointments,
      pending,
      approved,
      completed,
      cancelled,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Users (Patients only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "patient" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin users cannot be deleted",
      });
    }

    // Delete user's appointments
    await Appointment.deleteMany({ patient: req.params.id });

    // Delete user
    await user.deleteOne();

    res.json({
      message: "User and associated appointments deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};