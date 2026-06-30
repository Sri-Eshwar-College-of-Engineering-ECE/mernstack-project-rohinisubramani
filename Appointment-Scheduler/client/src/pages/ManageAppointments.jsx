import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { getAllAppointments } from "../services/adminService";
import { updateAppointment } from "../services/appointmentService";
import { formatDate } from "../utils/formatDate";
import { FaCalendarAlt, FaSearch, FaFilter, FaClock } from "react-icons/fa";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAppointmentsList = async () => {
    try {
      setLoading(true);
      const { data } = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      setError("Failed to fetch system appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsList();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setError("");
      setSuccess("");
      await updateAppointment(id, { status });
      setSuccess(`Appointment status successfully updated to "${status}".`);
      
      // Update local state state to reflect status change immediately
      setAppointments((prevApps) =>
        prevApps.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      setError("Failed to update appointment status. Please try again.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40";
      case "Pending":
        return "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/40";
      case "Completed":
        return "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40";
      case "Cancelled":
        return "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    const patientName = item.patient ? item.patient.name.toLowerCase() : "";
    const doctorName = item.doctor.toLowerCase();
    const matchesSearch =
      patientName.includes(search.toLowerCase()) || doctorName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Manage Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review patient bookings, update statuses, and approve medical visits
          </p>
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

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name or specialist doctor..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400 text-sm hidden md:block" />
            <select
              className="w-full md:w-48 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center shadow-sm">
            <FaCalendarAlt className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Appointments Registered</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No medical visits match your search queries or filter categories.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                    <th className="p-5">Patient Details</th>
                    <th className="p-5">Assigned Specialist</th>
                    <th className="p-5">Date & Time</th>
                    <th className="p-5">Visit Reason</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                  {filteredAppointments.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="p-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {app.patient ? app.patient.name : "N/A"}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {app.patient ? app.patient.email : "Deleted Account"}
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-slate-700 dark:text-slate-200">
                        {app.doctor}
                      </td>
                      <td className="p-5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {formatDate(app.appointmentDate)}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <FaClock className="text-slate-400" />
                          {app.appointmentTime}
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={app.reason}>
                        {app.reason}
                      </td>
                      <td className="p-5">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <select
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer text-slate-700 dark:text-slate-200"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approve</option>
                          <option value="Completed">Complete</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;