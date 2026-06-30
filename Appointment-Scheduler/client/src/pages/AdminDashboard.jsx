import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";
import { getAdminStats, getAllAppointments } from "../services/adminService";
import { formatDate } from "../utils/formatDate";
import { FaUsers, FaCalendarAlt, FaCalendarCheck, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, appsRes] = await Promise.all([
          getAdminStats(),
          getAllAppointments(),
        ]);
        setStats(statsRes.data);
        setAppointments(appsRes.data.slice(0, 5)); // Show latest 5 appointments
      } catch (err) {
        setError("Failed to load admin stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  if (loading) return <Loader />;

  const statsData = [
    {
      title: "Total Patients",
      value: stats ? stats.totalUsers : 0,
      color: "bg-blue-500",
      icon: <FaUsers className="text-white text-2xl" />,
    },
    {
      title: "Appointments",
      value: stats ? stats.totalAppointments : 0,
      color: "bg-green-500",
      icon: <FaCalendarAlt className="text-white text-2xl" />,
    },
    {
      title: "Completed",
      value: stats ? stats.completed : 0,
      color: "bg-purple-500",
      icon: <FaCalendarCheck className="text-white text-2xl" />,
    },
    {
      title: "Pending Approval",
      value: stats ? stats.pending : 0,
      color: "bg-yellow-500",
      icon: <FaClock className="text-white text-2xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            System overview and appointment operations management center
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/40 mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsData.map((item, index) => (
            <StatsCard
              key={index}
              title={item.title}
              value={item.value}
              color={item.color}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Dashboard Main View */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Appointments List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Appointments</h2>
              <Link
                to="/admin/appointments"
                className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            {appointments.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-10">
                No appointments registered in the database.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((app) => (
                  <div key={app._id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {app.patient ? app.patient.name : "Unknown Patient"}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Assigned to: <span className="font-semibold">{app.doctor}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                        {formatDate(app.appointmentDate)} at {app.appointmentTime}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          app.status === "Approved"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"
                            : app.status === "Pending"
                            ? "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/40"
                            : app.status === "Completed"
                            ? "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40"
                            : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Quick Management Actions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Administrative access links to moderate users and update schedules
              </p>
              <div className="space-y-3">
                <Link
                  to="/admin/appointments"
                  className="w-full text-center block bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700/60 dark:hover:text-blue-400 p-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Manage Appointments
                </Link>
                <Link
                  to="/admin/users"
                  className="w-full text-center block bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700/60 dark:hover:text-blue-400 p-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Manage Patients
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-600 font-medium">
              Schedulify Administrative Console v1.0.0
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;