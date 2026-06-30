import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppointmentCard from "../components/AppointmentCard";
import Loader from "../components/Loader";
import { getAppointments, updateAppointment } from "../services/appointmentService";
import { FaCalendarAlt, FaCalendarPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAppointmentsList = async () => {
    try {
      setLoading(true);
      const { data } = await getAppointments();
      // Filter for upcoming/active ones: Pending or Approved
      const activeApps = data.filter(
        (app) => app.status === "Pending" || app.status === "Approved"
      );
      setAppointments(activeApps);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsList();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      setError("");
      setSuccess("");
      await updateAppointment(id, { status: "Cancelled" });
      setSuccess("Appointment cancelled successfully.");
      fetchAppointmentsList();
    } catch (err) {
      setError("Failed to cancel appointment. Please try again.");
    }
  };

  const handleRescheduleAppointment = async (id, date, time) => {
    try {
      setError("");
      setSuccess("");
      // Verify date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError("Reschedule date cannot be in the past.");
        return;
      }

      await updateAppointment(id, {
        appointmentDate: date,
        appointmentTime: time,
      });
      setSuccess("Appointment rescheduled successfully.");
      fetchAppointmentsList();
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to reschedule appointment."
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">My Appointments</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              View or reschedule your active and pending consultations
            </p>
          </div>

          <Link
            to="/book"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <FaCalendarPlus />
            Book New
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/40 mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 mb-6 text-sm">
            {success}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center shadow-sm">
            <FaCalendarAlt className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Active Appointments</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
              You do not have any pending or approved medical consultations scheduled at the moment.
            </p>
            <Link
              to="/book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-block cursor-pointer text-sm"
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((item) => (
              <AppointmentCard
                key={item._id}
                appointment={item}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;