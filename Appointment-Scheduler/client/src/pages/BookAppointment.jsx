import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createAppointment } from "../services/appointmentService";
import { FaCalendarAlt, FaUserMd, FaNotesMedical, FaClock } from "react-icons/fa";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctor: "Dr. Kumar (Cardiology)",
    appointmentDate: "",
    appointmentTime: "09:00",
    reason: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const doctorsList = [
    "Dr. Kumar (Cardiology)",
    "Dr. Priya (Dermatology)",
    "Dr. Ravi (Pediatrics)",
    "Dr. Mehta (General Physician)",
    "Dr. Sen (Neurology)",
  ];

  const timeslots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { doctor, appointmentDate, appointmentTime, reason } = formData;

    if (!doctor || !appointmentDate || !appointmentTime || !reason) {
      setError("All fields are required.");
      return;
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Appointment date cannot be in the past.");
      return;
    }

    try {
      setLoading(true);
      await createAppointment(formData);
      setSuccess("Appointment booked successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to book appointment. The slot might already be taken."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 dark:bg-slate-950 p-6 md:p-8 flex justify-center items-center transition-colors duration-300 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Book Appointment</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Schedule a consultation with our medical specialists
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/40">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm mb-6 border border-emerald-100 dark:border-emerald-900/40">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Doctor */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaUserMd className="text-blue-500" />
              Choose Specialist
            </label>
            <select
              name="doctor"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              onChange={handleChange}
              value={formData.doctor}
              disabled={loading}
            >
              {doctorsList.map((doc, idx) => (
                <option key={idx} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Preferred Date
            </label>
            <input
              type="date"
              name="appointmentDate"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              onChange={handleChange}
              value={formData.appointmentDate}
              disabled={loading}
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Available Slots
            </label>
            <select
              name="appointmentTime"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              onChange={handleChange}
              value={formData.appointmentTime}
              disabled={loading}
            >
              {timeslots.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Reason for Appointment */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaNotesMedical className="text-blue-500" />
              Reason for Visit
            </label>
            <textarea
              name="reason"
              placeholder="Please describe your symptoms or visit reasons..."
              rows="3"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              onChange={handleChange}
              value={formData.reason}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer mt-6 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Confirm Appointment Booking"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookAppointment;