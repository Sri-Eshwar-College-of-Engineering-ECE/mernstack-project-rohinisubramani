import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, appointmentTime, reason } = req.body;

    if (!doctor || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        message: "Please fill in all required fields (doctor, date, time, reason)",
      });
    }

    // Check if the time slot is already booked (Pending or Approved)
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      appointmentTime,
      status: { $in: ["Pending", "Approved"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked for this doctor.",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      status: "Pending", // Starts as Pending
    });

    // Notify all admins of the new booking
    const admins = await User.find({ role: "admin" });
    for (const adminUser of admins) {
      await Notification.create({
        user: adminUser._id,
        title: "New Appointment Booked",
        message: `A new appointment has been booked by ${req.user.name} for ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}.`,
      });
    }

    res.status(201).json({
      message: "Appointment booked successfully.",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged-in User Appointments (or All for Admin)
export const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query = { patient: req.user._id };
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone")
      .sort({ appointmentDate: 1 });

    res.json(appointments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Appointment (Admin or Owner Patient)
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Role-based Access check: patient must be owner, admin can access all
    const isAdmin = req.user.role === "admin";
    const isOwner = appointment.patient.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Access denied: Not authorized to update this appointment",
      });
    }

    const oldStatus = appointment.status;

    // Allow modification
    appointment.doctor = req.body.doctor || appointment.doctor;
    appointment.appointmentDate = req.body.appointmentDate || appointment.appointmentDate;
    appointment.appointmentTime = req.body.appointmentTime || appointment.appointmentTime;
    appointment.reason = req.body.reason || appointment.reason;
    
    // Status can only be changed by admin or if patient is cancelling
    if (req.body.status) {
      if (isAdmin) {
        appointment.status = req.body.status;
      } else if (isOwner && req.body.status === "Cancelled") {
        appointment.status = "Cancelled";
      } else {
        return res.status(403).json({
          message: "Access denied: Only admins can change status (except cancellation)",
        });
      }
    }

    const updatedAppointment = await appointment.save();

    // If status changed, send notification to the patient
    if (oldStatus !== updatedAppointment.status) {
      await Notification.create({
        user: updatedAppointment.patient,
        title: `Appointment ${updatedAppointment.status}`,
        message: `Your appointment with ${updatedAppointment.doctor} has been ${updatedAppointment.status.toLowerCase()}.`,
      });
    }

    // Populate patient info before sending back
    const populated = await Appointment.findById(updatedAppointment._id).populate("patient", "name email phone");

    res.json(populated);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Appointment (Admin or Owner Patient)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = appointment.patient.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Access denied: Not authorized to delete this appointment",
      });
    }

    await appointment.deleteOne();

    res.json({
      message: "Appointment deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};