import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <FaCalendarAlt className="text-xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Schedulify
          </h1>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-6">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4">
              {/* User Profile Summary */}
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-85">
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.avatar}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pravatar.cc/100";
                    }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-200 dark:border-blue-800">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold leading-tight">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                    {user.role}
                  </span>
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/30 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 p-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;