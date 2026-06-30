import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaCalendarAlt,
  FaCalendarPlus,
  FaHistory,
  FaUser,
  FaBell,
  FaUsers,
  FaBriefcaseMedical,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive(path)
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800/40"
    }`;

  const renderPatientLinks = () => (
    <ul className="space-y-2">
      <li>
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <FaHome className="text-lg" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/book" className={linkClass("/book")}>
          <FaCalendarPlus className="text-lg" />
          <span>Book Appointment</span>
        </Link>
      </li>
      <li>
        <Link to="/appointments" className={linkClass("/appointments")}>
          <FaCalendarAlt className="text-lg" />
          <span>My Appointments</span>
        </Link>
      </li>
      <li>
        <Link to="/history" className={linkClass("/history")}>
          <FaHistory className="text-lg" />
          <span>History</span>
        </Link>
      </li>
      <li>
        <Link to="/notifications" className={linkClass("/notifications")}>
          <FaBell className="text-lg" />
          <span>Notifications</span>
        </Link>
      </li>
      <li>
        <Link to="/profile" className={linkClass("/profile")}>
          <FaUser className="text-lg" />
          <span>Profile</span>
        </Link>
      </li>
    </ul>
  );

  const renderAdminLinks = () => (
    <ul className="space-y-2">
      <li>
        <Link to="/admin" className={linkClass("/admin")}>
          <FaHome className="text-lg" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/admin/appointments" className={linkClass("/admin/appointments")}>
          <FaBriefcaseMedical className="text-lg" />
          <span>Manage Appointments</span>
        </Link>
      </li>
      <li>
        <Link to="/admin/users" className={linkClass("/admin/users")}>
          <FaUsers className="text-lg" />
          <span>Manage Users</span>
        </Link>
      </li>
      <li>
        <Link to="/notifications" className={linkClass("/notifications")}>
          <FaBell className="text-lg" />
          <span>Notifications</span>
        </Link>
      </li>
      <li>
        <Link to="/profile" className={linkClass("/profile")}>
          <FaUser className="text-lg" />
          <span>Profile</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <aside className="w-64 min-h-[calc(100vh-73px)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between transition-colors duration-300">
      <div className="space-y-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-4">
          Navigation Menu
        </p>
        <nav>
          {user.role === "admin" ? renderAdminLinks() : renderPatientLinks()}
        </nav>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Logged in as:</p>
        <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">
          {user.name}
        </p>
        <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full inline-block mt-1">
          {user.role}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;