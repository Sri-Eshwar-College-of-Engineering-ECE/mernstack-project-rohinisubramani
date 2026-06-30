import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "../components/StatsCard";
import CalendarView from "../components/CalendarView";
import Loader from "../components/Loader";
import { getAppointments } from "../services/appointmentService";
import { formatDate } from "../utils/formatDate";
import { FaCalendarPlus, FaClock, FaUserMd } from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data } = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  // Calculate live stats
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const approvedCount = appointments.filter((a) => a.status === "Approved").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;

  // Filter appointments for the selected date on the calendar
  const selectedDateApps = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    return (
      appDate.getDate() === date.getDate() &&
      appDate.getMonth() === date.getMonth() &&
      appDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight">Patient Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal medical appointment schedules
            </p>
          </motion.div>

          <Link
            to="/book"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <FaCalendarPlus />
            Book New Appointment
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/40 mb-6">
            {error}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatsCard title="Pending" value={pendingCount} color="bg-yellow-500" />
          <StatsCard title="Approved" value={approvedCount} color="bg-blue-500" />
          <StatsCard title="Completed" value={completedCount} color="bg-green-500" />
          <StatsCard title="Cancelled" value={cancelledCount} color="bg-red-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <CalendarView value={date} onChange={setDate} appointments={appointments} />
          </div>

          {/* Day Details panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4">
              Schedule for {date.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
            </h2>

            {selectedDateApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-center">
                <FaClock className="text-4xl mb-3 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-medium">No appointments scheduled for this date.</p>
                <Link to="/book" className="text-blue-500 text-xs hover:underline mt-2">
                  Book one now
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {selectedDateApps.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
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
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                        <FaClock />
                        {app.appointmentTime}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1.5">
                      <FaUserMd className="text-blue-500" />
                      {app.doctor}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      Reason: {app.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;